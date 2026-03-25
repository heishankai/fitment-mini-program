<template>
  <view v-if="order_details?.construction_nodes?.length" class="construction-node">
    <node-description title="施工节点">
      <timeline-item
        v-for="(item, i) in order_details?.construction_nodes"
        :key="item?.id ?? i"
        :completed="true"
        :title="`${item?.work_kind_name}施工`"
        :is-last="i === order_details?.construction_nodes?.length - 1"
      >
        <view class="cell-wrap">
          <view class="cell-item" @click="handleWorkPriceList(item)">
            <view class="label">工价清单</view>
            <uni-icons type="right" size="14" color="#ccc" />
          </view>
          <view class="cell-item" @click="handleMaterials(item)">
            <view class="label">辅材清单</view>
            <uni-icons type="right" size="14" color="#ccc" />
          </view>
          <view class="cell-item" @click="handleConstructionProgress(item)">
            <view class="label">施工进度</view>
            <uni-icons type="right" size="14" color="#ccc" />
          </view>
        </view>
      </timeline-item>
    </node-description>
  </view>
</template>

<script setup lang="ts">
import nodeDescription from '@/components/node-description.vue'
import timelineItem from '@/components/timeline-item.vue'

import { ORDER_TYPE_ENUM } from '@/constant'

const props = defineProps<{
  order_details: any
}>()

// 跳转辅材清单页面
const handleMaterials = (item: any): void => {
  const { order_type, id } = props?.order_details ?? {}

  if (order_type === ORDER_TYPE_ENUM.CRAFTSMAN) {
    uni.navigateTo({
      url: `/package-mine/work-price-materials/index?orderId=${id}&orderType=${order_type}`,
    })
    return
  }

  uni.navigateTo({
    url: `/package-mine/work-price-materials/index?workPriceItemId=${item?.id}&orderId=${id}&assignedCraftsmanId=${item?.assigned_craftsman_id}&orderType=${order_type}`,
  })
}

// 跳转施工记录页面
const handleConstructionProgress = (item: any): void => {
  const { order_type, id } = props?.order_details ?? {}

  if (order_type === ORDER_TYPE_ENUM.CRAFTSMAN) {
    uni.navigateTo({
      url: `/package-mine/construction-progress/index?orderId=${id}`,
    })
    return
  }

  uni.navigateTo({
    url: `/package-mine/construction-progress/index?workPriceItemId=${item?.id}&craftsmanId=${item?.assigned_craftsman_id}`,
  })
}

// 跳转工价清单页面
const handleWorkPriceList = (item: any): void => {
  // console.log(item, 'item')
  const { order_type, id } = props?.order_details ?? {}

  if (order_type === ORDER_TYPE_ENUM.CRAFTSMAN) {
    uni.navigateTo({
      url: `/package-mine/work-price-list/index?orderId=${id}&order_type=${order_type}`,
    })
    return
  }

  uni.navigateTo({
    url: `/package-mine/work-price-list/index?workPriceItemId=${item?.id}&craftsmanId=${item?.assigned_craftsman_id}&order_type=${order_type}`,
  })
}
</script>

<style lang="scss" scoped>
.construction-node {
  .cell-wrap {
    border-radius: 4px;
    border: 0.701px solid #e5e5e5;
    margin-top: 24rpx;

    .cell-item {
      padding: 24rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.701px solid #e5e5e5;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
