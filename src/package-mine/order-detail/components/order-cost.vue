<template>
  <view class="order-cost">
    <node-description title="费用总计" />
    <view class="cost-summary">
      <view class="title">合计费用</view>
      <view class="amount">¥{{ calculateFinalTotal(order_details) }}</view>
    </view>
    <view class="cost-summary">
      <view class="title">工价合计</view>
      <view class="amount">¥{{ order_details?.total_price }}</view>
    </view>
    <view class="cost-summary">
      <view class="title">平台服务费</view>
      <view class="amount-wrap">
        <view class="amount">¥{{ order_details?.total_service_fee || 0 }}</view>
        <view v-if="order_details?.total_service_fee_is_paid" class="pay-btn pay-btn--disabled">
          已支付
        </view>
        <view v-else class="pay-btn" @tap="handlePayServiceFee"> 支付 </view>
      </view>
    </view>
    <view class="cost-summary" v-if="order_details?.order_type === 'gangmaster'">
      <view class="title">工长费用 (上门{{ order_details?.visiting_service_num }}次)</view>
      <view class="amount-wrap">
        <view class="amount">¥{{ order_details?.gangmaster_cost || 0 }}</view>
        <view v-if="order_details?.gangmaster_cost_is_paid" class="pay-btn pay-btn--disabled">
          已支付
        </view>
        <view v-else class="pay-btn" @tap="handlePayGangmasterCost"> 支付 </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import nodeDescription from '@/components/node-description.vue'
import { calculateFinalTotal } from '../utils'
import { getPayParamsForOrderService } from '../service'

const props = defineProps<{
  order_details: any
}>()
const emit = defineEmits<{
  refresh: []
}>()

/** 支付平台服务费 */
const handlePayServiceFee = (): void => {
  const { id, total_service_fee, total_service_fee_is_paid } = props.order_details ?? {}
  if (total_service_fee_is_paid) return
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
        order_id: id,
        order_amount: Number(total_service_fee) || 0,
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

/** 支付工长费用 */
const handlePayGangmasterCost = (): void => {
  const { id, gangmaster_cost, gangmaster_cost_is_paid } = props.order_details ?? {}
  if (gangmaster_cost_is_paid) return
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
        order_id: id,
        order_amount: Number(gangmaster_cost) || 0,
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
