<template>
  <view class="order-cost-card-wrap">
    <custom-card :show-bottom-margin="true">
      <section-header title="施工清单" color="#1E2222" :show-bar="false">
        <template #right>
          <view v-if="orderDetail?.order_type !== 'gangmaster'" class="header-materials-btn"
            @tap="handleViewMaterialsByOrderId">
            <text class="btn-text">辅材清单</text>
            <uni-icons type="right" size="14" color="#2D635E" />
          </view>
        </template>
      </section-header>

      <view v-for="(group, groupIndex) in groupedWorkPrices" :key="groupIndex" class="cost-item">
        <view v-if="orderDetail?.order_type === 'gangmaster'" class="group-item-header">
          <view class="header-left">
            <image v-if="group.craftsman?.avatar" class="avatar" :src="group.craftsman.avatar" mode="aspectFill" />
            <view v-else class="avatar-placeholder">
              <uni-icons type="person" size="20" color="#2D635E" />
            </view>
            <view class="header-info">
              <view class="craftsman-name">{{ group.craftsmanName }}</view>
              <view class="phone-info">
                <uni-icons type="phone" size="14" color="#6b7280" />
                <text>{{ formatPhone(group.craftsman?.phone) || '暂无' }}</text>
              </view>
            </view>
          </view>
          <view v-if="group.items[0]?.assigned_craftsman_id" class="materials-btn"
            @tap="handleViewMaterials(group.items[0])">
            <text class="btn-text">辅材清单</text>
            <uni-icons type="right" size="14" color="#2D635E" />
          </view>
        </view>

        <view v-for="(item, itemIndex) in group.items" :key="itemIndex" class="group-item">
          <view class="row">
            <view class="title">{{ item?.work_title }}</view>
          </view>
          <view class="group-item-container">
            <view>
              <view class="unit-price">价格：{{ item?.work_price }}</view>
              <view class="unit-price">数量：{{ item?.quantity }}</view>
              <view class="unit-price">单位：{{ item?.labour_cost_name }}</view>
              <view v-if="item?.is_set_minimum_price === '1'" class="minimum-price-badge">
                最低起步价：¥{{ item?.minimum_price }}
              </view>
            </view>
          </view>
          <view class="subtotal-row">
            <view class="subtotal">
              <text class="subtotal-label">小计：</text>
              <text class="subtotal-value">¥{{ formatCost(getItemSubtotal(item)) }}</text>
            </view>
            <view class="accept-btn" :class="{ accepted: item?.is_accepted }" :disabled="item?.is_accepted"
              @tap="handleAcceptOrderWorkPrice(item?.id)">
              <uni-icons v-if="item?.is_accepted" type="checkmarkempty" size="12" color="#07c160" />
              <text>{{ item?.is_accepted ? '已验收' : '确认验收' }}</text>
            </view>
          </view>
        </view>

        <view v-if="group.items[0]?.latest_construction_progress" class="construction-progress">
          <view class="progress-header">
            <view class="progress-title">
              <uni-icons type="calendar" size="14" color="#6b7280" />
              <text class="progress-title-text">最新施工进度</text>
            </view>
            <view class="view-more-btn" @tap="handleViewMoreProgress(group.items[0])">
              <text>查看更多</text>
            </view>
          </view>
          <view class="content-card">
            <view class="date-time-row">
              <text class="date-time-text">
                {{ formatDateTimeRange(group.items[0].latest_construction_progress.start_time,
                  group.items[0].latest_construction_progress.end_time) }}
              </text>
            </view>
            <view v-if="group.items[0]?.latest_construction_progress?.location" class="location-row">
              <text class="location-text">{{ group.items[0].latest_construction_progress.location }}</text>
            </view>
            <view v-if="group.items[0]?.latest_construction_progress?.description" class="description">
              {{ group.items[0].latest_construction_progress.description }}
            </view>
            <view v-if="group.items[0]?.latest_construction_progress?.photos?.length" class="photos-grid">
              <view v-for="(photo, photoIndex) in getProgressPhotos(group.items[0].latest_construction_progress.photos)"
                :key="photoIndex" class="photo-item"
                @tap="handlePreviewImage(group.items[0].latest_construction_progress.photos, photoIndex)">
                <image :src="photo" mode="aspectFill" class="photo-image" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="cost-summary">
        <view class="summary-items">
          <view class="summary-item">
            <text class="summary-label">工价合计</text>
            <text class="summary-value">¥{{ formatCost(orderDetail?.total_price || 0) }}</text>
          </view>
          <view v-if="orderDetail?.order_type === 'gangmaster'" class="summary-item">
            <text class="summary-label">
              工长工费<text v-if="orderDetail?.visiting_service_num" class="visit-count">(上门{{
                orderDetail.visiting_service_num
              }}次)</text>
            </text>
            <text class="summary-value">¥{{ formatCost(orderDetail?.gangmaster_cost || 0) }}</text>
          </view>
          <view class="summary-item">
            <text class="summary-label">平台服务费</text>
            <text class="summary-value">¥{{ formatCost(orderDetail?.total_service_fee || 0) }}</text>
          </view>
        </view>
        <view class="total-row">
          <text class="total-label">总计</text>
          <text class="total-amount">¥{{ formatCost(calculateFinalTotal()) }}</text>
        </view>
        <view class="action-buttons">
          <view class="pending-pay" :class="{ paid: orderDetail?.is_paid }">
            <text>{{ orderDetail?.is_paid ? '已支付' : '待支付' }}</text>
            <uni-icons v-if="orderDetail?.is_paid" type="checkmarkempty" size="14" color="#07c160" />
          </view>
        </view>
      </view>
    </custom-card>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CustomCard from '@/components/custom-card.vue'
