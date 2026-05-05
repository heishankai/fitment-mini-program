<template>
  <view class="order-cost">
    <node-description title="费用总计">
      <view class="payment-record-entry" @tap="handleViewPaymentRecords">
        <view class="record-entry-left">
          <view class="record-entry-icon">
            <uni-icons type="eye" size="16" color="#2d635e" />
          </view>
          <view class="record-entry-text">
            <view class="record-entry-title">付款记录</view>
            <view class="record-entry-desc">查看辅材、工价、平台服务费等支付明细</view>
          </view>
        </view>
        <uni-icons type="right" size="16" color="#A8ADAD" />
      </view>
    </node-description>
    <view class="cost-summary">
      <view class="title">合计费用</view>
      <view class="amount">¥{{ calculateFinalTotal(order_details) }}</view>
    </view>
    <view class="cost-summary">
      <view class="title">工价合计</view>
      <view class="amount">¥{{ order_details?.total_price }}</view>
    </view>
    <view
      v-for="(row, idx) in platformServiceFeeRows"
      :key="'platform-fee-' + idx"
      class="cost-summary"
    >
      <view class="title">
        {{ platformServiceFeeRows.length > 1 ? `平台服务费 (${idx + 1})` : '平台服务费' }}
      </view>
      <view class="amount-wrap">
        <view class="amount">¥{{ row.amount }}</view>
        <view v-if="row.is_paid" class="pay-btn pay-btn--disabled">已支付</view>
        <view v-else class="pay-btn" @tap="handlePayServiceFee(row)">支付</view>
      </view>
    </view>
    <template v-if="order_details?.order_type === 'gangmaster'">
      <view
        v-for="(row, idx) in gangmasterCostRows"
        :key="'gangmaster-fee-' + idx"
        class="cost-summary"
      >
        <view class="title">
          {{
            gangmasterCostRows.length > 1
              ? `工长费用 (${idx + 1})${
                  idx === 0
                    ? ` (上门${order_details?.visiting_service_num ?? 0}次)`
                    : ''
                }`
              : `工长费用 (上门${order_details?.visiting_service_num ?? 0}次)`
          }}
        </view>
        <view class="amount-wrap">
          <view class="amount">¥{{ row.amount }}</view>
          <view v-if="row.is_paid" class="pay-btn pay-btn--disabled">已支付</view>
          <view v-else class="pay-btn" @tap="handlePayGangmasterCost(row)">支付</view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import nodeDescription from '@/components/node-description.vue'
import { calculateFinalTotal, sortFeeDetailsByIndex } from '../utils'
import { getPayParamsForOrderService } from '../service'

const props = defineProps<{
  order_details: any
}>()
const emit = defineEmits<{
  refresh: []
}>()

type FeeRow = { amount: number | string; is_paid: boolean; fee_indexes?: number[] }

/** 平台服务费：以后端 total_service_fee_details 为准 */
const platformServiceFeeRows = computed((): FeeRow[] => {
  const d = props.order_details ?? {}
  const details = d.total_service_fee_details as
    | { index: number; amount: number | string; is_paid: boolean }[]
    | undefined
  if (Array.isArray(details) && details.length > 0) {
    return sortFeeDetailsByIndex(details).map((item) => ({
      amount: item.amount ?? 0,
      is_paid: !!item.is_paid,
      fee_indexes: [Number(item.index)],
    }))
  }
  return [
    {
      amount: d.total_service_fee ?? 0,
      is_paid: !!d.total_service_fee_is_paid,
    },
  ]
})

/** 工长费用：以后端 gangmaster_cost_details 为准 */
const gangmasterCostRows = computed((): FeeRow[] => {
  const d = props.order_details ?? {}
  const details = d.gangmaster_cost_details as
    | { index: number; amount: number | string; is_paid: boolean }[]
    | undefined
  if (Array.isArray(details) && details.length > 0) {
    return sortFeeDetailsByIndex(details).map((item) => ({
      amount: item.amount ?? 0,
      is_paid: !!item.is_paid,
      fee_indexes: [Number(item.index)],
    }))
  }
  return [
    {
      amount: d.gangmaster_cost ?? 0,
      is_paid: !!d.gangmaster_cost_is_paid,
    },
  ]
})

const buildPlatformServicePayPayload = (
  row: FeeRow,
): { order_id: number; order_amount: number; fee_indexes?: number[] } | null => {
  const d = props.order_details ?? {}
  const id = d.id
  if (id == null) return null

  const detailList = d.total_service_fee_details as unknown[] | undefined
  if (Array.isArray(detailList) && detailList.length > 0) {
    if (row.is_paid) return null
    const feeIndexes = resolveFeeIndexes(row)
    if (!feeIndexes) return null
    return {
      order_id: Number(id),
      order_amount: Number(row.amount) || 0,
      fee_indexes: feeIndexes,
    }
  }
  if (d.total_service_fee_is_paid) return null
  return {
    order_id: Number(id),
    order_amount: Number(d.total_service_fee) || 0,
  }
}

