<template>
  <view class="container">
    <scroll-view
      class="scroll-view"
      scroll-y
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      refresher-enabled
      :refresher-triggered="is_refreshed"
      @scroll="onScroll"
      @refresherrefresh="onRefresherrefresh"
    >
      <view class="scroll-content">
        <project-overview :order_details="order_details" />
        <order-cost :order_details="order_details" @refresh="loadOrderDetail(order_details?.id)" />
        <construction-node :order_details="order_details" />
        <sub-order-cost
          v-if="sub_work_groups?.length"
          :sub_work_groups="sub_work_groups"
          @refresh="loadOrderDetail(order_details?.id)"
        />
      </view>
    </scroll-view>
    <contact-service :scroll-top="scrollTop" />
  </view>
</template>

<script setup lang="ts">
// components
import projectOverview from './components/project-overview.vue'
import contactService from '@/components/contact-service.vue'
import orderCost from './components/order-cost.vue'
import constructionNode from './components/construction-node.vue'
import subOrderCost from './components/sub-order-cost.vue'

// services
import { getOrderDetailService } from './service'
// utils
import { resolveCraftsmanNodeData } from './utils'

const order_details = ref<any>({})
const sub_work_groups = ref<any[]>([])
const scrollTop = ref<number>(0)
const is_refreshed = ref(false)

// 滚动事件
const onScroll = (e: any): void => (scrollTop.value = e.detail.scrollTop)

// 下拉刷新事件
const onRefresherrefresh = async (): Promise<void> => {
  is_refreshed.value = true
  if (order_details.value?.id) {
    await loadOrderDetail(order_details.value?.id)
  }
  is_refreshed.value = false
}

// 加载订单详情
const loadOrderDetail = async (id: number | string): Promise<void> => {
  try {
    const { success, data } = await getOrderDetailService(id)
    if (!success) return
    console.log('订单详情', JSON.stringify(data))

    order_details.value = resolveCraftsmanNodeData(data) ?? {}
  } catch {
    sub_work_groups.value = []
  }
}

onLoad((options) => {
  const { id } = options ?? {}
  loadOrderDetail(id)
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
</style>
