<!-- 辅材清单页：展示订单辅材列表，支持批量支付/批量验收 -->
<template>
  <view class="container">
    <scroll-view
      class="scroll-view"
      scroll-y
      :show-scrollbar="false"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
    >
      <!-- 辅材列表 -->
      <view v-if="materialsList?.commodity_list?.length" class="materials-list">
        <view
          v-for="commodity in materialsList.commodity_list"
          :key="commodity.id"
          class="material-item"
        >
          <image
            v-if="commodity.commodity_cover?.length"
            :src="commodity.commodity_cover[0]"
            mode="aspectFill"
            class="material-image"
            @tap.stop="previewImage(commodity.commodity_cover[0], commodity.commodity_cover)"
          />
          <view v-else class="material-image material-placeholder">
            <uni-icons type="shop" size="32" color="#ccc" />
          </view>

          <view class="material-info">
            <view class="material-name-row" @tap.stop="handleMaterialDetail(commodity)">
              <text class="material-name">{{ commodity.commodity_name }}</text>
              <uni-icons type="right" size="14" color="#b8b8b8" />
            </view>
            <text class="material-meta">
              ¥{{ formatCost(getUnitPrice(commodity)) }}/{{ commodity.commodity_unit }} ×
              {{ commodity.quantity }}
            </text>
            <view class="material-footer">
              <text class="material-total-price"
                >¥{{ formatCost(commodity.settlement_amount) }}</text
              >

              <view
                v-if="commodity.is_paid"
                class="accept-status"
                :class="{ accepted: commodity.is_accepted }"
              >
                <uni-icons
                  type="checkmarkempty"
                  size="13"
                  :color="commodity.is_accepted ? '#2d635e' : '#909399'"
                />
                <text>{{ commodity.is_accepted ? '已验收' : '待验收' }}</text>
              </view>

              <view v-else class="accept-status unpaid">
                <uni-icons type="wallet" size="13" color="#909399" />
                <text>待支付</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <empty-state v-else text="暂无辅材清单" />
    </scroll-view>

    <!-- 底部汇总栏 -->
    <view v-if="materialsList?.commodity_list?.length" class="bottom-bar">
      <view class="summary-row">
        <text class="summary-label">辅材合计</text>
        <text class="summary-count">共 {{ totalQuantity }} 件</text>
      </view>
      <view class="summary-row total-row">
        <text class="total-label">总价</text>
        <text class="total-price">¥{{ formatCost(materialsList?.total_price || 0) }}</text>
      </view>
      <button v-if="hasUnpaidMaterials" class="batch-accept-btn" @tap="handleBatchPay">
        <uni-icons type="checkbox" size="18" color="#fff" />
        <text>全部支付</text>
      </button>
      <button v-else-if="hasUnacceptedMaterials" class="batch-accept-btn" @tap="handleBatchAccept">
        <uni-icons type="checkbox" size="18" color="#fff" />
        <text>全部验收</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 辅材清单页
 * 支持两种数据来源：工价项+师傅（gangmaster）、订单（order）
 */
import EmptyState from '@/components/empty-state.vue'
import {
  getMaterialsByWorkPriceItemIdAndCraftsman,
  getMaterialsByOrderId,
  batchAcceptOrderMaterialsService,
} from './service'
import { formatCost, previewImage } from '@/utils'

import { getPayParamsService } from './service'

// 页面参数
const workPriceItemId = ref<number | string>('')
const assignedCraftsmanId = ref<number | string>('')
const orderId = ref<number | string>('')
const orderType = ref<string>('') // gangmaster | 其他
const workKindCode = ref<string>('')
const workKindName = ref<string>('')
const materialsList = ref<any>(null)
const isTriggered = ref(false) // 下拉刷新状态

