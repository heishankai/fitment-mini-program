<template>
  <view class="timeline-item" :class="{ 'is-last': isLast }">
    <!-- 左侧轨道 -->
    <view class="track">
      <view class="dot" :class="{ completed }"></view>
      <!-- 线条容器：占据圆点下方的所有剩余空间 -->
      <view v-if="!isLast" class="line-wrapper">
        <view class="line"></view>
      </view>
    </view>

    <!-- 右侧内容 -->
    <view class="content">
      <view class="header">
        {{ title }}
        <!-- <slot name="title" /> -->
      </view>
      <view v-if="$slots.default" class="body">
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    completed?: boolean
    isLast?: boolean
    title?: string
  }>(),
  {
    completed: false,
    isLast: false,
  },
)
</script>

<style lang="scss" scoped>
/* --- 变量配置 --- */
$dot-size: 20rpx;
$line-width: 2rpx;
$item-gap: 30rpx; // 节点间距
$horizontal-gap: 24rpx; // 左右间距

$color-primary: $uni-color-primary;
$color-line: #e5e5e5;
$color-dot-wait: #d1d5db;

.node-title {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 48rpx;
  letter-spacing: -1.424rpx;
}

.timeline-item {
  display: flex;
  /* stretch：左侧轨道与右侧内容等高，竖线才有可分配的剩余高度 */
  align-items: stretch;
  gap: $horizontal-gap;
  margin-bottom: $item-gap;

  &.is-last {
    margin-bottom: 0;
  }

  .track {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 32rpx;
    flex-shrink: 0;
    padding-top: 8rpx;
  }

  /* 圆点 */
  .dot {
    width: $dot-size;
    height: $dot-size;
    border-radius: 50%;
    background: $color-primary;
    flex-shrink: 0;
    z-index: 2;

    &:not(.completed) {
      background: $color-dot-wait;
    }
  }

  .line-wrapper {
    flex: 1;
    position: relative;
    width: 100%;
    min-height: 48rpx;
    margin-top: 12rpx;
    margin-bottom: 12rpx;
  }

  /* 小程序嵌套 flex:1 常算不出高度，绝对定位铺满 line-wrapper */
  .line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: $line-width;
    margin-left: -1rpx;
    background: $color-line;
  }

  /* --- 右侧内容 --- */
  .content {
    flex: 1;
    min-width: 0;
    /* 防止长文本撑破布局 */

    .header {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
    }

    .body {
      margin-top: 12rpx;
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>