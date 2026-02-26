<template>
  <view class="container">
    <scroll-view
      class="scroll-view"
      scroll-y
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @scroll="onScroll"
      @refresherrefresh="onRefresherrefresh"
    >
      <view class="scroll-content">
        <order-card
          v-if="orderDetail?.craftsman_user"
          :craftsman="orderDetail.craftsman_user"
          :order-id="orderId"
          :order-no="orderDetail?.order_no"
        />

        <order-cost-card
          v-if="orderDetail?.parent_work_price_groups?.length"
          :order-detail="orderDetail"
          @refresh="() => orderId && loadOrderDetail(orderId)"
        />

        <sub-work-price-list
          v-if="subWorkPricesList?.length"
          :sub-work-prices="subWorkPricesList"
          :order-detail="orderDetail"
          @refresh="() => orderId && loadOrderDetail(orderId)"
        />
      </view>
    </scroll-view>

    <view class="footer">
      <template v-if="orderDetail?.order_status === 1">
        <button class="cancel-btn" @click="handleCancelOrder">
          <uni-icons type="close" size="20" color="#ff6b6b" />取消订单
        </button>
        <button class="consult-btn" @click="handleConsult">
          <uni-icons type="chat" size="20" color="#fff" />联系工匠
        </button>
      </template>
      <button v-else class="consult-btn" @click="handleConsult">
        <uni-icons type="chat" size="20" color="#fff" />联系工匠
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import OrderCard from './components/order-card.vue'
import OrderCostCard from './components/order-cost-card.vue'
import SubWorkPriceList from './components/sub-work-price-list.vue'
import {
  getOrderDetailService,
  cancelOrderService,
  getSubWorkPricesByOrderId,
} from './service'
import { handleContactUser } from './utils'

const orderDetail = ref<any>({})
const subWorkPricesList = ref<any[]>([])
const scrollTop = ref<number>(0)
const isTriggered = ref(false)
const orderId = ref<number | string>('')

const loadOrderDetail = async (id: number | string): Promise<void> => {
  const { success, data } = await getOrderDetailService(id)
  if (!success) return
  orderDetail.value = data ?? {}

  const { success: subWorkPricesSuccess, data: subWorkPricesData } =
    await getSubWorkPricesByOrderId(id)
  if (subWorkPricesSuccess) {
    subWorkPricesList.value = subWorkPricesData || []
  }
}

const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}

const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  if (orderId.value) await loadOrderDetail(orderId.value)
  isTriggered.value = false
}

const handleConsult = (): void => {
  uni?.vibrateShort()
  handleContactUser(orderDetail.value?.craftsman_user)
}

const handleCancelOrder = async (): Promise<void> => {
  uni?.vibrateShort()

  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此订单吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#2d635e',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  uni.showLoading({ title: '取消中...', mask: true })

  try {
    const { success, message } = await cancelOrderService({
      orderId: Number(orderId.value),
    })

    uni.hideLoading()

    if (!success) {
      uni.showToast({
        title: message || '取消失败，请重试',
        icon: 'none',
      })
      return
    }

    uni.showToast({ title: '订单已取消', icon: 'success' })

    if (orderId.value) await loadOrderDetail(orderId.value)

    setTimeout(() => uni.navigateBack(), 1500)
  } catch (error: any) {
    console.error('取消订单失败:', error)
    uni.hideLoading()
  }
}

onLoad((options) => {
  const { id } = options ?? {}
  orderId.value = id
  loadOrderDetail(id)
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

.scroll-content {
  padding: 20rpx;
  box-sizing: border-box;
}

.footer {
  padding: 16px 20px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  background: $uni-bg-color;
  border-top: 1px solid $uni-border-color;
  flex-shrink: 0;
  display: flex;
  gap: 12px;

  .cancel-btn {
    flex: 1;
    height: 48px;
    background: $uni-bg-color;
    color: $uni-color-error;
    border: 1px solid $uni-color-error;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.8;
      background: rgba($uni-color-error, 0.05);
    }
  }

  .consult-btn {
    flex: 1;
    height: 48px;
    background: $uni-color-primary;
    color: $uni-text-color-inverse;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.8;
    }
  }

  button:only-child {
    flex: 1;
    width: 100%;
  }
}
</style>
