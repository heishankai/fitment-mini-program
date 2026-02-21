<template>
  <view class="custom-navbar" :style="{ height: navHeight + 'px', background: navBgStyle }">
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-content" :style="{ height: navContentHeight + 'px' }">
      <!-- 左侧 -->
      <view class="nav-left">
        <slot name="left" />
      </view>

      <!-- 中间绝对居中 -->
      <view class="nav-center">
        <slot name="center" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  scrollTop?: number
}>()

const statusBarHeight = ref(0)
const navHeight = ref(44)
const navContentHeight = ref(44)

// ⭐ 直接同步计算（避免闪动）
const systemInfo = wx.getSystemInfoSync()
const menuButton = wx.getMenuButtonBoundingClientRect()

statusBarHeight.value = systemInfo.statusBarHeight

const gap = menuButton.top - systemInfo.statusBarHeight
navContentHeight.value = menuButton.height + gap * 2
navHeight.value = statusBarHeight.value + navContentHeight.value

const navBgStyle = computed(() => {
  const top = props.scrollTop ?? 999
  const opacity = Math.min(1, top / 120)
  return `rgba(255, 255, 255, ${opacity})`
})
</script>

<style scoped lang="scss">
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
}

.nav-content {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-left {
  padding-left: 32rpx;
  z-index: 2;
}

/* 真正几何居中 */
.nav-center {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  pointer-events: none;
}
</style>
