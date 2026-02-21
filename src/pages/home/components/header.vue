<template>
  <view class="hero-section">
    <!-- 背景 -->
    <view class="hero-bg">
      <view class="hero-bg-image" />
      <view class="hero-bg-overlay" />
    </view>

    <!-- 顶部导航栏 -->
    <navbar class="hero-navbar" :scroll-top="scrollTop">
      <template #left>
        <view class="nav-location" @tap="handleStores">
          <view class="icon-map-pin" />
          <text class="city-text">{{ city }}</text>
        </view>
      </template>
    </navbar>

    <!-- 品牌标识区 - 居中 -->
    <view class="hero-content">
      <!-- 装饰线 -->
      <view class="brand-deco">
        <view class="deco-line" />
        <text class="deco-text">{{ brandSubtitle.toUpperCase() }}</text>
        <view class="deco-line" />
      </view>

      <!-- 品牌名 -->
      <text class="brand-title">{{ brandTitle }}</text>

      <!-- 英文副标题 -->
      <text class="brand-en">ZHIHUI ZHUANG</text>
    </view>

    <!-- 选择卡片 -->
    <view class="segment-card">
      <view class="segment-item" @tap="handleQuote">
        <view class="segment-en">QUOTE</view>
        <view class="segment-title">装修报价</view>
        <view class="segment-desc">马上获取报价</view>
      </view>

      <view class="divider" />

      <view class="segment-item" @tap="handleFind">
        <view class="segment-en">FIND</view>
        <view class="segment-title">寻找工匠</view>
        <view class="segment-desc">查看工种工价</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import navbar from './navbar.vue'

// 品牌信息
const city = '嘉兴'
const brandSubtitle = '空间美学 · 品质装修'
const brandTitle = '智惠装'

defineProps<{
  scrollTop?: number
}>()

// 事件处理
const handleStores = (): void => {
  uni.navigateTo({ url: '/package-home/stores/index' })
}

const handleQuote = (): void => {
  uni.showToast({ title: '装修报价', icon: 'none' })
}

const handleFind = (): void => {
  wx.switchTab({ url: '/pages/labour-cost/index' })
}
</script>

<style lang="scss" scoped>
// ====== 尺寸常量（一屏展示装修报价+寻找工匠）======
$hero-height: 50vh;
$segment-card-offset: -36rpx;
$segment-card-margin: 24rpx;
$segment-card-padding: 32rpx 48rpx;
$segment-card-radius: 32rpx;

// ====== 主容器 ======
.hero-section {
  position: relative;
  width: 100%;
  height: $hero-height;
}

// ====== 背景 ======
.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653886371_kgjvgd_photo-1600585154340-be6161a56a0c.jpeg');
  background-size: cover;
  background-position: center;
  filter: grayscale(100%) brightness(1.1);
  -webkit-filter: grayscale(100%) brightness(1.1);
  opacity: 0.18;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
      rgba(248, 248, 248, 0.5) 0%,
      rgba(248, 248, 248, 0.8) 60%,
      #f8f8f8 100%);
}

// ====== 导航栏 ======
.hero-navbar {
  position: relative;
  z-index: 10;
}

.nav-location {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.icon-map-pin {
  width: 32rpx;
  height: 32rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.city-text {
  font-size: 30rpx;
  font-weight: 500;
  color: $uni-text-color;
}

// ====== 品牌内容区 ======
.hero-content {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 120rpx;
}

.brand-deco {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.deco-line {
  width: 32rpx;
  height: 2rpx;
  background: $uni-color-primary;
  opacity: 0.4;
}

.deco-text {
  font-size: 22rpx;
  color: $uni-text-color-grey;
  letter-spacing: 0.25em;
}

.brand-title {
  font-size: 72rpx;
  font-weight: 300;
  color: $uni-text-color;
  letter-spacing: 0.15em;
  margin-bottom: 12rpx;
}

.brand-en {
  font-size: 22rpx;
  color: $uni-text-color-placeholder;
  letter-spacing: 0.3em;
}

// ====== 选择卡片 ======
.segment-card {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY($segment-card-offset);
  margin: 0 $segment-card-margin;
  padding: $segment-card-padding;
  background: rgba(255, 255, 255, 0.92);
  border-radius: $segment-card-radius;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}

.segment-item {
  flex: 1;
  text-align: center;
}

.segment-en {
  font-size: 22rpx;
  letter-spacing: 2rpx;
  color: $uni-text-color-placeholder;
  text-transform: uppercase;
}

.segment-title {
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.segment-desc {
  margin-top: 8rpx;
  font-size: 20rpx;
  color: $uni-text-color-grey;
}

.divider {
  width: 2rpx;
  height: 72rpx;
  background: $uni-border-color;
}
</style>