const normalizeParam = (value: unknown): string => {
  if (value == null) return ''
  const text = String(value)
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

const hasValidCraftsmanId = (value: unknown): boolean => {
  const text = normalizeParam(value)
  return text !== '' && text !== 'null' && text !== 'undefined'
}

const filterMaterialsByWorkKind = (data: any): any => {
  const list = data?.commodity_list
  if (!Array.isArray(list)) return data

  const code = normalizeParam(workKindCode.value)
  const name = normalizeParam(workKindName.value)
  if (!code && !name) return data

  const commodity_list = list.filter((item: any) => {
    if (code) return item?.work_kind_code === code
    return item?.work_kind_name === name
  })
  const total_price = commodity_list.reduce(
    (sum: number, item: any) => sum + (Number(item?.settlement_amount) || 0),
    0,
  )

  return {
    ...data,
    commodity_list,
    total_price: Number(total_price.toFixed(2)),
  }
}

/** 辅材总数量 */
const totalQuantity = computed(() => {
  if (!materialsList.value?.commodity_list) return 0
  return materialsList.value.commodity_list.reduce(
    (sum: number, item: any) => sum + (Number(item.quantity) || 0),
    0,
  )
})

/** 是否存在未支付的辅材 */
const hasUnpaidMaterials = computed(() => {
  if (!materialsList.value?.commodity_list) return false
  return materialsList.value.commodity_list?.some((c: any) => !c.is_paid)
})

/** 是否存在未验收的辅材（仅全部已支付时有效） */
const hasUnacceptedMaterials = computed(() => {
  if (!materialsList.value?.commodity_list) return false
  return materialsList.value.commodity_list?.some((commodity: any) => !commodity.is_accepted)
})

/** 计算辅材单价（结算金额 / 数量） */
const getUnitPrice = (commodity: any): number => {
  if (!commodity.quantity || commodity.quantity === 0) return 0
  return Number(commodity.settlement_amount) / Number(commodity.quantity)
}

/** 跳转辅材详情 */
const handleMaterialDetail = (commodity: any): void => {
  const id = commodity?.commodity_id ?? commodity?.id
  if (!id) {
    uni.showToast({ title: '辅材信息错误', icon: 'none' })
    return
  }
  uni.navigateTo({ url: `/package-auxiliary-material/product-detail/index?id=${id}` })
}

/** 根据 orderType 调用对应接口获取辅材数据 */
const fetchMaterials = async (): Promise<any> => {
  if (orderType.value === 'gangmaster' && hasValidCraftsmanId(assignedCraftsmanId.value)) {
    if (!workPriceItemId.value || !assignedCraftsmanId.value) return null
    return getMaterialsByWorkPriceItemIdAndCraftsman(
      workPriceItemId.value,
      assignedCraftsmanId.value,
    )
  }
  if (!orderId.value) return null
  return getMaterialsByOrderId(orderId.value)
}

/** 加载辅材列表 */
const loadMaterials = async (): Promise<void> => {
  try {
    const res = await fetchMaterials()
    if (!res) return
    materialsList.value = filterMaterialsByWorkKind(res?.data ?? res ?? null)
  } catch {
    materialsList.value = null
  }
}

/** 下拉刷新 */
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadMaterials()
  isTriggered.value = false
}

/** 显示确认弹窗，返回用户是否点击确定 */
const showConfirmModal = (title: string, content: string): Promise<boolean> =>
  new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#2d635e',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

/** 全部支付 */
const handleBatchPay = async (): Promise<void> => {
  uni?.vibrateShort()
  const list = materialsList.value?.commodity_list
  if (!list) {
    uni.showToast({ title: '辅材信息错误', icon: 'none' })
    return
  }

  const unpaidList = list.filter((c: any) => !c.is_paid)
  if (!unpaidList.length) {
    uni.showToast({ title: '没有未支付的辅材', icon: 'none' })
    return
  }

  const totalAmount = unpaidList.reduce(
    (sum: number, c: any) => sum + (Number(c.settlement_amount) || 0),
    0,
  )
  const materialsIds = unpaidList.map((c: any) => c.id)

  if (!(await showConfirmModal('确认支付', `确定要支付 ${unpaidList.length} 项辅材吗？`))) {
    return
  }

  uni.showLoading({ title: '获取支付参数...', mask: true })
  const { success, data } = await getPayParamsService({
    pay_type: 'material_batch',
    materialsIds,
    order_amount: totalAmount,
  })
  uni.hideLoading()

  if (!success) {
    uni.showToast({ title: '获取支付参数失败', icon: 'none' })
    return
  }

  uni.requestPayment({
    provider: 'wxpay',
    ...data,
    success: () => {
      uni.showToast({ title: '支付成功', icon: 'success' })
      loadMaterials()
    },
  })
}

