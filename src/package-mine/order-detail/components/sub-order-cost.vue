<template>
  <view class="order-cost">
    <node-description title="增加节点费用总计" />
    <view class="cost-summary">
      <view class="title">平台服务费</view>
      <view class="amount-wrap">
        <view class="amount">¥{{ subPlatformServiceFeeDisplay }}</view>
        <view v-if="subServiceFeesAllPaid" class="pay-btn pay-btn--disabled">已支付</view>
        <view v-else class="pay-btn" @tap="handlePaySubServiceFee">支付</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import nodeDescription from '@/components/node-description.vue'
import { getPayParamsForWorkPriceService } from '../service'
import {
  areAllSubWorkLineServiceFeesPaid,
  buildSubWorkSubServiceFeeBatchPayParams,
  sumSubWorkPriceGroupsLineServiceFee,
} from '../utils'

const props = defineProps<{
  sub_work_groups?: any[] | null
}>()

const emit = defineEmits<{
  refresh: []
}>()

const groups = computed(() => (Array.isArray(props?.sub_work_groups) ? props.sub_work_groups : []))

const subPlatformServiceFeeDisplay = computed(() =>
  sumSubWorkPriceGroupsLineServiceFee(groups.value),
)

const subServiceFeesAllPaid = computed(() => areAllSubWorkLineServiceFeesPaid(groups.value))

const normalizePayRes = (res: any): { ok: boolean; data: any } => {
  const ok = res?.success === true || res?.code === 200 || res?.code === '0'
  const data = res?.data ?? res
  return { ok: !!ok, data }
}

const handlePaySubServiceFee = (): void => {
  if (subServiceFeesAllPaid.value) return
  const { workPriceItemIds, order_amount } = buildSubWorkSubServiceFeeBatchPayParams(groups.value)
  if (!workPriceItemIds.length || !order_amount) {
    uni.showToast({ title: '暂无待支付服务费', icon: 'none' })
    return
  }
  uni?.vibrateShort()
  wx.showModal({
    title: '确认支付',
    content: '确定要支付子工价平台服务费吗？',
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#2d635e',
    success: async (modalRes) => {
      if (!modalRes.confirm) return
      uni.showLoading({ title: '获取支付参数...', mask: true })
      const raw = await getPayParamsForWorkPriceService({
        pay_type: 'work_price_sub_service_fee_batch',
        workPriceItemIds,
        order_amount,
      })
      uni.hideLoading()
      const { ok, data } = normalizePayRes(raw)
      if (!ok) {
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
