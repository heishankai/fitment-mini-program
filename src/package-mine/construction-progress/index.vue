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
      <view v-if="progressList?.length" class="progress-container">
        <view class="progress-list">
          <timeline
            v-for="(item, index) in progressList"
            :key="index"
            :completed="isCompleted(item)"
            :is-last="index === progressList.length - 1"
          >
            <view class="content-card">
              <view class="date-time-row">
                <uni-icons type="calendar" size="16" color="#666" />
                <text class="date-time-text">
                  {{ formatDateTimeRange(item.start_time, item.end_time) }}
                </text>
              </view>

              <view v-if="item.location" class="location-row">
                <uni-icons type="location" size="16" color="#666" />
                <text class="location-text">{{ item.location }}</text>
              </view>

              <view v-if="item.description" class="description">
                {{ item.description }}
              </view>

              <view v-if="item?.photos?.length" class="photos-grid">
                <view
                  v-for="(photo, photoIndex) in item.photos"
                  :key="photoIndex"
                  class="photo-item"
                  @tap="previewImage(photo, item?.photos)"
                >
                  <image :src="photo" mode="aspectFill" class="photo-image" />
                </view>
              </view>
            </view>
          </timeline>
        </view>
      </view>

      <empty-state v-else text="暂无施工进度记录" />
    </scroll-view>

    <view v-if="progressList?.length" class="bottom-bar">
      <view class="bottom-content">
        <text class="bottom-text">共记录 {{ progressList.length }} 次施工进度</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import EmptyState from '@/components/empty-state.vue'
import Timeline from '@/components/timeline.vue'
import {
  getConstructionProgress,
  getConstructionProgressByOrderId,
} from './service'
import { previewImage, formatDateTimeRange } from '@/utils'

const params = ref<any>({ workPriceItemId: '', craftsmanId: '', orderId: '' })
const progressList = ref<any[]>([])
const isTriggered = ref(false)

const isCompleted = (item: any): boolean => !!(item.end_time || (item.photos && item.photos.length > 0))

const loadProgress = async (opts: any): Promise<void> => {
  if (opts?.orderId) {
    try {
      const res = await getConstructionProgressByOrderId(opts.orderId)
      const data = res?.data ?? res
      const list = Array.isArray(data) ? data : data?.list ?? []
      progressList.value = list
    } catch {
      progressList.value = []
    }
    return
  }

  const { workPriceItemId, craftsmanId } = opts ?? {}
  if (!workPriceItemId || !craftsmanId) {
    progressList.value = []
    return
  }

  try {
    const res = await getConstructionProgress(workPriceItemId, craftsmanId)
    const data = res?.data ?? res
    const list = Array.isArray(data) ? data : data?.list ?? []
    progressList.value = list
  } catch {
    progressList.value = []
  }
}

const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadProgress(params.value)
  isTriggered.value = false
}

onLoad((options) => {
  params.value = options ?? {}
  loadProgress(params.value)
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

.progress-container {
  padding: 32rpx;
}

.progress-list {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.content-card {
  flex: 1;
  background: #f9fafb;
  border-radius: 24rpx;
  padding: 32rpx;
  min-width: 0;
}

.date-time-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: $uni-text-color-grey;
}

.date-time-text {
  font-size: 28rpx;
  color: $uni-text-color-grey;
  flex: 1;
  word-break: break-all;
  line-height: 1.5;
}

.location-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: $uni-text-color-grey;
}

.location-text {
  font-size: 28rpx;
  color: $uni-text-color-grey;
  flex: 1;
  line-height: 1.5;
}

.description {
  margin-bottom: 24rpx;
  font-size: 30rpx;
  color: $uni-text-color;
  font-weight: 500;
  line-height: 1.5;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.photo-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16rpx;
  overflow: hidden;

  .photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.bottom-bar {
  flex-shrink: 0;
  background: $uni-bg-color;
  border-top: 2rpx solid $uni-border-color;
  padding: 32rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);

  .bottom-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32rpx;
  }

  .bottom-text {
    font-size: 28rpx;
    color: $uni-text-color-grey;
    text-align: center;
  }
}
</style>
