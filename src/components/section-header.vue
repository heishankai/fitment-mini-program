<template>
  <view class="section-header">
    <view class="section-left">
      <view v-if="showBar" class="section-bar" :style="{ background: color }" />
      <text class="section-title" :style="{ color }">{{ title }}</text>
    </view>
    <view v-if="$slots.right" class="section-right">
      <slot name="right" />
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    color?: string
    showBar?: boolean
  }>(),
  {
    color: '#2D635E',
    showBar: true,
  },
)
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;

  .section-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .section-bar {
    width: 8rpx;
    height: 40rpx;
    border-radius: 4rpx;
    margin-right: 24rpx;
    flex-shrink: 0;
  }

  .section-title {
    font-size: 36rpx;
    font-weight: 600;
    color: $uni-text-color;
  }

  .section-right {
    flex-shrink: 0;
    margin-left: 32rpx;
  }
}
</style>
