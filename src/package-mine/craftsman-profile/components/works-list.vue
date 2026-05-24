<template>
  <view class="works-list-item" v-for="item in published_works_list" :key="item.id">
    <view class="time-wrap">
      <uni-icons custom-prefix="iconfont" type="icon-a-ziyuan672" size="12" color="#999" />
      <view class="time">{{ dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm') }}</view>
    </view>
    <view class="publish_text" v-show="item?.publish_text">
      {{ item?.publish_text }}
    </view>
    <view v-if="getPublishVideos(item).length" class="videos-wrap">
      <video
        v-for="videoUrl in getPublishVideos(item)"
        :key="videoUrl"
        :src="videoUrl"
        :poster="getVideoPoster(item)"
        class="video-item"
        controls
        object-fit="contain"
        :show-center-play-btn="true"
        :enable-progress-gesture="true"
        @error="handleVideoError"
      ></video>
    </view>
    <view class="images-wrap">
      <image v-for="image in item?.publish_images" :key="image" :src="image" mode="aspectFill" class="image-item" />
    </view>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
defineProps<{
  published_works_list?: any[]
}>()

const getPublishVideos = (item: any): string[] => {
  const videos = item?.publish_video
  if (Array.isArray(videos)) return videos.filter((url) => typeof url === 'string' && !!url)
  return typeof videos === 'string' && videos ? [videos] : []
}

const getVideoPoster = (item: any): string => {
  const images = item?.publish_images
  return Array.isArray(images) && images.length > 0 ? images[0] : ''
}

const handleVideoError = (event: any): void => {
  console.error('视频播放失败:', event?.detail ?? event)
  uni.showToast({ title: '视频暂时无法播放', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.works-list-item {
  padding-bottom: 24px;
  border-bottom: 0.701px solid #e5e5e5;

  &:last-child {
    border-bottom: none;
  }

  .time-wrap {
    display: flex;
    align-items: center;
    margin-top: 24px;

    uni-icons {
      display: flex;
      align-items: center;
    }

    .time {
      margin-left: 8px;

      color: #999;
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 1.2px;
      line-height: 18px;
    }
  }

  .publish_text {
    margin-top: 12px;
    color: #222;
    font-size: 15px;
    font-weight: 300;
    line-height: 24.375px;
    letter-spacing: -0.234px;
  }

  .images-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;

    .image-item {
      width: calc(50% - 4px);
      height: 140px;
      aspect-ratio: 1;
      border-radius: 12px;
      object-fit: cover;
    }
  }

  .videos-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;

    .video-item {
      width: 100%;
      height: 210px;
      border-radius: 12px;
      overflow: hidden;
      background: #111;
    }
  }
}
</style>
