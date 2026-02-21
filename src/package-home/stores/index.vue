<template>
  <view class="stores-page">
    <scroll-view class="store-list" scroll-y>
      <view v-for="(store, index) in stores" :key="index" class="store-item">
        <view class="store-row">
          <!-- Left Info -->
          <view class="store-info">
            <view class="store-city-en">{{ store.city }}</view>
            <view class="store-city-zh">{{ store.cityZh }}</view>
            <view class="store-count">{{ store.count }}</view>
          </view>

          <!-- Image -->
          <view class="store-image-wrap">
            <image class="store-image" :src="store.image" mode="aspectFill" />
            <view class="store-address-overlay">
              <view class="icon-map-pin-sm" />
              <text class="store-address">{{ store.address }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const stores = [
  {
    city: 'HANGZHOU',
    cityZh: '杭州市',
    count: '01',
    address: '西湖区文三路478号华星时代广场',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
  },
  {
    city: 'JIAXING',
    cityZh: '嘉兴市',
    count: '02',
    address: '南湖区中环东路1288号万达广场',
    image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
  },
  // {
  //   city: 'SHANGHAI',
  //   cityZh: '上海市',
  //   count: '03',
  //   address: '徐汇区漕溪北路88号圣爱大厦',
  //   image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
  // },
  // {
  //   city: 'CHENGDU',
  //   cityZh: '成都市',
  //   count: 38,
  //   address: '武侯区锦绣路88号优品道广场',
  //   image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  // },
  // {
  //   city: 'GUANGZHOU',
  //   cityZh: '广州市',
  //   count: 26,
  //   address: '天河区天河路228号正佳广场',
  //   image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
  // },
]
</script>

<style lang="scss" scoped>
.stores-page {
  min-height: 100vh;
  background: $uni-bg-color;
  display: flex;
  flex-direction: column;
}

.store-list {
  height: 100vh;
  padding-bottom: 40rpx;
}

.store-item {
  padding: 48rpx;
  border-bottom: 2rpx solid $uni-border-color;
  &:last-child {
    border-bottom: none;
  }
}

.store-row {
  display: flex;
  align-items: flex-start;
  gap: 32rpx;
}

.store-info {
  flex-shrink: 0;
  width: 192rpx;
}

.store-city-en {
  font-size: 24rpx;
  letter-spacing: 0.1em;
  color: rgba(68, 74, 74, 0.6);
  font-weight: 500;
  margin-bottom: 8rpx;
}

.store-city-zh {
  font-size: 28rpx;
  color: $uni-text-color;
  margin-bottom: 48rpx;
}

.store-count {
  font-size: 60rpx;
  font-weight: 300;
  color: $uni-text-color;
}

.store-image-wrap {
  flex: 1;
  position: relative;
  background: #f5f5f5;
  border-radius: 32rpx;
  overflow: hidden;
}

.store-image {
  width: 100%;
  height: 384rpx;
  display: block;
}

.store-address-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 24rpx;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.5) 70%,
    transparent 100%
  );
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.icon-map-pin-sm {
  flex-shrink: 0;
  width: 28rpx;
  height: 28rpx;
  margin-top: 4rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.9)' stroke-width='2'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.store-address {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  letter-spacing: 0.4rpx;
}
</style>
