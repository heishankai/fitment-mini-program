<template>
  <view class="scroll-prompt">
    <view class="prompt-content">
      <text class="prompt-text bounce">上滑探索更多精彩</text>
      <uni-icons class="bounce" type="up" size="14" color="#999" />
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.scroll-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rpx 0rpx 36rpx 0;
}

.prompt-content {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.prompt-text {
  font-size: 24rpx;
  color: #b8bdbd;
  letter-spacing: 0.5rpx;
}

.bounce {
  animation: bounce-up-down 1.5s ease-in-out infinite;
}

@keyframes bounce-up-down {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8rpx);
  }
}
</style>
