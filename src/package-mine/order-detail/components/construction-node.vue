<template>
  <view v-if="order_details?.construction_nodes?.length" class="construction-node">
    <node-description title="施工节点">
      <timeline-item
        v-for="(item, i) in order_details?.construction_nodes"
        :key="item?.id ?? i"
        :completed="true"
        :title="`${item?.work_kind_name || '工价'}施工`"
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

const hasAssignedCraftsman = (item: any): boolean => {
  const cid = item?.assigned_craftsman_id
  return cid != null && cid !== '' && cid !== 'null' && cid !== 'undefined'
}

const appendQuery = (
  params: string[],
  key: string,
  value: number | string | null | undefined,
): void => {
  if (value == null || value === '' || value === 'null' || value === 'undefined') return
  params.push(`${key}=${encodeURIComponent(String(value))}`)
}

const buildWorkPriceListUrl = (item: any): string => {
  const { order_type, id } = props?.order_details ?? {}
  const params: string[] = []
  appendQuery(params, 'orderId', id)
  appendQuery(params, 'order_type', order_type)

  if (order_type === ORDER_TYPE_ENUM.CRAFTSMAN) {
    return `/package-mine/work-price-list/index?${params.join('&')}`
  }

  if (hasAssignedCraftsman(item)) {
    appendQuery(params, 'workPriceItemId', item?.id)
    appendQuery(params, 'craftsmanId', item?.assigned_craftsman_id)
    return `/package-mine/work-price-list/index?${params.join('&')}`
  }

  if (Array.isArray(item?.work_price_item_ids) && item.work_price_item_ids.length > 0) {
    appendQuery(params, 'workPriceItemIds', item.work_price_item_ids.join(','))
  } else {
    appendQuery(params, 'workPriceItemId', item?.id)
  }
  appendQuery(params, 'workKindCode', item?.work_kind_code)
  appendQuery(params, 'workKindName', item?.work_kind_name)
  return `/package-mine/work-price-list/index?${params.join('&')}`
}

const buildNodeOrderUrl = (path: string, item: any): string => {
  const { order_type, id } = props?.order_details ?? {}
  const params: string[] = []
  appendQuery(params, 'orderId', id)
  appendQuery(params, 'orderType', order_type)
  appendQuery(params, 'workKindCode', item?.work_kind_code)
  appendQuery(params, 'workKindName', item?.work_kind_name)
  return `${path}?${params.join('&')}`
}

// 跳转辅材清单页面
const handleMaterials = (item: any): void => {
  const { order_type, id } = props?.order_details ?? {}

  if (order_type === ORDER_TYPE_ENUM.CRAFTSMAN) {
    uni.navigateTo({
      url: `/package-mine/work-price-materials/index?orderId=${id}&orderType=${order_type}`,
    })
    return
  }

  if (!hasAssignedCraftsman(item)) {
    uni.navigateTo({
      url: buildNodeOrderUrl('/package-mine/work-price-materials/index', item),
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

  if (!hasAssignedCraftsman(item)) {
    uni.navigateTo({
      url: buildNodeOrderUrl('/package-mine/construction-progress/index', item),
    })
    return
  }

  uni.navigateTo({
    url: `/package-mine/construction-progress/index?workPriceItemId=${item?.id}&craftsmanId=${item?.assigned_craftsman_id}`,
  })
}

// 跳转工价清单页面
const handleWorkPriceList = (item: any): void => {
  uni.navigateTo({
    url: buildWorkPriceListUrl(item),
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
