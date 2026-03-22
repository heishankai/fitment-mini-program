<template>
  <view class="container">
    <scroll-view
      class="scroll-view"
      scroll-y
      :show-scrollbar="false"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
    >
      <!-- 工价列表 -->
      <view v-if="work_price_list?.length" class="work-price-list">
        <view v-for="item in work_price_list" :key="item?.id" class="item-card">
          <view class="item-header">
            <view class="work-title">{{ item?.work_title }}</view>
            <view class="unit-price">¥{{ item?.work_price }}/{{ item?.labour_cost_name }}</view>
          </view>
          <view class="item-content">
            <text class="spec">{{ item?.quantity }} {{ item?.labour_cost_name }}</text>
            <view v-if="item?.is_set_minimum_price === '1'" class="min-price-tag">
              起步价 ¥{{ item?.minimum_price }}
            </view>
          </view>
          <view class="item-footer">
            <view class="subtotal">小计 ¥{{ getItemSubtotal(item) }}</view>
            <view class="actions">
              <view class="btn-pay" v-if="!item?.is_paid" @tap="handlePay(item)">确认支付</view>
              <view
                v-if="item?.is_paid"
                class="accept-btn"
                :class="{ accepted: item?.is_accepted }"
                @tap="handleAcceptWorkPrice(item)"
              >
                <uni-icons
                  v-if="item?.is_accepted"
                  type="checkmarkempty"
                  size="12"
                  color="#07c160"
                />
                <text>{{ item?.is_accepted ? '已验收' : '确认验收' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <empty-state v-else text="暂无工价" />
    </scroll-view>

    <!-- 底部汇总栏 -->
    <view class="bottom-bar" v-if="work_price_list?.length">
      <view class="bottom-bar-item" v-if="showBatchPay(work_price_list)" @tap="handleBatchPay">
        一键支付
      </view>
      <view
        class="bottom-bar-item"
        v-if="showBatchAccept(work_price_list)"
        @tap="handleBatchAccept"
      >
        一键验收
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ORDER_TYPE_ENUM } from '@/constant'
import {
  getWorkPriceListByWorkPriceItemId,
  getWorkPriceListByOrderId,
  getPayParamsForWorkPriceService,
  acceptOrderWorkPriceService,
  acceptOrderWorkPriceBatchService,
} from './service'
import { getItemSubtotal, showBatchPay, showBatchAccept, flattenWorkPriceList } from './utils'

const params = ref<any>({})
const work_price_list = ref<any>({})
const isTriggered = ref(false)

const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadWorkPriceList(params?.value)
  isTriggered.value = false
}

// 加载工价列表
const loadWorkPriceList = async (paramsValue): Promise<void> => {
  const { orderId, workPriceItemId, craftsmanId, order_type } = paramsValue ?? {}

  if (order_type === ORDER_TYPE_ENUM.CRAFTSMAN) {
    const { success, data } = await getWorkPriceListByOrderId(orderId)
    if (!success) return
    console.log(data, '工匠单')
    const { main_work_price_group, sub_work_price_groups } = data ?? {}
    work_price_list.value = flattenWorkPriceList(main_work_price_group, sub_work_price_groups)
    return
  }

  const { success, data } = await getWorkPriceListByWorkPriceItemId(workPriceItemId, craftsmanId)
  if (!success) return
  const { main_work_price_group, sub_work_price_groups } = data ?? {}
  work_price_list.value = flattenWorkPriceList(main_work_price_group, sub_work_price_groups)
}

/** 单项支付 */
const handlePay = (item: any): void => {
  if (item?.is_paid) return
  uni?.vibrateShort()
  wx.showModal({
    title: '确认支付',
    content: '确定要支付此项工价吗？',
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#2d635e',
    success: async (modalRes) => {
      if (!modalRes.confirm) return
      const amount = Number(item?.settlement_amount) || Number(getItemSubtotal(item)) || 0
      uni.showLoading({ title: '获取支付参数...', mask: true })
      const { success, data } = await getPayParamsForWorkPriceService({
        pay_type: 'work_price_single',
        workPriceItemId: item?.id,
        order_amount: amount,
      })
      uni.hideLoading()
      if (!success) {
        uni.showToast({ title: '获取支付参数失败', icon: 'none' })
        return
      }
      uni.requestPayment({
        provider: 'wxpay',
        ...data,
        success: () => {
          uni.showToast({ title: '支付成功', icon: 'success' })
          loadWorkPriceList(params.value)
        },
      })
    },
  })
}

