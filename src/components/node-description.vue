<template>
  <view class="node-description">
    <view class="header">
      <view class="title-wrap">
        <slot name="title">{{ title }}</slot>
      </view>
      <view class="line"></view>
    </view>
    <view v-if="$slots.default" class="slot-content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
  }>(),
  { title: '' },
)
</script>

<style scoped lang="scss">
.node-description {
  padding: 24px 0;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title-wrap {
    color: #999;
    font-size: 13px;
    font-weight: 500;
    line-height: 19.5px;
    letter-spacing: 2.448px;
  }

  .line {
    margin-left: 16px;
    flex: 1;
    height: 0.997px;
    background: #e5e5e5;
  }

  .slot-content {
    margin-top: 16px;
  }
}
</style>
