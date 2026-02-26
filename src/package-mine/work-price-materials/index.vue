<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y :show-scrollbar="false" refresher-enabled
      :refresher-triggered="isTriggered" @refresherrefresh="onRefresherrefresh">
      <view v-if="materialsList?.commodity_list?.length" class="materials-container">
        <view class="materials-list">
          <view v-for="commodity in materialsList.commodity_list" :key="commodity.id" class="material-item">
            <image v-if="commodity.commodity_cover?.length" :src="commodity.commodity_cover[0]" mode="aspectFill"
              class="material-image"
              @tap.stop="previewImage(commodity.commodity_cover[0], commodity.commodity_cover)" />
            <view v-else class="material-image-placeholder">
              <uni-icons type="shop" size="32" color="#ccc" />
            </view>

            <view class="material-info">
              <text class="material-name">{{ commodity.commodity_name }}</text>
              <text class="material-meta">
                ¥{{ formatCost(getUnitPrice(commodity)) }}/{{ commodity.commodity_unit }} ×
                {{ commodity.quantity }} {{ commodity.commodity_unit }}
              </text>
              <view class="material-footer">
                <text class="material-total-price">¥{{ formatCost(commodity.settlement_amount) }}</text>
                <view v-if="commodity.is_accepted" class="accepted-status">
                  <uni-icons type="checkmarkempty" size="12" color="#07c160" />
                  <text class="accepted-text">已验收</text>
                </view>
                <view v-else class="accept-btn" @tap.stop="handleAcceptMaterial(Number(commodity.id))">
                  确认验收
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <empty-state v-else text="暂无辅材清单" />
    </scroll-view>

    <view v-if="materialsList?.commodity_list?.length" class="bottom-bar">
      <view class="bottom-content">
        <view class="summary-row">
          <text class="summary-label">辅材合计</text>
          <text class="summary-count">共 {{ totalQuantity }} 件</text>
        </view>
        <view class="summary-row total-row">
          <text class="total-label">总价</text>
          <text class="total-price">¥{{ formatCost(materialsList?.total_price || 0) }}</text>
        </view>
        <button v-if="hasUnacceptedMaterials" class="batch-accept-btn" @tap="handleBatchAccept">
          全部确认验收
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import EmptyState from '@/components/empty-state.vue'
import {
  getMaterialsByWorkPriceItemIdAndCraftsman,
  getMaterialsByOrderId,
  acceptOrderMaterialsService,
  batchAcceptOrderMaterialsService,
} from '../order-detail/service'
import { formatCost, previewImage } from '@/utils'

const workPriceItemId = ref<number | string>('')
const assignedCraftsmanId = ref<number | string>('')
const orderId = ref<number | string>('')
const orderType = ref<string>('')
const materialsList = ref<any>(null)
const isTriggered = ref(false)

const totalQuantity = computed(() => {
  if (!materialsList.value?.commodity_list) return 0
  return materialsList.value.commodity_list.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0)
})

const hasUnacceptedMaterials = computed(() => {
  if (!materialsList.value?.commodity_list) return false
  return materialsList.value.commodity_list.some((commodity: any) => !commodity.is_accepted)
})

const getUnitPrice = (commodity: any): number => {
  if (!commodity.quantity || commodity.quantity === 0) return 0
  return Number(commodity.settlement_amount) / Number(commodity.quantity)
}

const loadMaterials = async (): Promise<void> => {
  if (orderType.value === 'gangmaster') {
    if (!workPriceItemId.value || !assignedCraftsmanId.value) return
    try {
      const res = await getMaterialsByWorkPriceItemIdAndCraftsman(
        workPriceItemId.value,
        assignedCraftsmanId.value,
      )
      const data = res?.data ?? res
      materialsList.value = data ?? null
    } catch {
      materialsList.value = null
    }
  } else {
    if (!orderId.value) return
    try {
      const res = await getMaterialsByOrderId(orderId.value)
      const data = res?.data ?? res
      materialsList.value = data ?? null
    } catch {
      materialsList.value = null
    }
  }
}

const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadMaterials()
  isTriggered.value = false
}