/** 一键支付：批量支付全部未支付的工价 */
const handleBatchPay = async (): Promise<void> => {
  uni?.vibrateShort()
  const list = work_price_list.value
  if (!list?.length) {
    uni.showToast({ title: '工价信息错误', icon: 'none' })
    return
  }
  const unpaidList = list.filter((i) => !i?.is_paid)
  if (!unpaidList.length) {
    uni.showToast({ title: '没有未支付的工价', icon: 'none' })
    return
  }
  const totalAmount = unpaidList.reduce(
    (sum, i) => sum + (Number(i?.settlement_amount) || Number(getItemSubtotal(i)) || 0),
    0,
  )
  const workPriceItemIds = unpaidList.map((i) => i?.id)
  wx.showModal({
    title: '确认支付',
    content: `确定要支付 ${unpaidList.length} 项工价吗？`,
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#2d635e',
    success: async (modalRes) => {
      if (!modalRes.confirm) return
      uni.showLoading({ title: '获取支付参数...', mask: true })
      const { success, data } = await getPayParamsForWorkPriceService({
        pay_type: 'work_price_batch',
        workPriceItemIds,
        order_amount: totalAmount,
      })
      uni.hideLoading()
      if (!success) {
        uni.showToast({ title: '获取支付参数失败', icon: 'none' })
        return
      }
      uni.requestPayment({
        provider: 'wxpay',
        ...data,
        success: () => {
          uni.showToast({ title: '支付成功', icon: 'success' })
          loadWorkPriceList(params.value)
        },
      })
    },
  })
}

/** 一键验收：批量验收全部 已支付未验收 的工价 */
const handleBatchAccept = async (): Promise<void> => {
  uni?.vibrateShort()
  const list = work_price_list.value

  if (!list?.length) {
    uni.showToast({ title: '工价信息错误', icon: 'none' })
    return
  }

  const unacceptedIds = (list || []).filter((i) => i?.is_paid && !i?.is_accepted).map((i) => i?.id)

  if (!unacceptedIds.length) {
    uni.showToast({ title: '没有未验收的工价', icon: 'none' })
    return
  }

  wx.showModal({
    title: '确认验收',
    content: `确定要验收 ${unacceptedIds.length} 项工价吗？`,
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#2d635e',
    success: async (result) => {
      if (!result.confirm) return
      const { success } = await acceptOrderWorkPriceBatchService({
        work_price_item_ids: unacceptedIds,
      })
      if (success) {
        uni.showToast({ title: '验收成功', icon: 'success' })
        loadWorkPriceList(params.value)
      }
    },
  })
}

// 单项验收
const handleAcceptWorkPrice = async (item: any): Promise<void> => {
  if (item?.is_accepted) return
  wx.showModal({
    title: '确认验收',
    content: '确定要验收此项工价吗？',
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#2d635e',
    success: async (result) => {
      if (!result.confirm) return
      const { success } = await acceptOrderWorkPriceService({ work_price_item_id: item?.id })
      if (success) {
        uni.showToast({ title: '验收成功', icon: 'success' })
        loadWorkPriceList(params.value)
      }
    },
  })
}

onLoad((options) => {
  params.value = options ?? {}
  loadWorkPriceList(options)
})
</script>

<style lang="scss">
/* 页面容器 */
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

.work-price-list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.item-card {
  padding: 28rpx;
  background: $uni-bg-color;
  border-radius: $uni-border-radius-base;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid $uni-border-color;

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16rpx;

    .work-title {
      flex: 1;
      color: $uni-text-color;
      font-size: 30rpx;
      font-weight: 600;
      line-height: 1.4;
    }

    .unit-price {
      flex-shrink: 0;
      margin-left: 16rpx;
      color: $uni-color-primary;
      font-size: 26rpx;
      font-weight: 500;
    }
  }

  .item-content {
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    flex-wrap: wrap;

    .spec {
      color: $uni-text-color-grey;
      font-size: 24rpx;
    }

    .min-price-tag {
      padding: 4rpx 12rpx;
      background: $uni-bg-color-grey;
      border-radius: $uni-border-radius-sm;
      color: $uni-text-color-grey;
      font-size: 22rpx;
    }
  }

  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid $uni-border-color;

    .subtotal {
      color: $uni-text-color;
      font-size: 28rpx;
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: 16rpx;
    }

    .btn-pay {
      padding: 12rpx 28rpx;
      background: $uni-color-primary;
      border-radius: 24rpx;
      font-size: 24rpx;
      color: #fff;
      font-weight: 500;
    }

    .accept-btn {
      padding: 12rpx 28rpx;
      border-radius: 24rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #fff;
      background: $uni-color-primary;
      display: flex;
      align-items: center;
      gap: 8rpx;

      &.accepted {
        background: transparent;
        color: $uni-color-success;
        padding: 0;
        font-size: 24rpx;
        font-weight: 400;
      }
    }
  }
}

.bottom-bar {
  padding: 12px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: #fff;
  border-top: 2rpx solid #f0f0f0;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.bottom-bar-item {
  padding: 16px;
  display: flex;
  padding-right: 0;
  justify-content: center;
  align-items: center;

  border-radius: 14px;
  background: #2d635e;
  box-shadow:
    0 20px 25px -5px rgba(45, 99, 94, 0.2),
    0 8px 10px -6px rgba(45, 99, 94, 0.2);

  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.312px;
}
</style>
