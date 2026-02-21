<template>
  <view class="header" :style="{ paddingTop: statusBarHeight + 'rpx' }">
    <view class="header-inner" :style="{ paddingRight: capsuleRight + 'rpx' }">
      <!-- 主标题 -->
      <view class="header-title">辅材标准库</view>
    </view>
    <!-- 副标题 与 机制说明 同行 -->
    <view class="subtitle-row">
      <view class="header-subtitle">透明 · 严选 · 标准</view>
      <view class="mechanism-link" @tap="goMechanism">
        <uni-icons custom-prefix="iconfont" type="icon-anquanbaozhang" size="14" color="#2D635E" />
        <text class="mechanism-text">机制说明</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar" @tap="goSearch">
      <uni-icons type="search" size="18" color="#999" />
      <text class="search-placeholder">搜索材料名称、品牌、型号...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(0)
const capsuleRight = ref(0)

const goMechanism = (): void => {
  uni.navigateTo({ url: '/package-home/material-transparency/index' })
}

const goSearch = (): void => {
  uni.navigateTo({ url: '/package-auxiliary-material/material-search/index' })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight ?? 0

  const menuButton = (wx as any)?.getMenuButtonBoundingClientRect?.()
  capsuleRight.value = systemInfo.windowWidth - menuButton.left
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;

  .subtitle-row {
    padding: 0rpx 48rpx 32rpx 48rpx;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-subtitle {
      font-size: 24rpx;
      color: #888;
      letter-spacing: 1rpx;
    }

    .mechanism-link {
      display: flex;
      align-items: center;
      gap: 12rpx;
      flex-shrink: 0;
      padding: 12rpx 24rpx;
      background: #f5f7f6;
      border-radius: 999rpx;

      .mechanism-text {
        font-size: 22rpx;
        color: #555;
        font-weight: 500;
      }
    }
  }

  .search-bar {
    padding: 0rpx 48rpx 0rpx 48rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid #f0f0f0;

    .search-placeholder {
      font-size: 28rpx;
      color: #999;
      font-weight: 300;
    }
  }

  .header-inner {
    padding: 40rpx 0rpx 0rpx 48rpx;

    .header-title {
      font-size: 56rpx;
      font-weight: 700;
      color: #1e2222;
      letter-spacing: 1rpx;
      margin-bottom: 24rpx;
    }
  }
}
</style>