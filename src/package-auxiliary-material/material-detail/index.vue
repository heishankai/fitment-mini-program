<template>
  <scroll-view class="page" scroll-y>
    <view v-if="product" class="content">
      <view class="image-wrap">
        <image class="product-image" :src="product.image" mode="aspectFill" />
      </view>
      <view class="info">
        <view class="brand">{{ product.brand }}</view>
        <view class="name">{{ product.name }}</view>
        <view class="price">
          <text class="price-symbol">¥</text>
          <text class="price-num">{{ product.price }}</text>
          <text class="price-unit">/{{ product.unit }}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const products: Record<string, any> = {
  '101': { id: '101', category: 'water', name: 'PPR纳米抗菌水管', brand: '伟星', price: '15', unit: '米', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80' },
  '102': { id: '102', category: 'water', name: '全铜三角阀', brand: '九牧', price: '25', unit: '个', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80' },
  '201': { id: '201', category: 'electric', name: '阻燃电线 2.5平方', brand: '远东', price: '3.5', unit: '米', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80' },
  '301': { id: '301', category: 'wood', name: 'E0级生态免漆板', brand: '兔宝宝', price: '220', unit: '张', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80' },
  '501': { id: '501', category: 'paint', name: '竹炭抗甲醛面漆', brand: '立邦', price: '380', unit: '桶', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80' },
}

const product = ref<any>(null)

onLoad((options: any) => {
  const id = options?.id || ''
  product.value = products[id] || null
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
}

.content {
  padding: 48rpx;
}

.image-wrap {
  aspect-ratio: 1;
  background: #f5f7f6;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 48rpx;
}

.product-image {
  width: 100%;
  height: 100%;
}

.info {
  padding: 0 16rpx;
}

.brand {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 16rpx;
}

.name {
  font-size: 40rpx;
  font-weight: 700;
  color: #222;
  margin-bottom: 24rpx;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.price-symbol {
  font-size: 28rpx;
  font-weight: 700;
  color: #2d635e;
}

.price-num {
  font-size: 48rpx;
  font-weight: 700;
  color: #2d635e;
}

.price-unit {
  font-size: 28rpx;
  color: #999;
}
</style>
