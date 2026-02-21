<template>
  <view class="splash-page">
    <!-- Background -->
    <view class="bg-wrap">
      <image
        class="bg-image"
        src="https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771654019255_uagb3l_photo-1765371514288-56aea621fbb1.jpeg"
        mode="aspectFill"
      />
      <view class="bg-overlay" />
    </view>

    <!-- Content -->
    <view class="content">
      <view class="brand-block">
        <!-- Top decorative line -->
        <view class="deco-line-top" />

        <!-- Logo -->
        <view class="logo-wrap">
          <view class="logo-box">
            <image class="logo-img" src="/static/logo.png" mode="aspectFit" />
          </view>
        </view>

        <!-- Brand name -->
        <text class="brand-title">智惠装</text>

        <!-- Divider -->
        <view class="divider">
          <view class="divider-line" />
          <view class="divider-dot" />
          <view class="divider-line" />
        </view>

        <text class="brand-subtitle">装修直连工匠与工长</text>
        <text class="brand-en">ZHIHUIZHUANG</text>

        <!-- Bottom decorative line -->
        <view class="deco-line-bottom" />
      </view>
    </view>

    <!-- Skip button -->
    <view class="skip-btn" @tap="handleSkip">
      <text class="skip-text">跳过 {{ countdown > 0 ? countdown : '' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const countdown = ref(5)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      goToHome()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const goToHome = (): void => {
  uni.reLaunch({ url: '/pages/home/index' })
}

const handleSkip = (): void => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  goToHome()
}
</script>

<style lang="scss" scoped>
.splash-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.bg-wrap {
  position: absolute;
  inset: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 64rpx;
}

.brand-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.deco-line-top {
  width: 2rpx;
  height: 96rpx;
  background: linear-gradient(to bottom, transparent 0%, $uni-color-primary 100%);
  margin-bottom: 64rpx;
}

.logo-wrap {
  margin-bottom: 48rpx;
}

.logo-box {
  width: 120rpx;
  height: 120rpx;
  border-radius: 24rpx;
  background: #fff;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
}

.logo-img {
  width: 100%;
  height: 100%;
}

.brand-title {
  font-size: 88rpx;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.2em;
  margin-bottom: 32rpx;
}

.divider {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.divider-line {
  width: 96rpx;
  height: 2rpx;
  background: $uni-color-primary;
}

.divider-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $uni-color-primary;
}

.brand-subtitle {
  font-size: 36rpx;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.2em;
  margin-bottom: 12rpx;
}

.brand-en {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.15em;
}

.deco-line-bottom {
  width: 2rpx;
  height: 96rpx;
  background: linear-gradient(to bottom, $uni-color-primary 0%, transparent 100%);
  margin-top: 64rpx;
}

.skip-btn {
  position: absolute;
  z-index: 20;
  bottom: 80rpx;
  right: 64rpx;
  padding: 20rpx 48rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.skip-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.15em;
}
</style>
