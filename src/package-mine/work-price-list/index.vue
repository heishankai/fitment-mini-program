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
        <view class="summary-card">
          <view class="summary-label">工价合计</view>
          <view class="summary-value">¥{{ work_price_total }}</view>
        </view>
        <view v-for="item in work_price_list" :key="item?.id" class="item-card">
          <view class="item-header">
            <view class="work-title" @tap.stop="goWorkPriceDetail(item)">
              <text class="work-title-text">{{ item?.work_title }}</text>
              <view class="work-title-icon">
                <uni-icons type="right" size="14" color="#2d635e" />
              </view>
            </view>
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
            <view class="status-group">
              <view class="status-tag" :class="{ active: item?.is_paid }">
                {{ item?.is_paid ? '已支付' : '未支付' }}
              </view>
              <view class="status-tag" :class="{ active: item?.is_accepted }">
                {{ item?.is_accepted ? '已验收' : '未验收' }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <empty-state v-else text="暂无工价" />
    </scroll-view>

    <!-- 底部汇总栏 -->
    <view class="bottom-bar" v-if="showActionBar">
      <view
        class="bottom-bar-item"
        v-if="showBatchPay(work_price_list)"
        @tap="handleBatchPay"
      >
        <uni-icons type="wallet" size="20" color="#fff" />
        <text>一键支付</text>
      </view>
      <view
        class="bottom-bar-item"
        v-if="showBatchAccept(work_price_list)"
        @tap="handleBatchAccept"
      >
        <uni-icons type="checkmarkempty" size="20" color="#fff" />
        <text>一键验收</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ORDER_TYPE_ENUM } from '@/constant'
import Decimal from 'decimal.js'
import {
  getWorkPriceListByWorkPriceItemId,
  getWorkPriceListByOrderId,
  getPayParamsForWorkPriceService,
  acceptOrderWorkPriceBatchService,
} from './service'
import { getItemSubtotal, showBatchPay, showBatchAccept, flattenWorkPriceList } from './utils'

const params = ref<any>({})
const work_price_list = ref<any[]>([])
const isTriggered = ref(false)

const normalizeParam = (value: unknown): string => {
  if (value == null) return ''
  const text = String(value)
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

const hasValidCraftsmanId = (value: unknown): boolean => {
  const text = normalizeParam(value)
  return text !== '' && text !== 'null' && text !== 'undefined'
}

const showActionBar = computed(
  () =>
    showBatchPay(work_price_list.value) ||
    showBatchAccept(work_price_list.value),
)

const work_price_total = computed(() => {
  return work_price_list.value
    .reduce((sum, item) => sum.plus(getItemSubtotal(item)), new Decimal(0))
    .toFixed(2)
})

const parseWorkPriceItemIds = (value: unknown): number[] =>
  normalizeParam(value)
    .split(',')
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id))

const filterWorkPriceListByNode = (list: any[], paramsValue: any): any[] => {
  const ids = parseWorkPriceItemIds(paramsValue?.workPriceItemIds)
  if (ids.length > 0) {
    const idSet = new Set(ids)
    return list.filter((item) => idSet.has(Number(item?.id)))
  }

  const workKindCode = normalizeParam(paramsValue?.workKindCode)
  if (workKindCode) {
    return list.filter((item) => item?.work_kind_code === workKindCode)
  }

  const workKindName = normalizeParam(paramsValue?.workKindName)
  if (workKindName) {
    return list.filter((item) => item?.work_kind_name === workKindName)
  }

  const workPriceItemId = Number(paramsValue?.workPriceItemId)
  if (Number.isFinite(workPriceItemId)) {
    return list.filter((item) => Number(item?.id) === workPriceItemId)
  }

  return list
}

const goWorkPriceDetail = (item: any): void => {
  const workPriceId = item?.work_price_id
  if (!workPriceId) {
    uni.showToast({ title: '暂无工价详情', icon: 'none' })
    return
  }

  uni.navigateTo({
    url: `/package-labor-cost/labor-price-detail/index?id=${workPriceId}`,
  })
}

const loadWorkPriceListByOrderId = async (
  orderId: number | string,
  paramsValue: any,
): Promise<void> => {
  if (!orderId) {
    work_price_list.value = []
    return
  }
  const { success, data } = await getWorkPriceListByOrderId(orderId)
  if (!success) return
  const { main_work_price_group, sub_work_price_groups } = data ?? {}
  const list = flattenWorkPriceList(main_work_price_group, sub_work_price_groups)
  work_price_list.value = filterWorkPriceListByNode(list, paramsValue)
}

const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadWorkPriceList(params?.value)
  isTriggered.value = false
}

// 加载工价列表
const loadWorkPriceList = async (paramsValue): Promise<void> => {
  const { orderId, workPriceItemId, craftsmanId, order_type } = paramsValue ?? {}

  if (order_type === ORDER_TYPE_ENUM.CRAFTSMAN) {
    await loadWorkPriceListByOrderId(orderId, paramsValue)
    return
  }

  if (!hasValidCraftsmanId(craftsmanId)) {
    await loadWorkPriceListByOrderId(orderId, paramsValue)
    return
  }

  const { success, data } = await getWorkPriceListByWorkPriceItemId(workPriceItemId, craftsmanId)
  if (!success) return
  const { main_work_price_group, sub_work_price_groups } = data ?? {}
  work_price_list.value = flattenWorkPriceList(main_work_price_group, sub_work_price_groups)
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

.summary-card {
  padding: 28rpx;
  background: linear-gradient(135deg, #2d635e 0%, #3f7c75 100%);
  border-radius: $uni-border-radius-base;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8rpx 24rpx rgba(45, 99, 94, 0.18);

  .summary-label {
    color: rgba(255, 255, 255, 0.86);
    font-size: 26rpx;
    font-weight: 500;
  }

  .summary-value {
    color: #fff;
    font-size: 38rpx;
    font-weight: 700;
  }
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
      position: relative;
      padding-right: 34rpx;
      min-width: 0;

      .work-title-text {
        word-break: break-all;
      }

      .work-title-icon {
        position: absolute;
        right: 0;
        top: 7rpx;
        width: 28rpx;
        height: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
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

    .status-group {
      display: flex;
      gap: 12rpx;
      flex-wrap: wrap;
    }

    .status-tag {
      padding: 8rpx 18rpx;
      border-radius: 999rpx;
      background: $uni-bg-color-grey;
      color: $uni-text-color-grey;
      font-size: 24rpx;
      font-weight: 500;

      &.active {
        background: rgba(7, 193, 96, 0.1);
        color: $uni-color-success;
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
  gap: 8px;

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
