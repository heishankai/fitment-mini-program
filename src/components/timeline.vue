<template>
  <view class="timeline-item" :class="{ 'last-item': isLast }">
    <view class="progress-timeline">
      <view class="timeline-dot" :class="{ completed }" />
      <view v-if="!isLast" class="timeline-line" />
    </view>

    <view class="timeline-content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  completed?: boolean
  isLast?: boolean
}

withDefaults(defineProps<Props>(), {
  completed: false,
  isLast: false,
})
</script>

<style lang="scss" scoped>
.timeline-item {
  display: flex;
  gap: 32rpx;
  padding-bottom: 40rpx;

  &.last-item {
    padding-bottom: 0;
  }
}

.progress-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;

  .timeline-dot {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background: $uni-color-primary;
    border: 4rpx solid #fff;
    box-shadow: 0 0 0 4rpx rgba($uni-color-primary, 0.2);

    &:not(.completed) {
      background: #d1d5db;
      box-shadow: 0 0 0 4rpx rgba(209, 213, 219, 0.2);
    }
  }

  .timeline-line {
    width: 4rpx;
    flex: 1;
    background: linear-gradient(180deg, $uni-color-primary, #e9ecef);
    margin-top: 8rpx;
    min-height: 80rpx;
  }
}

.timeline-content {
  flex: 1;
  min-width: 0;
}
</style>
