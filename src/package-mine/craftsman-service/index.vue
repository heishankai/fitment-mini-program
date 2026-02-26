<template>
  <web-view v-if="webViewUrl" :src="webViewUrl" />
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { WEBVIEWURL } from '@/utils/request'

const webViewUrl = ref<string>('')

onLoad((options) => {
  const { room_id, craftsmanUserId, craftsmanUserName } = options ?? {}
  const token = wx.getStorageSync('userInfo')?.token

  if (!token) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }

  if (!room_id) {
    uni.showToast({
      title: '房间ID不存在',
      icon: 'none',
    })
    return
  }

  const params: string[] = []
  params.push(`token=${token}`)
  if (craftsmanUserId) params.push(`craftsmanUserId=${craftsmanUserId}`)
  if (craftsmanUserName) params.push(`craftsmanUserName=${craftsmanUserName}`)

  webViewUrl.value = `${WEBVIEWURL}/chat/wechat/${room_id}?${params.join('&')}`
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #f8f9fa;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
