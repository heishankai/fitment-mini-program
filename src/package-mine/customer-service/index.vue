<template>
  <web-view v-if="webViewUrl" :src="webViewUrl" />
</template>

<script setup lang="ts">
import { WEBVIEWURL } from '@/utils/request'

const webViewUrl = ref<string>('')

onLoad(() => {
  const token = wx.getStorageSync('userInfo')?.token
  if (token) {
    webViewUrl.value = `${WEBVIEWURL}/admin-service/wechat-msg?token=${token}`
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
