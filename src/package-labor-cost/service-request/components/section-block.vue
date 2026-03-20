<template>
  <section class="section-block">
    <view v-if="$slots.right" class="section-block__title-row">
      <view class="section-block__title">
        <view class="section-block__bar" />
        <text class="section-block__text">{{ title }}</text>
      </view>
      <slot name="right" />
    </view>
    <view v-else class="section-block__title">
      <view class="section-block__bar" />
      <text class="section-block__text">{{ title }}</text>
    </view>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style lang="scss" scoped>
.section-block {
  margin-bottom: 40rpx;

  &__title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    padding-left: 8rpx;

    .section-block__title {
      margin-bottom: 0;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 24rpx;
    padding-left: 8rpx;
  }

  &__bar {
    width: 8rpx;
    height: 24rpx;
    background: #2D635E;
    border-radius: 999rpx;
  }

  &__text {
    font-size: 26rpx;
    font-weight: 500;
    color: #666;
  }
}
</style>
