<template>
  <view class="tab-bar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-bar-item"
      @click="switchTab(item)"
    >
      <image
        class="tab-icon"
        :src="selected === item.selected ? item.selectedIconPath : item.iconPath"
      />
      <text class="tab-text" :class="{ active: selected === item.selected }">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps({
  selected: {
    type: String,
    default: '0',
  },
})

const tabList = [
  {
    selected: '0',
    pagePath: '/pages/home/index',
    iconPath: '/static/tabbar/home.png',
    selectedIconPath: '/static/tabbar/home-active.png',
    text: '首页',
  },
  {
    selected: '1',
    pagePath: '/pages/labour-cost/index',
    iconPath: '/static/tabbar/labour-cost.png',
    selectedIconPath: '/static/tabbar/labour-cost-active.png',
    text: '工价',
  },
  {
    selected: '2',
    pagePath: '/pages/auxiliary-material/index',
    iconPath: '/static/tabbar/auxiliary-material.png',
    selectedIconPath: '/static/tabbar/auxiliary-material-active.png',
    text: '辅材',
  },
  {
    selected: '3',
    pagePath: '/pages/mine/index',
    iconPath: '/static/tabbar/mine.png',
    selectedIconPath: '/static/tabbar/mine-active.png',
    text: '个人中心',
  },
]

const switchTab = (item): void => {
  uni.vibrateShort({ type: 'light' })
  uni.switchTab({ url: item.pagePath })
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: 32rpx;

  display: flex;
  align-items: center;
  justify-content: space-around;

  background: $uni-bg-color;
  backdrop-filter: blur(12px);
  border-radius: 60rpx;

  padding: 24rpx 0;

  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
}

.tab-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  width: 44rpx;
  height: 44rpx;
  transition: all 0.15s ease;
}

.tab-text {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #8c9393;
  transition: color 0.15s ease;
}

.tab-text.active {
  color: $uni-color-primary;
}

.tab-bar-item:active {
  transform: scale(0.96);
  transition: transform 0.1s ease;
}
</style>
