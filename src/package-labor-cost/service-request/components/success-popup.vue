<template>
  <uni-popup ref="popupRef" type="center" :mask-click="false">
    <view class="success-popup">
      <view class="success-popup__icon-wrap">
        <uni-icons custom-prefix="iconfont" type="icon-yiqueren" size="48" color="#fff" />
      </view>
      <text class="success-popup__title">预约提交成功</text>
      <text class="success-popup__desc">系统正在为您匹配附近的师傅\n请保持电话畅通</text>
      <button class="success-popup__btn" @tap="handleClose">返回首页</button>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()

const popupRef = ref<any>(null)

function handleClose(): void {
  popupRef.value?.close()
  emit('close')
}

function open(): void {
  popupRef.value?.open('center')
}

function close(): void {
  popupRef.value?.close()
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
.success-popup {
  width: 560rpx;
  padding: 48rpx;
  background: #fff;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.15);

  &__icon-wrap {
    width: 112rpx;
    height: 112rpx;
    margin-bottom: 32rpx;
    background: #2D635E;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 16rpx 48rpx rgba(45, 99, 94, 0.3);
  }

  &__title {
    font-size: 36rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 16rpx;
  }

  &__desc {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    white-space: pre-line;
    margin-bottom: 48rpx;
  }

  &__btn {
    width: 100%;
    height: 88rpx;
    background: #F5F5F5;
    color: #333;
    border-radius: 88rpx;
    font-size: 28rpx;
    font-weight: 700;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      border: none;
    }
  }
}
</style>
