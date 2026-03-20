<template>
  <view class="trust-item">
    <uni-icons custom-prefix="iconfont" :type="icon" size="12" color="#2D635E" />
    <text class="trust-text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  text: string
}>()
</script>

<style lang="scss" scoped>
.trust-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  opacity: 0.6;
}

.trust-text {
  font-size: 20rpx;
  color: #666;
}
</style>
