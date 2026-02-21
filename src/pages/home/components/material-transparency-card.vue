<template>
  <view class="material-card" @tap="handleDetail">
    <view class="card-inner">
      <view class="card-body">
        <!-- Left Text -->
        <view class="text-section">
          <view class="card-title">材料透明</view>
          <view class="card-subtitle">辅材明细公开可查</view>
          <view class="card-desc">
            材料清单可在小程序【辅材】模块查看，生成工地订单后可查看对应项目材料明细。
          </view>
        </view>

        <!-- Right Phone Model -->
        <view class="phone-wrap">
          <view class="phone-frame">
            <view class="phone-topbar">
              <text class="topbar-time">9:41</text>
              <view class="topbar-dots">
                <view class="dot" />
                <view class="dot" />
              </view>
            </view>

            <view class="phone-content">
              <view class="list-header">
                <text class="list-title">材料清单</text>
                <text class="list-more">全部 &gt;</text>
              </view>

              <view class="list-items">
                <view class="list-item">
                  <view class="item-row">
                    <text class="item-name">伟星PPR管</text>
                    <text class="item-qty">45米</text>
                  </view>
                  <view class="item-tags">
                    <text class="tag">伟星</text>
                    <text class="tag">20mm</text>
                  </view>
                </view>
                <view class="list-item">
                  <view class="item-row">
                    <text class="item-name">熊猫电线</text>
                    <text class="item-qty">5卷</text>
                  </view>
                  <view class="item-tags">
                    <text class="tag">熊猫</text>
                    <text class="tag">2.5m²</text>
                  </view>
                </view>
                <view class="list-item">
                  <view class="item-row">
                    <text class="item-name">雨虹防水</text>
                    <text class="item-qty">3桶</text>
                  </view>
                  <view class="item-tags">
                    <text class="tag">雨虹</text>
                    <text class="tag">18kg</text>
                  </view>
                </view>
                <view class="list-item list-item-faded">
                  <view class="item-row">
                    <text class="item-name">立邦漆</text>
                    <text class="item-qty">2桶</text>
                  </view>
                  <view class="item-tags">
                    <text class="tag">立邦</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="phone-bottombar">
              <view class="home-indicator" />
            </view>
          </view>
          <view class="phone-shadow" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleDetail = (): void => {
  uni.navigateTo({ url: '/package-home/material-transparency/index' })
}
</script>

<style lang="scss" scoped>
.material-card {
  margin: 0 24rpx 36rpx;
}

.card-inner {
  border-radius: 24rpx;
  overflow: hidden;
  background: #fff;
  border: 2rpx solid #f0f0f0;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.03);
}

.card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
}

.text-section {
  flex: 1;
  padding-right: 24rpx;
}

.card-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1e2222;
  margin-bottom: 8rpx;
}

.card-subtitle {
  font-size: 26rpx;
  color: #2d635e;
  font-weight: 500;
  margin-bottom: 24rpx;
}

.card-desc {
  font-size: 22rpx;
  color: #8a8f8f;
  line-height: 1.625;
  letter-spacing: 0.5rpx;
}

.phone-wrap {
  width: 200rpx;
  flex-shrink: 0;
  position: relative;
}

.phone-frame {
  background: #fff;
  border: 6rpx solid #f2f4f4;
  border-radius: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 356rpx;
  aspect-ratio: 9 / 16;
  transform: rotate(-3deg);
}

.phone-topbar {
  height: 24rpx;
  background: #f9fafb;
  border-bottom: 2rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8rpx;
}

.topbar-time {
  font-size: 16rpx;
  color: #999;
}

.topbar-dots {
  display: flex;
  gap: 4rpx;
}

.dot {
  width: 8rpx;
  height: 8rpx;
  background: #ccc;
  border-radius: 50%;
}

.phone-content {
  padding: 12rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  padding: 0 4rpx;
}

.list-title {
  font-size: 20rpx;
  font-weight: 700;
  color: #333;
}

.list-more {
  font-size: 16rpx;
  color: #2d635e;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.list-item {
  background: #f9fafb;
  border-radius: 8rpx;
  padding: 8rpx;
  border: 2rpx solid #f5f7f6;

  &.list-item-faded {
    opacity: 0.6;
  }
}

.item-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4rpx;
}

.item-name {
  font-size: 20rpx;
  font-weight: 500;
  color: #222;
}

.item-qty {
  font-size: 20rpx;
  color: #2d635e;
  font-family: monospace;
}

.item-tags {
  display: flex;
  gap: 8rpx;
}

.tag {
  font-size: 16rpx;
  color: #999;
  background: #fff;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  border: 2rpx solid #ebebeb;
}

.phone-bottombar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rpx;
  background: #fff;
  border-top: 2rpx solid #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-indicator {
  width: 80rpx;
  height: 4rpx;
  background: #e0e0e0;
  border-radius: 8rpx;
}

.phone-shadow {
  position: absolute;
  bottom: -16rpx;
  right: -16rpx;
  width: 128rpx;
  height: 128rpx;
  background: rgba(45, 99, 94, 0.05);
  border-radius: 50%;
  filter: blur(40rpx);
  z-index: -1;
}
</style>
