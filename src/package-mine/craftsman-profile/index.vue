<template>
  <view class="container">
    <view class="placeholder">
      <text class="placeholder-text">工匠主页</text>
      <text class="placeholder-hint">id: {{ craftsmanId }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

const craftsmanId = ref<string>('')

onLoad((options) => {
  craftsmanId.value = options?.id ?? ''
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  padding: 40rpx;
  box-sizing: border-box;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  color: $uni-text-color-grey;

  .placeholder-text {
    font-size: 32rpx;
    margin-bottom: 16rpx;
  }

  .placeholder-hint {
    font-size: 26rpx;
  }
}
</style>