import SectionHeader from '@/components/section-header.vue'
import { formatCost, formatPhone, previewImage, formatDateTimeRange } from '@/utils'
import { acceptOrderWorkPriceService } from '../service'

const props = defineProps<{ orderDetail: any }>()
const emit = defineEmits<{ refresh: [] }>()

const groupedWorkPrices = computed(() => {
  const map: Record<string | number, { craftsmanName: string; craftsman: any; items: any[] }> = {}
  const list = props.orderDetail?.parent_work_price_groups || []

  list.forEach((item: any) => {
    const craftsman = item.assigned_craftsman
    const key = craftsman?.id ?? 'unassigned'

    if (!map[key]) {
      map[key] = {
        craftsmanName: craftsman?.nickname || '未分配',
        craftsman: craftsman || null,
        items: [],
      }
    }
    map[key].items.push(item)
  })

  return Object.values(map)
})

const calculateFinalTotal = (): number => {
  const totalPrice = parseFloat(String(props.orderDetail?.total_price || 0)) || 0
  const gangmasterCost = parseFloat(String(props.orderDetail?.gangmaster_cost || 0)) || 0
  const serviceFee = parseFloat(String(props.orderDetail?.total_service_fee || 0)) || 0
  return totalPrice + gangmasterCost + serviceFee
}

/** 单项小计：若设置了最低起步价且 work_price * quantity < minimum_price，则取 minimum_price，否则取 work_price * quantity */
const getItemSubtotal = (item: any): number => {
  const workPrice = parseFloat(String(item?.work_price || 0)) || 0
  const quantity = parseFloat(String(item?.quantity || 0)) || 0
  const rawTotal = workPrice * quantity
  if (item?.is_set_minimum_price === '1') {
    const minimumPrice = parseFloat(String(item?.minimum_price || 0)) || 0
    return rawTotal < minimumPrice ? minimumPrice : rawTotal
  }
  return rawTotal
}

const handleViewMaterials = (priceItem: any): void => {
  uni?.vibrateShort()
  const assignedCraftsmanId = priceItem.assigned_craftsman_id || ''
  const orderType = props.orderDetail?.order_type || ''
  uni.navigateTo({
    url: `/package-mine/work-price-materials/index?workPriceItemId=${priceItem.id}&orderId=${props.orderDetail?.id || ''}&assignedCraftsmanId=${assignedCraftsmanId}&orderType=${orderType}`,
  })
}

const handleViewMaterialsByOrderId = (): void => {
  uni?.vibrateShort()
  const { id, order_type: orderType } = props.orderDetail || {}
  uni.navigateTo({
    url: `/package-mine/work-price-materials/index?orderId=${id || ''}&orderType=${orderType || ''}`,
  })
}

