<template>
  <view class="brand-card">
    <view class="brand-row">
      <view class="avatar-wrap">
        <text class="avatar-text">智</text>
      </view>
      <text class="brand-name">{{ userInfo?.nickname }}</text>
    </view>

    <view class="welcome-row">
      <text class="welcome-text">欢迎~ 智惠装新朋友</text>
    </view>

    <view class="points-row">
      <text class="points-num">{{ points }}</text>
      <view class="points-link" @tap="goToOrder">
        <text class="points-link-text">去下单</text>
        <uni-icons type="right" size="14" color="#A8ADAD" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const { points = 0 } = defineProps<{
  points?: number
  userInfo?: any
}>()

const goToOrder = (): void => {
  uni.switchTab({ url: '/pages/labour-cost/index' })
}
</script>

<style lang="scss" scoped>
.brand-card {
  background: $uni-bg-color;
  padding: 96rpx 40rpx 40rpx;

  .brand-row {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 48rpx;

    .avatar-wrap {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      background: $uni-color-primary;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-text {
        font-size: 32rpx;
        font-weight: 700;
        color: #fff;
      }
    }

    .brand-name {
      font-size: 32rpx;
      font-weight: 500;
      color: $uni-text-color;
      letter-spacing: 1rpx;
    }
  }

  .welcome-row {
    margin-bottom: 16rpx;

    .welcome-text {
      font-size: 28rpx;
      color: $uni-text-color;
      font-weight: 400;
    }
  }

  .points-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .points-num {
      font-size: 56rpx;
      font-weight: 600;
      color: $uni-text-color;
    }

    .points-link {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .points-link-text {
        font-size: 26rpx;
        color: $uni-text-color-placeholder;
      }
    }
  }
}
</style>
