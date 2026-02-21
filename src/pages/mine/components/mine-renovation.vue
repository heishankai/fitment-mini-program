<template>
  <view class="section renovation-section">
    <view class="section-header">
      <uni-icons custom-prefix="iconfont" type="icon-hammer-outline" size="16" color="#1E2222" />
      <text class="section-title">装修中心</text>
      <view class="section-link" @tap="handleAllProjects">
        <text class="section-link-text">全部项目</text>
        <uni-icons type="right" size="14" color="#A8ADAD" />
      </view>
    </view>

    <text class="empty-tip">当前没有装修项目</text>

    <view class="feature-grid">
      <view class="grid-item" @tap="handleMySite">
        <view class="grid-icon-wrap">
          <uni-icons
            custom-prefix="iconfont"
            type="icon-hammer-outline"
            size="20"
            color="#6E7373"
          />
        </view>
        <text class="grid-label">我的工地</text>
      </view>

      <view class="grid-item" @tap="handleAfterSale">
        <view class="grid-icon-wrap">
          <uni-icons type="chat" size="20" color="#6E7373" />
        </view>
        <text class="grid-label">售后</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleAllProjects = (): void => {
  uni.showToast({ title: '敬请期待', icon: 'none' })
}

const handleMySite = (): void => {
  uni.showToast({ title: '敬请期待', icon: 'none' })
}

const handleAfterSale = (): void => {
  uni.navigateTo({ url: '/package-mine/after-sale/index' })
}
</script>

<style lang="scss" scoped>
.section {
  margin-top: 24rpx;
  background: $uni-bg-color;

  &.renovation-section {
    padding: 40rpx;

    .section-header {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 32rpx;

      .section-title {
        font-size: 30rpx;
        font-weight: 500;
        color: $uni-text-color;
      }

      .section-link {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 8rpx;

        .section-link-text {
          font-size: 24rpx;
          color: $uni-text-color-placeholder;
        }
      }
    }

    .empty-tip {
      font-size: 26rpx;
      color: $uni-text-color-placeholder;
    }

    .feature-grid {
      display: flex;
      flex-wrap: wrap;
      margin-top: 48rpx;
      padding-top: 40rpx;
      border-top: 2rpx solid #f0f0f0;

      .grid-item {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16rpx;
        margin-bottom: 32rpx;

        .grid-icon-wrap {
          width: 96rpx;
          height: 96rpx;
          border-radius: 24rpx;
          background: #f8f8f8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid-label {
          font-size: 22rpx;
          color: $uni-text-color-grey;
        }
      }
    }
  }
}
</style>
