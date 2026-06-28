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
          <view class="item-name-row" @tap.stop="goWorkPriceDetail(item)">
            <text class="item-name">{{ item?.work_title }}</text>
            <uni-icons type="right" size="14" color="#b8b8b8" />
          </view>
          <text class="item-meta">
            ¥{{ item?.work_price }}/{{ item?.labour_cost_name }} × {{ item?.quantity }}
            {{ item?.labour_cost_name }}
          </text>
          <view v-if="item?.is_set_minimum_price === '1'" class="min-price-tag">
            起步价 ¥{{ item?.minimum_price }}
          </view>
          <view class="item-footer">
            <text class="item-subtotal">¥{{ getItemSubtotal(item) }}</text>

            <view
              v-if="item?.is_paid"
              class="accept-status"
              :class="{ accepted: item?.is_accepted }"
            >
              <uni-icons
                type="checkmarkempty"
                size="13"
                :color="item?.is_accepted ? STATUS_COMPLETED_COLOR : STATUS_PENDING_COLOR"
              />
              <text>{{ item?.is_accepted ? '已验收' : '待验收' }}</text>
            </view>

            <view v-else class="accept-status">
              <uni-icons type="wallet" size="13" :color="STATUS_PENDING_COLOR" />
              <text>待支付</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <empty-state v-else text="暂无工价" />
    </scroll-view>

    <!-- 底部汇总栏 -->
    <view v-if="work_price_list?.length" class="bottom-bar">
      <view class="summary-row">
        <text class="summary-label">工价合计</text>
        <text class="summary-count">共 {{ work_price_list.length }} 项</text>
      </view>
      <view class="summary-row total-row">
        <text class="total-label">总价</text>
        <text class="total-price">¥{{ work_price_total }}</text>
      </view>
      <view v-if="showBatchPay(work_price_list)" class="summary-row unpaid-row">
        <text class="unpaid-label">待支付合计</text>
        <text class="unpaid-price">¥{{ unpaidTotalAmount }}</text>
      </view>
      <button v-if="showBatchPay(work_price_list)" class="batch-action-btn" @tap="handleBatchPay">
        <uni-icons type="checkbox" size="18" color="#fff" />
        <text>全部支付</text>
      </button>
      <button
        v-else-if="showBatchAccept(work_price_list)"
        class="batch-action-btn"
        @tap="handleBatchAccept"
      >
        <uni-icons type="checkbox" size="18" color="#fff" />
        <text>全部验收</text>
      </button>
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

const STATUS_PENDING_COLOR = '#e6a23c'
const STATUS_COMPLETED_COLOR = '#2d635e'

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

const work_price_total = computed(() => {
  return work_price_list.value
    .reduce((sum, item) => sum.plus(getItemSubtotal(item)), new Decimal(0))
    .toFixed(2)
})

const unpaidTotalAmount = computed(() => {
  return work_price_list.value
    .filter((item) => !item?.is_paid)
    .reduce(
      (sum, item) =>
        sum.plus(new Decimal(Number(item?.settlement_amount) || getItemSubtotal(item) || 0)),
      new Decimal(0),
    )
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
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .item-card {
    padding: 32rpx;
    background: $uni-bg-color;
    border-radius: $uni-border-radius-base;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .item-name-row {
      display: flex;
      align-items: flex-start;
      gap: 8rpx;
      min-width: 0;

      .item-name {
        flex: 1;
        min-width: 0;
        font-size: 36rpx;
        font-weight: 600;
        color: $uni-text-color;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    .item-meta {
      font-size: 28rpx;
      color: $uni-text-color-grey;
    }

    .min-price-tag {
      align-self: flex-start;
      padding: 4rpx 12rpx;
      background: $uni-bg-color-grey;
      border-radius: $uni-border-radius-sm;
      color: $uni-text-color-grey;
      font-size: 22rpx;
    }

    .item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item-subtotal {
        font-size: 36rpx;
        font-weight: 600;
        color: $uni-color-primary;
      }

      .accept-status {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        padding: 12rpx 24rpx;
        border-radius: 16rpx;
        color: #e6a23c;
        background: #fdf6ec;

        &.accepted {
          color: #2d635e;
          background: #edf7f2;
        }
      }
    }
  }
}

.bottom-bar {
  flex-shrink: 0;
  background: $uni-bg-color;
  border-top: 2rpx solid $uni-border-color;
  padding: 24rpx 32rpx;
  padding-bottom: max(24rpx, env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);

  .summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    &.total-row {
      margin-bottom: 24rpx;

      .total-label {
        font-size: 30rpx;
        font-weight: 600;
        color: $uni-text-color;
      }

      .total-price {
        font-size: 40rpx;
        font-weight: 700;
        color: $uni-color-primary;
      }
    }

    &.unpaid-row {
      margin-bottom: 24rpx;

      .unpaid-label {
        font-size: 28rpx;
        font-weight: 500;
        color: $uni-text-color;
      }

      .unpaid-price {
        font-size: 36rpx;
        font-weight: 700;
        color: #e6a23c;
      }
    }

    .summary-label {
      font-size: 28rpx;
      color: $uni-text-color-grey;
    }

    .summary-count {
      font-size: 24rpx;
      color: $uni-text-color-placeholder;
    }
  }

  .batch-action-btn {
    width: 100%;
    padding: 12rpx;
    border-radius: 24rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
    background: $uni-color-primary;

    text {
      margin-left: 8rpx;
    }
  }
}
</style>
