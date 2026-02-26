<template>
  <view class="empty-state">
    <uni-icons  type="shop" size="60" color="#2D635E" />
    <text class="empty-text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '暂无数据',
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  gap: 24rpx;

  .empty-text {
    font-size: 28rpx;
    color: $uni-text-color-placeholder;
  }
}
</style>