const handleAcceptMaterial = async (materialsId: number): Promise<void> => {
  uni?.vibrateShort()

  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认验收',
      content: '确定要验收此项辅材吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#2d635e',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  const acceptRes = await acceptOrderMaterialsService({ materialsId })
  const success = acceptRes?.success === true || acceptRes?.code === '0' || acceptRes?.code === 200
  if (success) {
    uni.showToast({ title: '验收成功', icon: 'none' })
    await loadMaterials()
  }
}

const handleBatchAccept = async (): Promise<void> => {
  uni?.vibrateShort()

  if (!materialsList.value?.commodity_list) {
    uni.showToast({ title: '辅材信息错误', icon: 'none' })
    return
  }

  const unacceptedMaterialsIds = materialsList.value.commodity_list
    .filter((commodity: any) => !commodity.is_accepted)
    .map((commodity: any) => Number(commodity.id))

  if (unacceptedMaterialsIds.length === 0) {
    uni.showToast({ title: '没有未验收的辅材', icon: 'none' })
    return
  }

  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认一键验收',
      content: `确定要验收 ${unacceptedMaterialsIds.length} 项辅材吗？`,
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#2d635e',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  uni.showLoading({ title: '验收中...', mask: true })

  try {
    const batchRes = await batchAcceptOrderMaterialsService({ materialsIds: unacceptedMaterialsIds })
    const success = batchRes?.success === true || batchRes?.code === '0' || batchRes?.code === 200

    uni.hideLoading()

    if (!success) {
      uni.showToast({ title: batchRes?.message ?? '验收失败，请重试', icon: 'none' })
      return
    }

    uni.showToast({ title: '验收成功', icon: 'success' })
    await loadMaterials()
  } catch (error: any) {
    console.error('批量验收失败:', error)
    uni.hideLoading()
    uni.showToast({ title: '验收失败，请重试', icon: 'none' })
  }
}

onLoad((options) => {
  const { workPriceItemId: id, assignedCraftsmanId: craftsmanId, orderId: oId, orderType: oType } = options ?? {}
  workPriceItemId.value = id || ''
  assignedCraftsmanId.value = craftsmanId || ''
  orderId.value = oId || ''
  orderType.value = oType || ''
  loadMaterials()
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
  background: $uni-bg-color-grey;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 0;
}

.materials-container {
  padding: 32rpx;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.material-item {
  display: flex;
  gap: 32rpx;
  padding: 32rpx;
  background: $uni-bg-color;
  border-radius: $uni-border-radius-base;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.material-image {
  width: 192rpx;
  height: 192rpx;
  border-radius: 16rpx;
  object-fit: cover;
  flex-shrink: 0;
}

.material-image-placeholder {
  width: 192rpx;
  height: 192rpx;
  border-radius: 16rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.material-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.material-name {
  font-size: 36rpx;
  font-weight: 600;
  color: $uni-text-color;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.material-meta {
  font-size: 28rpx;
  color: $uni-text-color-grey;
  margin-bottom: 16rpx;
}

.material-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.material-total-price {
  font-size: 36rpx;
  font-weight: 600;
  color: $uni-color-primary;
}

.accepted-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.accepted-text {
  font-size: 24rpx;
  color: $uni-color-success;
}

.accept-btn {
  padding: 12rpx 24rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  color: #fff;
  background: $uni-color-primary;
  border: none;

  &::after {
    border: none;
  }
}

.bottom-bar {
  flex-shrink: 0;
  background: $uni-bg-color;
  border-top: 2rpx solid $uni-border-color;
  padding: 24rpx 32rpx;
  padding-bottom: max(24rpx, env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;

  &.total-row {
    margin-bottom: 24rpx;
  }
}

.summary-label {
  font-size: 28rpx;
  color: $uni-text-color-grey;
}

.summary-count {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
}

.total-label {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.total-price {
  font-size: 40rpx;
  font-weight: 700;
  color: $uni-color-primary;
}

.batch-accept-btn {
  width: 100%;
  padding: 12rpx;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  background: $uni-color-primary;
  border: none;

  &::after {
    border: none;
  }
}
</style>
