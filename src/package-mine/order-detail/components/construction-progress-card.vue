<template>
  <custom-card v-if="firstProgress" :show-bottom-margin="true">
    <view class="construction-progress">
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
        <view v-if="firstProgress?.photos?.length" class="photos-grid">
          <view v-for="(photo, photoIndex) in getProgressPhotos(firstProgress.photos)" :key="photoIndex"
            class="photo-item" @tap="handlePreviewImage(firstProgress.photos, photoIndex)">
            <image :src="photo" mode="aspectFill" class="photo-image" />
            <view v-if="photoIndex === 2 && firstProgress.photos.length > 3" class="photo-overlay">
              <text class="photo-count">+{{ firstProgress.photos.length - 3 }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CustomCard from '@/components/custom-card.vue'
import { formatDateTimeRange, previewImage } from '@/utils'
import { getConstructionProgressByOrderId } from '../service'

const props = defineProps<{
  orderId?: number | string
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

const handleViewAllProgress = (): void => {
  uni?.vibrateShort()
  if (!props.orderId) return
  uni.navigateTo({
    url: `/package-mine/construction-progress/index?orderId=${props.orderId}`,
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

onMounted(() => loadConstructionProgress())
</script>

<style lang="scss" scoped>
.construction-progress {
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

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
    margin-top: 16rpx;
  }

  .photo-item {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12rpx;
    overflow: hidden;

    .photo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;

      .photo-count {
        font-size: 32rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}
</style>
