<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y enable-back-to-top :scroll-with-animation="true" :show-scrollbar="false"
      refresher-enabled :refresher-triggered="is_refreshed" @refresherrefresh="onRefresherrefresh">
      <view class="scroll-content">
        <info-wrap :craftsman_user="craftsman_user" />
        
        <node-description title="作品与动态" />
        <works-list :published_works_list="published_works_list" />
      </view>
    </scroll-view>
    <view v-if="craftsman_user?.id" class="footer">
      <button class="contact-btn" @click="handleContactCraftsman">
        <uni-icons type="chatbubble" size="18" color="#fff" />
        <text>联系工匠</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
// components
import InfoWrap from './components/info-wrap.vue'
import NodeDescription from '@/components/node-description.vue'
import WorksList from './components/works-list.vue'

// utils
import { handleContactUser } from './utils'

// services
import { getCraftsmanUserInfoService, getCraftsmanPublishedWorksListService } from './service'

const craftsman_user = ref<any>({})
const published_works_list = ref<any[]>([])
const is_refreshed = ref(false)

// 联系工匠
const handleContactCraftsman = (): void => {
  uni?.vibrateShort()
  handleContactUser(craftsman_user.value)
}

// 下拉刷新事件
const onRefresherrefresh = async (): Promise<void> => {
  is_refreshed.value = true
  if (craftsman_user.value?.id) {
    await loadCraftsmanUserInfo(craftsman_user.value?.id)
  }
  is_refreshed.value = false
}

// 加载详情
const loadCraftsmanUserInfo = async (id: number): Promise<void> => {
  const { success, data } = await getCraftsmanUserInfoService(id)
  if (!success) return
  craftsman_user.value = data ?? {}

  const { success: worksSuccess, data: worksData } = await getCraftsmanPublishedWorksListService(id)
  if (!worksSuccess) return
  published_works_list.value = worksData ?? []
}

onLoad((options) => {
  const { id } = options ?? {}
  loadCraftsmanUserInfo(Number(id))
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #fff;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

.scroll-content {
  padding: 24rpx;
  box-sizing: border-box;
}

.footer {
  padding: 16px;
  border-top: 0.701px solid #e5e5e5;
  background: rgba(255, 255, 255, 0.95);
}

uni-icons {
  display: flex;
  align-items: center;
}

.contact-btn {
  display: flex;
  padding: 14px 0 16px 0;
  justify-content: center;
  align-items: flex-end;
  align-self: stretch;
  border-radius: 23517600px;
  background: #2d635e;
  box-shadow: 0 8px 24px 0 rgba(45, 99, 94, 0.25);

  color: #fff;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  line-height: 22.5px;
  letter-spacing: 1.266px;

  text {
    margin-left: 8px;
  }

  &::after {
    border: none;
  }
}
</style>
