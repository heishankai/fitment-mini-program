<template>
  <view class="project-overview">
    <view class="title">项目概览</view>
    <view class="type">{{ `${order_details?.housing_name || ''} ${order_details?.area}m²` }}</view>

    <view class="address">
      <uni-icons custom-prefix="iconfont" type="icon-map" size="14" color="#999" />
      <text class="address-text">{{ order_details?.location }}</text>
    </view>

    <view class="start-time">
      <uni-icons custom-prefix="iconfont" type="icon-a-ziyuan672" size="14" color="#999" />
      <text class="start-time-text"
        >{{ dayjs(order_details?.serviceTime || order_details?.createdAt).format('YYYY-MM-DD') }}
      </text>
    </view>

    <view
      v-if="order_details?.craftsman_user"
      class="craftsman-info"
      @click="handleGoCraftsmanProfile"
    >
      <view class="craftsman-info-left">
        <image :src="order_details?.craftsman_user?.avatar" mode="aspectFill" />
        <view class="info-wrap">
          <view class="nickname">{{ order_details?.craftsman_user?.nickname }}</view>
          <view class="work_kind_name">{{ order_details?.work_kind_name }}</view>
        </view>
      </view>
      <uni-icons type="forward" size="16" color="#CCCCCC" />
    </view>

    <button
      class="cancel-order"
      v-if="order_details?.order_status === 1"
      @click="handleCancelOrder"
    >
      取消订单
    </button>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { showModal } from '@/utils'
import { cancelOrderService } from '../service'

const props = defineProps<{
  order_details: any
}>()

const handleCancelOrder = async (): Promise<void> => {
  uni?.vibrateShort()

  const { confirm } = await showModal({
    title: '确认取消',
    content: '确定要取消此订单吗？',
  })
  if (!confirm) return

  const { success } = await cancelOrderService({
    orderId: props?.order_details?.id,
  })
  if (success) {
    uni.showToast({ title: '订单已取消', icon: 'none' })
    uni.navigateBack()
  }
}

const handleGoCraftsmanProfile = (): void => {
  const { id } = props?.order_details?.craftsman_user ?? {}
  uni.navigateTo({ url: `/package-mine/craftsman-profile/index?id=${id}` })
}
</script>

<style lang="scss" scoped>
.project-overview {
}

.title {
  color: #2d635e;
  font-size: 11px;
  font-weight: 500;
  line-height: 16.5px;
  letter-spacing: 2.588px;
}

.type {
  max-width: 100%;
  margin-top: 12px;
  color: #222;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -1.194px;
  white-space: normal;
  word-break: break-all;
  overflow-wrap: break-word;
}

.address,
.start-time {
  margin-top: 12px;
  display: flex;
  align-items: flex-start;

  .address-text,
  .start-time-text {
    margin-left: 12px;
    flex: 1;
    min-width: 0;

    color: #666;
    font-size: 14px;
    font-weight: 300;
    line-height: 21px;
    letter-spacing: 0.2px;
    white-space: normal;
    word-break: break-all;
    overflow-wrap: break-word;
  }
}

.cancel-order {
  display: flex;
  margin-top: 24px;
  padding: 16px 0 16px 0;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 24px;
  border: 0.701px solid #e6eaea;
  background: #fff;

  color: #6e7373;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: -0.15px;

  &::after {
    border: none;
  }
}

.craftsman-info {
  margin-top: 24px;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  border: 0.701px solid #e5e5e5;
  background: #fff;

  .craftsman-info-left {
    display: flex;
    align-items: center;

    image {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
      background: #f0f0f0;
    }

    .info-wrap {
      margin-left: 16px;

      .nickname {
        color: #222;
        font-size: 15px;
        font-weight: 500;
        line-height: 15px;
        letter-spacing: -0.234px;
      }

      .work_kind_name {
        margin-top: 10px;
        color: #999;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
      }
    }
  }
}
</style>
