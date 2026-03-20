<template>
  <uni-popup ref="popupRef" type="bottom" :mask-click="true" :safe-area="false">
    <view class="layout-picker">
      <view class="layout-picker__header">
        <text class="layout-picker__title">选择房屋结构</text>
        <view class="layout-picker__close" @tap="handleClose">
          <uni-icons type="down" size="16" color="#999" />
        </view>
      </view>
      <view class="layout-picker__body">
        <view v-for="key in layoutKeys" :key="key" class="layout-picker__group">
          <view class="layout-picker__group-title">
            <view class="layout-picker__bar" />
            <text>{{ key === 'room' ? '房' : '卫' }}</text>
          </view>
          <view class="layout-picker__options">
            <view v-for="n in 6" :key="n" class="layout-picker__option" :class="{ active: modelValue[key] === n }"
              @tap="handleSelect(key, n)">
              {{ n }}
            </view>
          </view>
        </view>
        <button class="layout-picker__confirm" @tap="handleClose">确定</button>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
const layoutKeys = ['room', 'bath'] as const

const props = defineProps<{
  modelValue: { room: number; bath: number }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { room: number; bath: number }]
}>()

const popupRef = ref<any>(null)

function handleSelect(key: 'room' | 'bath', value: number): void {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function handleClose(): void {
  popupRef.value?.close()
}

function open(): void {
  popupRef.value?.open('bottom')
}

function close(): void {
  popupRef.value?.close()
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
.layout-picker {
  background: #fff;
  border-radius: 48rpx 48rpx 0 0;
  overflow-y: auto;
  max-height: 80vh;
  padding-bottom: env(safe-area-inset-bottom);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx;
    border-bottom: 2rpx solid #F5F5F5;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 700;
    color: #111;
  }

  &__close {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__body {
    padding: 40rpx 40rpx 0;
  }

  &__group {
    margin-bottom: 64rpx;
  }

  &__group-title {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 32rpx;

    .layout-picker__bar {
      width: 8rpx;
      height: 32rpx;
      background: #2D635E;
      border-radius: 999rpx;
    }

    text {
      font-size: 28rpx;
      font-weight: 700;
      color: #333;
    }
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;
  }

  &__option {
    height: 112rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 700;
    background: #F9F9F9;
    color: #666;

    &.active {
      background: #2D635E;
      color: #fff;
      box-shadow: 0 16rpx 48rpx rgba(45, 99, 94, 0.3);
    }
  }

  &__confirm {
    width: 100%;
    height: 96rpx;
    margin-top: 32rpx;
    margin-bottom: 32rpx;
    background: #2D635E;
    color: #fff;
    border-radius: 96rpx;
    font-size: 32rpx;
    font-weight: 700;
    border: none;
    box-shadow: 0 16rpx 48rpx rgba(45, 99, 94, 0.2);

    &::after {
      border: none;
    }
  }
}
</style>
