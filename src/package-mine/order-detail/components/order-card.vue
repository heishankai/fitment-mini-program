<template>
  <view class="order-card-wrap">
    <custom-card :show-bottom-margin="true">
      <section-header title="订单信息" color="#1E2222" :show-bar="false" />

      <view v-if="orderNo" class="order-no" @tap="handleCopyOrderNo">
        <view class="order-no-content">
          <text class="order-no-label">订单号 <text class="copy-hint">点击复制</text></text>
          <text class="order-no-value">{{ orderNo }}</text>
        </view>
      </view>

      <view class="craftsman">
        <image class="avatar" :src="craftsman?.avatar || '/static/logo.png'" mode="aspectFill" />
        <view class="info">
          <text class="name">{{ craftsman?.nickname }}</text>
          <view class="meta">
            <view class="meta-item">
              <view class="icon-wrapper">
                <uni-icons type="phone" size="14" color="#2D635E" />
              </view>
              <text>{{ formatPhone(craftsman?.phone) }}</text>
            </view>
          </view>
          <view class="badges">
            <view v-if="craftsman?.isVerified" class="badge verified">
              <uni-icons type="checkmarkempty" size="10" color="#fff" />
              <text>实名认证</text>
            </view>
            <view v-if="craftsman?.isSkillVerified" class="badge skill">
              <uni-icons type="checkmarkempty" size="10" color="#fff" />
              <text>技能认证</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="firstProgress" class="construction-progress">
        <view class="progress-header">
          <view class="progress-title">
            <uni-icons type="calendar" size="16" color="#2D635E" />
            <text class="progress-title-text">最新施工进度</text>
          </view>
          <view class="view-more-btn" @tap="handleViewAllProgress">
            <text>查看全部</text>
            <uni-icons type="right" size="12" color="#2D635E" />
          </view>
        </view>
        <view class="content-card">
          <view class="date-time-row">
            <uni-icons type="calendar" size="14" color="#9ca3af" />
            <text class="date-time-text">
              {{ formatDateTimeRange(firstProgress.start_time, firstProgress.end_time) }}
            </text>
          </view>
          <view v-if="firstProgress?.location" class="location-row">
            <uni-icons type="location" size="14" color="#9ca3af" />
            <text class="location-text">{{ firstProgress.location }}</text>
          </view>
          <view v-if="firstProgress?.description" class="description">
            {{ firstProgress.description }}
          </view>
        </view>
      </view>
    </custom-card>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CustomCard from '@/components/custom-card.vue'
import SectionHeader from '@/components/section-header.vue'
import { formatPhone, formatDateTimeRange } from '@/utils'
import { getConstructionProgressByOrderId } from '../service'

const props = defineProps<{
  craftsman?: {
    avatar?: string
    nickname?: string
    phone?: string
    isVerified?: boolean
    isSkillVerified?: boolean
  }
  orderId?: number | string
  orderNo?: string
}>()

const constructionProgress = ref<any[]>([])
const firstProgress = computed(() => {
  if (!constructionProgress.value?.length) return null
  return constructionProgress.value[0]
})

const loadConstructionProgress = async (): Promise<void> => {
  if (!props.orderId) return
  const { success, data } = await getConstructionProgressByOrderId(props.orderId)
  if (success && data && Array.isArray(data) && data.length > 0) {
    constructionProgress.value = data
  }
}

const handleCopyOrderNo = (): void => {
  if (!props.orderNo) return
  uni.setClipboardData({
    data: props.orderNo,
    success: () => uni.showToast({ title: '订单号已复制', icon: 'none' }),
    fail: () => uni.showToast({ title: '复制失败', icon: 'none' }),
  })
}

const handleViewAllProgress = (): void => {
  uni?.vibrateShort()
  if (!props.orderId) return
  uni.navigateTo({
    url: `/package-mine/construction-progress/index?orderId=${props.orderId}`,
  })
}

onMounted(() => loadConstructionProgress())
</script>

<style lang="scss" scoped>
.order-no {
  padding: 40rpx;
  margin-bottom: 24rpx;
  background: rgba($uni-color-primary, 0.05);
  border-radius: 24rpx;
  border: 2rpx solid rgba($uni-color-primary, 0.1);

  .order-no-content {
    .order-no-label {
      font-size: 24rpx;
      color: $uni-text-color-grey;

      .copy-hint {
        font-size: 22rpx;
        color: $uni-color-primary;
        margin-left: 8rpx;
      }
    }
    .order-no-value {
      display: block;
      font-size: 28rpx;
      color: $uni-text-color;
      font-weight: 600;
      word-break: break-all;
      margin-top: 8rpx;
    }
  }
}

.craftsman {
  display: flex;
  gap: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  background: #f9fafb;
  border-radius: 24rpx;
  border: 2rpx solid $uni-border-color;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 24rpx;
    background: #f0f0f0;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    min-width: 0;

    .name {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: 16rpx;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      font-size: 26rpx;
      color: $uni-text-color-grey;

      .icon-wrapper {
        width: 48rpx;
        height: 48rpx;
        background: rgba($uni-color-primary, 0.1);
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .badges {
      display: flex;
      gap: 12rpx;
      margin-top: 16rpx;

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6rpx;
        padding: 8rpx 20rpx;
        border-radius: 20rpx;
        font-size: 22rpx;
        color: #fff;

        &.verified {
          background: $uni-color-primary;
        }
        &.skill {
          background: #6c5ce7;
        }
      }
    }
  }
}

.construction-progress {
  margin-top: 32rpx;
  padding-top: 32rpx;
  border-top: 2rpx solid $uni-border-color;

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }

  .view-more-btn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: $uni-color-primary;
  }

  .progress-title {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .progress-title-text {
      font-size: 28rpx;
      font-weight: 600;
      color: $uni-text-color;
    }
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
}
</style>
