<template>
  <web-view v-if="webViewUrl" :src="webViewUrl" updateTitle />
</template>

<script setup lang="ts">
import { WEBVIEWURL } from '@/utils/request'

const webViewUrl = ref<string>('')

onLoad(() => {
  const token = wx.getStorageSync('userInfo')?.token
  if (token) {
    webViewUrl.value = `${WEBVIEWURL}/chat/wechat?token=${token}`
  } else {
    wx.navigateTo({ url: '/pages/login/index' })
  }
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
  background: #f8f9fa;
}
</style>
