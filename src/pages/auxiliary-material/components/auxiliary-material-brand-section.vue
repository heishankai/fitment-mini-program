<template>
  <view class="brand-section">
    <view class="brand-heading">
      <view class="heading-bar" />
      <text class="heading-text">合作品牌</text>
    </view>
    <scroll-view class="brand-scroll" scroll-x :show-scrollbar="false">
      <view class="brand-list">
        <view
          v-for="brand in brands"
          :key="brand.id"
          class="brand-item"
        >
          <view class="brand-avatar">
            <image
              class="brand-img"
              :src="brand.logo"
              mode="aspectFill"
            />
          </view>
          <text class="brand-name">{{ brand.name }}</text>
        </view>
        <view class="brand-item brand-item-more">
          <view class="brand-avatar brand-avatar-more">
            <text class="more-text">更多</text>
          </view>
          <text class="brand-name brand-name-placeholder">.</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  brands: Array<{ id: number; name: string; logo: string }>
}>()
</script>

<style lang="scss" scoped>
.brand-section {
  padding: 0 48rpx 64rpx;
}

.brand-heading {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.heading-bar {
  width: 8rpx;
  height: 32rpx;
  background: #2d635e;
  border-radius: 8rpx;
}

.heading-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #222;
}

.brand-scroll {
  white-space: nowrap;
}

.brand-list {
  display: inline-flex;
  gap: 40rpx;
  padding-right: 48rpx;
  padding-bottom: 16rpx;
}

.brand-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  width: 128rpx;
}

.brand-avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: #f9fafb;
  border: 2rpx solid #f0f0f0;
  overflow: hidden;
}

.brand-img {
  width: 100%;
  height: 100%;
}

.brand-avatar-more {
  background: #fff;
  border: 2rpx dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-text {
  font-size: 20rpx;
  color: #ccc;
}

.brand-name {
  font-size: 22rpx;
  font-weight: 500;
  color: #555;
}

.brand-name-placeholder {
  color: transparent;
}
</style>
