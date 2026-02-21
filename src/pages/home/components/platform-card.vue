<template>
  <view class="platform-card" @tap="handleDetail">
    <view class="card-inner">
      <!-- 顶部标题区 -->
      <view class="card-header">
        <view class="header-left">
          <view class="card-title">智惠装平台</view>
          <view class="card-subtitle">去中介化装修 · 让好工匠被看见</view>
        </view>
        <view class="header-right">
          <text class="detail-text">了解详情</text>
          <view class="icon-chevron" />
        </view>
      </view>

      <!-- 功能三列网格 -->
      <view class="grid-section">
        <view class="grid-row">
          <!-- 直连工匠 -->
          <view class="grid-item">
            <view class="icon-wrap icon-wrap-primary">
              <view class="icon-users" />
            </view>
            <view class="item-title">直连工匠</view>
            <view class="item-desc">无中间商</view>
          </view>

          <!-- 平台监管 -->
          <view class="grid-item">
            <view class="icon-wrap icon-wrap-success">
              <view class="icon-shield" />
            </view>
            <view class="item-title">平台监管</view>
            <view class="item-desc">质量保障</view>
          </view>

          <!-- 价格透明 -->
          <view class="grid-item">
            <view class="icon-wrap icon-wrap-warning">
              <view class="icon-dollar" />
            </view>
            <view class="item-title">价格透明</view>
            <view class="item-desc">明细可查</view>
          </view>
        </view>
      </view>

      <!-- 底部分隔线 -->
      <view class="card-divider" />

      <!-- 底部说明文字 -->
      <view class="card-footer">工匠直达 · 平台监管 · 价格透明</view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleDetail = (): void => {
  uni.navigateTo({ url: '/package-home/platform-intro/index' })
}
</script>

<style lang="scss" scoped>
.platform-card {
  margin: 0 24rpx 36rpx;
}

.card-inner {
  border-radius: 32rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4rpx 40rpx rgba(45, 99, 94, 0.06);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 40rpx 48rpx 36rpx;
  margin-bottom: 4rpx;
}

.header-left {
  flex: 1;
}

.card-title {
  font-size: 40rpx;
  font-weight: 600;
  color: $uni-text-color;
  letter-spacing: 1rpx;
  margin-bottom: 16rpx;
}

.card-subtitle {
  font-size: 26rpx;
  color: $uni-text-color-grey;
  letter-spacing: 0.6rpx;
  line-height: 1.6;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: 8rpx;
}

.detail-text {
  font-size: 22rpx;
  font-weight: 500;
  color: $uni-color-primary;
  letter-spacing: 0.4rpx;
}

.icon-chevron {
  width: 28rpx;
  height: 28rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

// 三列网格 - 间距布局
.grid-section {
  padding: 0 40rpx 36rpx;
}

.grid-row {
  display: flex;
}

.grid-item {
  flex: 1;
  text-align: center;
}

.grid-item + .grid-item {
  margin-left: 24rpx;
}

.icon-wrap {
  width: 112rpx;
  height: 112rpx;
  border-radius: 32rpx;
  margin: 0 auto 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrap-primary {
  background: linear-gradient(135deg, #2d635e 0%, #3d7a6e 100%);
  box-shadow: 0 8rpx 32rpx rgba(45, 99, 94, 0.2);
}

.icon-wrap-success {
  background: linear-gradient(135deg, #4f7a67 0%, #5f8a77 100%);
  box-shadow: 0 8rpx 32rpx rgba(79, 122, 103, 0.2);
}

.icon-wrap-warning {
  background: linear-gradient(135deg, #c89a57 0%, #d8aa67 100%);
  box-shadow: 0 8rpx 32rpx rgba(200, 154, 87, 0.2);
}

.icon-users {
  width: 48rpx;
  height: 48rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='9' cy='7' r='4'/%3E%3Cpath d='M23 21v-2a4 4 0 0 0-3-3.87'/%3E%3Cpath d='M16 3.13a4 4 0 0 1 0 7.75'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-shield {
  width: 48rpx;
  height: 48rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-dollar {
  width: 48rpx;
  height: 48rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z'/%3E%3Cline x1='7' y1='7' x2='7.01' y2='7'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin-bottom: 12rpx;
  letter-spacing: 0.4rpx;
}

.item-desc {
  font-size: 22rpx;
  color: $uni-text-color-placeholder;
  letter-spacing: 0.6rpx;
}

.card-divider {
  height: 2rpx;
  margin: 0 48rpx 32rpx;
  background: linear-gradient(to right, transparent 0%, #e6eaea 50%, transparent 100%);
}

.card-footer {
  padding: 0 48rpx 36rpx;
  font-size: 22rpx;
  color: $uni-text-color-grey;
  text-align: center;
  letter-spacing: 0.8rpx;
}
</style>