const handleViewMoreProgress = (item: any): void => {
  uni?.vibrateShort()
  if (!item?.id || !item?.assigned_craftsman_id) {
    uni.showToast({ title: '参数错误', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/package-mine/construction-progress/index?workPriceItemId=${item.id}&craftsmanId=${item.assigned_craftsman_id}`,
  })
}

const getProgressPhotos = (photos: string[]): string[] => {
  if (!photos || !Array.isArray(photos)) return []
  return photos.slice(0, 3)
}

const handlePreviewImage = (urls: string[], currentIndex: number | string): void => {
  const index = typeof currentIndex === 'string' ? parseInt(currentIndex, 10) : currentIndex
  previewImage(urls[index], urls)
}

const handleAcceptOrderWorkPrice = async (work_price_item_id: number): Promise<void> => {
  const res = await new Promise<boolean>((resolve) => {
    uni.showModal({
      title: '确认验收',
      content: '确定要验收此项工价吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#2d635e',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })
  if (!res) return

  const { success } = await acceptOrderWorkPriceService({ work_price_item_id })
  if (success) {
    uni.showToast({ title: '验收成功', icon: 'success' })
    emit('refresh')
  }
}
</script>

<style lang="scss" scoped>
.header-materials-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: $uni-color-primary;
}

.group-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 2rpx solid $uni-border-color;
  margin-bottom: 24rpx;

  .materials-btn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 24rpx;
    border-radius: 24rpx;
    background: rgba($uni-color-primary, 0.08);
    flex-shrink: 0;

    .btn-text {
      font-size: 24rpx;
      font-weight: 500;
      color: $uni-color-primary;
    }
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 24rpx;
    flex: 1;

    .avatar,
    .avatar-placeholder {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: #f0fdfa;
    }

    .avatar-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .craftsman-name {
      font-size: 28rpx;
      font-weight: 600;
      color: $uni-text-color;
    }

    .phone-info {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
  }
}

.group-item {
  border: 2rpx solid $uni-border-color;
  border-radius: 24rpx;
  padding: 32rpx;
  background: #f9fafb;
  margin-bottom: 24rpx;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .group-item-container {
    margin-top: 16rpx;
  }

  .subtotal-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 2rpx solid $uni-border-color;
  }

  .subtotal {
    .subtotal-label {
      font-size: 26rpx;
      color: $uni-text-color-grey;
    }

    .subtotal-value {
      font-size: 32rpx;
      font-weight: 600;
      color: $uni-color-primary;
    }
  }

  .title {
    flex: 1;
    font-size: 28rpx;
    font-weight: 600;
    color: $uni-text-color;
  }

  .unit-price {
    font-size: 24rpx;
    color: $uni-text-color-grey;
    margin-top: 16rpx;
  }

  .minimum-price-badge {
    display: inline-block;
    font-size: 24rpx;
    color: $uni-color-primary;
    background: rgba($uni-color-primary, 0.05);
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    margin-top: 16rpx;
  }

  .accept-btn {
    padding: 12rpx 24rpx;
    border-radius: 12rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #fff;
    background: $uni-color-primary;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;

    &::after {
      border: none;
    }

    &.accepted {
      background: transparent;
      color: $uni-color-success;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: 4rpx;
      font-size: 24rpx;
      font-weight: 400;
    }
  }
}

.construction-progress {
  margin-top: 24rpx;
  margin-bottom: 24rpx;

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  .progress-title {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: $uni-text-color-grey;
  }

  .view-more-btn {
    font-size: 24rpx;
    color: $uni-color-primary;
  }

  .content-card {
    background: #f9fafb;
    border-radius: 24rpx;
    padding: 24rpx;
    border: 2rpx solid $uni-border-color;
  }

  .date-time-row,
  .location-row {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 16rpx;
    font-size: 26rpx;
    color: $uni-text-color-grey;
  }

  .description {
    margin-top: 16rpx;
    padding: 16rpx;
    background: rgba($uni-color-primary, 0.03);
    border-left: 4rpx solid $uni-color-primary;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: $uni-text-color;
  }

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
    margin-top: 16rpx;
  }

  .photo-item {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12rpx;
    overflow: hidden;

    .photo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.cost-summary {
  margin-top: 48rpx;
  padding-top: 48rpx;
  border-top: 4rpx solid $uni-border-color;

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    margin-bottom: 32rpx;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;

    .summary-label {
      color: $uni-text-color-grey;

      .visit-count {
        font-size: 24rpx;
        color: $uni-text-color-grey;
      }
    }

    .summary-value {
      color: $uni-text-color;
      font-weight: 600;
    }
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24rpx;
    border-top: 2rpx solid $uni-border-color;
    margin-bottom: 32rpx;

    .total-label {
      font-size: 28rpx;
      font-weight: 600;
      color: $uni-text-color;
    }

    .total-amount {
      font-size: 48rpx;
      color: $uni-color-primary;
      font-weight: 700;
    }
  }

  .pending-pay {
    padding: 16rpx 32rpx;
    border-radius: 24rpx;
    font-size: 26rpx;
    font-weight: 600;
    background: rgba($uni-color-warning, 0.15);
    color: $uni-color-warning;
    display: inline-flex;
    align-items: center;
    gap: 8rpx;

    &.paid {
      background: rgba($uni-color-success, 0.15);
      color: $uni-color-success;
    }
  }
}
</style>