/** 批量验收全部未验收辅材 */
const handleBatchAccept = async (): Promise<void> => {
  uni?.vibrateShort()
  const list = materialsList.value?.commodity_list
  if (!list) {
    uni.showToast({ title: '辅材信息错误', icon: 'none' })
    return
  }

  const unacceptedIds = list.filter((c: any) => !c.is_accepted).map((c: any) => c.id)
  if (!unacceptedIds.length) {
    uni.showToast({ title: '没有未验收的辅材', icon: 'none' })
    return
  }

  if (!(await showConfirmModal('验收辅材', `确定要验收 ${unacceptedIds.length} 项辅材吗？`))) return

  uni.showLoading({ title: '验收中...', mask: true })
  const { success } = await batchAcceptOrderMaterialsService({ materialsIds: unacceptedIds })
  uni.hideLoading()

  if (success) {
    uni.showToast({ title: '验收成功', icon: 'success' })
    await loadMaterials()
  }
}

// 页面加载时解析参数并拉取数据
onLoad((options = {}) => {
  console.log(options, 'options')

  workPriceItemId.value = options.workPriceItemId ?? ''
  assignedCraftsmanId.value = options.assignedCraftsmanId ?? ''
  orderId.value = options.orderId ?? ''
  orderType.value = options.orderType ?? ''
  workKindCode.value = normalizeParam(options.workKindCode)
  workKindName.value = normalizeParam(options.workKindName)
  loadMaterials()
})
</script>

<style lang="scss">
/* 页面容器 */
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

/* 辅材列表 */
.materials-list {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .material-item {
    display: flex;
    gap: 32rpx;
    padding: 32rpx;
    background: $uni-bg-color;
    border-radius: $uni-border-radius-base;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

    .material-image {
      width: 192rpx;
      height: 192rpx;
      border-radius: 16rpx;
      flex-shrink: 0;
      object-fit: cover;

      &.material-placeholder {
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .material-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 16rpx;

      .material-name-row {
        display: flex;
        align-items: flex-start;
        gap: 8rpx;
        min-width: 0;

        .material-name {
          flex: 1;
          min-width: 0;
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
      }

      .material-meta {
        font-size: 28rpx;
        color: $uni-text-color-grey;
      }

      .material-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .material-total-price {
          font-size: 36rpx;
          font-weight: 600;
          color: $uni-color-primary;
        }

        .accept-status {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 24rpx;
          padding: 12rpx 24rpx;
          border-radius: 16rpx;
          color: #909399;
          background: #f5f7fa;

          &.accepted {
            color: $uni-color-success;
            background: #edf7f2;
          }

          &.unpaid {
            color: #909399;
            background: #f5f7fa;
          }
        }
      }
    }
  }
}

/* 底部汇总栏 */
.bottom-bar {
  flex-shrink: 0;
  background: $uni-bg-color;
  border-top: 2rpx solid $uni-border-color;
  padding: 24rpx 32rpx;
  padding-bottom: max(24rpx, env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);

  .summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    &.total-row {
      margin-bottom: 24rpx;

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
    }

    .summary-label {
      font-size: 28rpx;
      color: $uni-text-color-grey;
    }

    .summary-count {
      font-size: 24rpx;
      color: $uni-text-color-placeholder;
    }
  }

  .batch-accept-btn {
    width: 100%;
    padding: 12rpx;
    border-radius: 24rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
    background: $uni-color-primary;

    text {
      margin-left: 8rpx;
    }
  }
}
</style>
