<template>
  <view>
    <transition name="fade-slide">
      <view v-if="visible" class="contact-service" @tap="handleContactService">
        <uni-icons custom-prefix="iconfont" type="icon-zaixiankefu" size="22" color="#2D635E" />
      </view>
    </transition>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  url?: string
  scrollTop?: number
}

const props = withDefaults(defineProps<Props>(), {
  url: '/package-mine/customer-service/index',
  scrollTop: 0,
})

const visible = ref(true)
const collapsed = ref(false)
let lastScrollTop = 0
let hideTimer: ReturnType<typeof setTimeout> | null = null

const handleContactService = (): void => {
  uni.navigateTo({ url: props.url })
}

watch(
  () => props.scrollTop,
  (scrollTop) => {
    const delta = scrollTop - lastScrollTop

    if (delta > 10) {
      collapsed.value = true
    } else if (delta < -10) {
      collapsed.value = false
    }

    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      collapsed.value = false
    }, 500)

    lastScrollTop = scrollTop
  },
)
</script>

<style scoped lang="scss">
.contact-service {
  width: 100rpx;
  height: 100rpx;
  position: fixed;
  right: 24rpx;
  bottom: calc(6vh + env(safe-area-inset-bottom));
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
  border: 2rpx solid #f0f0f0;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.03);
}
</style>