const buildGangmasterPayPayload = (
  row: FeeRow,
): { order_id: number; order_amount: number; fee_indexes?: number[] } | null => {
  const d = props.order_details ?? {}
  const id = d.id
  if (id == null) return null

  const detailList = d.gangmaster_cost_details as unknown[] | undefined
  if (Array.isArray(detailList) && detailList.length > 0) {
    if (row.is_paid) return null
    const feeIndexes = resolveFeeIndexes(row)
    if (!feeIndexes) return null
    return {
      order_id: Number(id),
      order_amount: Number(row.amount) || 0,
      fee_indexes: feeIndexes,
    }
  }
  if (d.gangmaster_cost_is_paid) return null
  return {
    order_id: Number(id),
    order_amount: Number(d.gangmaster_cost) || 0,
  }
}

const resolveFeeIndexes = (row: FeeRow): number[] | undefined => {
  if (!Array.isArray(row.fee_indexes) || row.fee_indexes.length === 0) return undefined
  const indexes = row.fee_indexes
    .map((index) => Number(index))
    .filter((index) => Number.isInteger(index) && index >= 0)
  return indexes.length > 0 ? indexes : undefined
}

/** 查看当前用户所有付款记录 */
const handleViewPaymentRecords = (): void => {
  const id = props.order_details?.id
  const query = id != null ? `?orderId=${id}` : ''
  uni.navigateTo({ url: `/package-mine/payment-record/index${query}` })
}

/** 支付平台服务费（按笔） */
const handlePayServiceFee = (row: FeeRow): void => {
  const payload = buildPlatformServicePayPayload(row)
  if (!payload) return
  uni?.vibrateShort()
  wx.showModal({
    title: '确认支付',
    content: '确定要支付平台服务费吗？',
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#2d635e',
    success: async (modalRes) => {
      if (!modalRes.confirm) return
      uni.showLoading({ title: '获取支付参数...', mask: true })
      const { success, data } = await getPayParamsForOrderService({
        pay_type: 'order_platform_service_fee',
        order_id: payload.order_id,
        order_amount: payload.order_amount,
        ...(payload.fee_indexes ? { fee_indexes: payload.fee_indexes } : {}),
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
          emit('refresh')
        },
      })
    },
  })
}

/** 支付工长费用（按笔） */
const handlePayGangmasterCost = (row: FeeRow): void => {
  const payload = buildGangmasterPayPayload(row)
  if (!payload) return
  uni?.vibrateShort()
  wx.showModal({
    title: '确认支付',
    content: '确定要支付工长费用吗？',
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#2d635e',
    success: async (modalRes) => {
      if (!modalRes.confirm) return
      uni.showLoading({ title: '获取支付参数...', mask: true })
      const { success, data } = await getPayParamsForOrderService({
        pay_type: 'order_gangmaster_cost',
        order_id: payload.order_id,
        order_amount: payload.order_amount,
        ...(payload.fee_indexes ? { fee_indexes: payload.fee_indexes } : {}),
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
          emit('refresh')
        },
      })
    },
  })
}
</script>

<style lang="scss" scoped>
.order-cost {
  margin-top: 24px;
}

.payment-record-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.record-entry-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.record-entry-icon {
  width: 56rpx;
  height: 56rpx;
  margin-right: 20rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf5f3;
  flex-shrink: 0;
}

.record-entry-text {
  min-width: 0;
}

.record-entry-title {
  color: #1e2222;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 40rpx;
}

.record-entry-desc {
  margin-top: 4rpx;
  color: #8a8f8f;
  font-size: 22rpx;
  line-height: 32rpx;
}

.cost-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title {
    color: #666;
    font-size: 14px;
    font-weight: 300;
    line-height: 21px;
    letter-spacing: -0.15px;
  }

  .amount {
    color: #222;
    font-size: 15px;
    font-weight: 400;
    line-height: 22.5px;
  }

  .amount-wrap {
    display: flex;
    align-items: center;

    .pay-btn {
      margin-left: 8px;
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 12rpx 32rpx;
      background: #2d635e;
      border: 0.701px solid #2d635e;
      border-radius: 24px;
      font-size: 22rpx;
      color: #fff;

      &--disabled {
        background: #e6eaea;
        border-color: #e6eaea;
        color: #a8adad;
      }
    }
  }
}
</style>
