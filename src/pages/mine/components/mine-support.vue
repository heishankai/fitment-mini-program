<template>
  <view class="section support-section">
    <view class="support-header">
      <text class="support-title">服务支持</text>
    </view>

    <view
      v-for="(item, index) in items"
      :key="item.type"
      class="list-item"
      :class="{ 'is-last': index === items.length - 1 }"
      @tap="handleTap(item)"
    >
      <view class="list-left">
        <uni-icons custom-prefix="iconfont" :type="item.icon" size="16" :color="iconColor" />
        <text class="list-text">{{ item.label }}</text>
      </view>

      <view v-if="item.extra" class="list-right">
        <text class="list-extra">{{ item.extra }}</text>
        <uni-icons type="right" size="14" :color="arrowColor" />
      </view>
      <uni-icons v-else type="right" size="14" :color="arrowColor" />
    </view>
  </view>
</template>

<script setup lang="ts">
const items = [
  {
    type: 'material',
    label: '材料透明说明',
    icon: 'icon-zanwushuju',
  },
  {
    type: 'schedule',
    label: '工期准时保障',
    icon: 'icon-a-ziyuan672',
  },
  {
    type: 'messageList',
    label: '消息列表',
    icon: 'icon-comments',
  },
  {
    type: 'service',
    label: '联系客服',
    icon: 'icon-dianhua',
    extra: '400-888-8888',
  },
]

const emit = defineEmits<{
  messageList: []
  materialTracking: []
  scheduleTracking: []
  callService: []
}>()

const handleTap = (item: { type: string }): void => {
  switch (item.type) {
    case 'messageList':
      emit('messageList')
      break
    case 'material':
      emit('materialTracking')
      break
    case 'schedule':
      emit('scheduleTracking')
      break
    case 'service':
      emit('callService')
      break
    default:
      uni.showToast({ title: '敬请期待', icon: 'none' })
  }
}

// 颜色常量化
const iconColor = '#A8ADAD'
const arrowColor = '#D0D5D5'
</script>

<style lang="scss" scoped>
.section {
  margin-top: 24rpx;
  background: $uni-bg-color;

  &.support-section {
    padding: 0;

    .support-header {
      padding: 24rpx 40rpx;
      border-bottom: 2rpx solid #f0f0f0;

      .support-title {
        font-size: 26rpx;
        font-weight: 500;
        color: $uni-text-color;
      }
    }

    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 40rpx;
      border-bottom: 2rpx solid #f0f0f0;

      &.is-last {
        border-bottom: none;
      }

      .list-left {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .list-text {
          font-size: 28rpx;
          color: $uni-text-color-grey; // 统一灰色文本
        }
      }

      .list-right {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .list-extra {
          font-size: 26rpx;
          font-weight: 500;
          color: $uni-text-color; // 客服电话用主色+加粗
        }
      }
    }
  }
}
</style>
