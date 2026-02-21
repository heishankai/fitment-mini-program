<template>
  <web-view v-if="webViewUrl" :src="webViewUrl" />
</template>

<script setup lang="ts">
import { WEBVIEWURL } from '@/utils/request'

const webViewUrl = ref<string>('')

onLoad(() => {
  const token = wx.getStorageSync('userInfo')?.token
  if (token) {
    // 售后页面使用与客服相同的入口，可通过 type 参数区分
    webViewUrl.value = `${WEBVIEWURL}/admin-service/wechat-msg?token=${token}&type=after_sale`
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
