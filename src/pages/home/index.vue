<template>
  <view class="container">
    <scroll-view :show-scrollbar="false" :enhanced="true" class="scroll-view" scroll-y @scroll="onScroll">
      <Header :scroll-top="scrollTop" />
      <platform-card />
      <scroll-prompt />
      <guarantee-card />
      <material-transparency-card />
      <schedule-tracking-card />
      <view style="height: 200rpx"></view>
    </scroll-view>
    <custom-tab-bar selected="0" />
  </view>
</template>

<script setup lang="ts">
import CustomTabBar from '@/components/custom-tab-bar.vue'
import Header from './components/header.vue'
import PlatformCard from './components/platform-card.vue'
import MaterialTransparencyCard from './components/material-transparency-card.vue'
import ScheduleTrackingCard from './components/schedule-tracking-card.vue'
import GuaranteeCard from './components/guarantee-card.vue'
import ScrollPrompt from './components/scroll-prompt.vue'

const scrollTop = ref<number>(0)

// 处理滚动事件
const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}
</script>

<style lang="scss" scoped>
page {
  height: 100vh;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
