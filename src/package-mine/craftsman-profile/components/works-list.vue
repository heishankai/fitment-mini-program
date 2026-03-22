<template>
  <view class="works-list-item" v-for="item in published_works_list" :key="item.id">
    <view class="time-wrap">
      <uni-icons custom-prefix="iconfont" type="icon-a-ziyuan672" size="12" color="#999" />
      <view class="time">{{ dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm') }}</view>
    </view>
    <view class="publish_text" v-show="item?.publish_text">
      {{ item?.publish_text }}
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
}
</style>
