<template>
  <view class="custom-card" :class="{ 'has-bottom-margin': showBottomMargin }">
    <slot />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showBottomMargin?: boolean
  }>(),
  {
    showBottomMargin: false,
  },
)
</script>

<style lang="scss" scoped>
.custom-card {
  width: 100%;
  box-sizing: border-box;
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  &.has-bottom-margin {
    margin-bottom: 24rpx;
  }
}
</style>
