<template>
  <view class="card" @tap="handleTap">
    <view class="card-top">
      <text class="card-name">{{ name }}</text>

      <view class="card-price-wrap">
        <view class="price-row">
          <text class="price-symbol">¥</text>
          <text class="price-num">{{ price }}</text>
        </view>
        <text class="price-unit">/{{ unit }}</text>
      </view>
    </view>

    <view class="card-info">
      <view class="info-row">
        <text class="info-label">计价</text>
        <text class="info-value">{{ pricingNote }}</text>
      </view>

      <view class="info-row">
        <text class="info-label">服务</text>
        <text class="info-value">{{ serviceScope }}</text>
      </view>
    </view>

    <view class="card-footer">
      <text class="footer-tip">平台认证 · 价格透明</text>

      <view class="footer-link">
        <text class="footer-link-text">查看详情</text>
        <view class="icon-chevron" />
      </view>
    </view>
  </view>
</template>


<script setup lang="ts">
import { computed } from 'vue'

interface LaborPriceItem {
  id: number
  name: string
  price: string | number
  unit: string
  pricingNote: string
  serviceScope: string
}

const props = defineProps<{
  item: LaborPriceItem
}>()

/**
 * 解构成 computed，避免 template 直接访问深层 props
 * 同时增强健壮性
 */
const id = computed(() => props.item?.id ?? 0)
const name = computed(() => props.item?.name ?? '')
const price = computed(() => props.item?.price ?? '--')
const pricingNote = computed(() => props.item?.pricingNote ?? '')
const serviceScope = computed(() => props.item?.serviceScope ?? '')

/**
 * 单位解析更严谨
 * 支持：
 * "元/㎡"
 * "㎡"
 * "/㎡"
 */
const unit = computed(() => {
  const raw = props.item?.unit?.trim() ?? ''
  if (!raw) return ''

  const index = raw.indexOf('/')
  return index >= 0 ? raw.slice(index + 1) : raw
})

const handleTap = (): void => {
  if (!id.value) return

  uni.navigateTo({
    url: `/package-labor-cost/labor-price-detail/index?id=${encodeURIComponent(
      String(id.value)
    )}`
  })
}
</script>


<style lang="scss" scoped>
.card {
  background: #fff;
  padding: 40rpx;
  border-radius: 32rpx;
  border: 2rpx solid #f0f0f0;
  box-shadow: 0 12rpx 48rpx -20rpx rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

/* 顶部 */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32rpx;
}

.card-name {
  flex: 1;
  max-width: 65%;
  font-size: 32rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 价格 */
.card-price-wrap {
  text-align: right;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  font-weight: 700;
  color: #2d635e;
}

.price-symbol {
  font-size: 24rpx;
  margin-right: 4rpx;
}

.price-num {
  font-size: 48rpx;
  font-family: ui-monospace, monospace;
}

.price-unit {
  font-size: 22rpx;
  color: #9ca3af;
  margin-top: 8rpx;
  display: block;
}

/* 信息区 */
.card-info {
  background: #f9fafb;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.info-row {
  display: flex;
  gap: 24rpx;
  font-size: 24rpx;
  line-height: 1.5;
}

.info-row+.info-row {
  margin-top: 16rpx;
}

.info-label {
  width: 52rpx;
  color: #9ca3af;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  color: #4b5563;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 底部 */
.card-footer {
  border-top: 2rpx dashed #e5e7eb;
  padding-top: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-tip {
  font-size: 20rpx;
  color: #9ca3af;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.footer-link-text {
  font-size: 24rpx;
  font-weight: 500;
  color: #2d635e;
}

.icon-chevron {
  width: 24rpx;
  height: 24rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
