<template>
  <view class="page">
    <auxiliary-material-header />

    <view class="scroll-wrap">
      <scroll-view class="scroll-content" scroll-y :show-scrollbar="false" lower-threshold="100"
        @scrolltolower="onScrolltolower">
        <auxiliary-material-brand-section :brands="brands" />

        <!-- 3. Category Tabs -->
        <scroll-view class="tabs-scroll" scroll-x :show-scrollbar="false">
          <view class="tabs-wrap">
            <view v-for="cat in categories" :key="cat.id ?? 'all'" class="tab-item"
              :class="{ active: activeTab === (cat.id ?? null) }" @tap="activeTab = cat.id ?? null">
              <text class="tab-text">{{ cat.category_name }}</text>
              <view v-if="activeTab === (cat.id ?? null)" class="tab-indicator" />
            </view>
          </view>
        </scroll-view>

        <!-- 4. Product Grid -->
        <view class="product-section">
          <view v-if="products.length > 0" class="product-grid">
            <view v-for="product in products" :key="product.id" class="product-card" @tap="goDetail(product.id)">
              <view class="product-image-wrap">
                <image class="product-image" :src="product.commodity_cover[0]" mode="aspectFill" />
                <view v-if="product.commodity_name" class="product-tag">
                  {{ product.commodity_name }}
                </view>
              </view>
              <view class="product-info">
                <view class="product-name">{{ product.commodity_name }}</view>
                <view class="product-price-wrap">
                  <text class="price-symbol">¥</text>
                  <text class="price-value">{{ product.commodity_price }}</text>
                  <text v-if="product.commodity_unit" class="price-unit">/{{ product.commodity_unit }}</text>
                </view>
              </view>
            </view>
          </view>

          <view v-else-if="!loading" class="empty-tip">
            <text class="empty-text">暂无相关材料</text>
          </view>

          <view v-if="loading" class="loading-tip">
            <text class="loading-text">加载中...</text>
          </view>

          <view v-if="finish && products.length > 0" class="no-more-tip">
            <text class="no-more-text">没有更多了</text>
          </view>
        </view>

        <view class="bottom-spacer" />
      </scroll-view>
    </view>

    <custom-tab-bar selected="2" />
  </view>
</template>

<script setup lang="ts">
import CustomTabBar from '@/components/custom-tab-bar.vue'
import AuxiliaryMaterialHeader from './components/auxiliary-material-header.vue'
import AuxiliaryMaterialBrandSection from './components/auxiliary-material-brand-section.vue'
import { ref, watch } from 'vue'
import { getCategoryListService, getCommodityListService } from './service'

const brands = [
  { id: 1, name: '保利管道', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653437127_56b4k4_%C3%A4%C2%BF%C2%9D%C3%A5%C2%88%C2%A9%C3%A7%C2%AE%C2%A1%C3%A9%C2%81%C2%93.png' },
  { id: 2, name: '公牛', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653479340_0ofeul_%C3%A5%C2%85%C2%AC%C3%A7%C2%89%C2%9B.gif' },
  { id: 3, name: '千年舟', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653506345_1ombue_%C3%A5%C2%8D%C2%83%C3%A5%C2%B9%C2%B4%C3%A8%C2%88%C2%9F.webp' },
  { id: 4, name: '中材管道', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653543028_gxz3pl_%C3%A4%C2%B8%C2%AD%C3%A8%C2%B4%C2%A22.webp' },
  { id: 5, name: '南方水泥', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653582274_hixvvk_%C3%A5%C2%8D%C2%97%C3%A6%C2%96%C2%B9%C3%A6%C2%B0%C2%B4%C3%A6%C2%B3%C2%A5.png' },
  { id: 6, name: '森鹿', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653608425_w3sm8e_%C3%A6%C2%A3%C2%AE%C3%A9%C2%B9%C2%BF.jpg' },
  { id: 7, name: '东方雨虹', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653648034_jw6bo5_%C3%A9%C2%9B%C2%A8%C3%A8%C2%99%C2%B9.jpg' },
  { id: 8, name: '莫干山板材', logo: 'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653784682_28urv9_%C3%A8%C2%8E%C2%AB%C3%A5%C2%B9%C2%B2%C3%A5%C2%B1%C2%B1%C3%A6%C2%9D%C2%BF%C3%A6%C2%9D%C2%90.jpg' },
]

const categories = ref<any[]>([])
const products = ref<any[]>([])
const activeTab = ref<number | null>(null)
const loading = ref(false)
const finish = ref(false)
const pageIndex = ref(1)
const pageSize = 10

const goDetail = (id: number): void => {
  uni.navigateTo({ url: `/package-auxiliary-material/product-detail/index?id=${id}` })
}

// 获取辅材品类列表（参考 fitment-wechat）
const loadCategoryList = async (): Promise<void> => {
  const { success, data } = await getCategoryListService()
  if (success) {
    const list = data || []
    categories.value = [{ id: null, category_name: '全部' }, ...list]
  }
}

// 获取辅材商品列表（参考 fitment-wechat）
const loadProductList = async (isLoadMore = false): Promise<void> => {
  if (loading.value) return
  if (isLoadMore && finish.value) return

  if (!isLoadMore) {
    pageIndex.value = 1
    products.value = []
    finish.value = false
  }

  loading.value = true
  try {
    const res = await getCommodityListService({
      pageIndex: pageIndex.value,
      pageSize,
      category_id: activeTab.value,
    })

    if (!res.success) {
      finish.value = true
      return
    }

    const list = Array.isArray(res.data) ? res.data : []
    if (isLoadMore) {
      products.value = products.value.concat(list)
    } else {
      products.value = list
    }

    finish.value = (res.pageIndex ?? pageIndex.value) >= (res.pageTotal ?? 1)
    if (list.length) pageIndex.value++
  } catch {
    uni.showToast({ icon: 'none', title: '加载失败' })
  } finally {
    loading.value = false
  }
}

const onScrolltolower = (): void => {
  loadProductList(true)
}

// 切换分类时重新加载商品
watch(activeTab, () => {
  loadProductList()
})

onLoad(() => {
  loadCategoryList()
  loadProductList()
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.scroll-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.scroll-content {
  height: 100%;
  padding-top: 400rpx;
  box-sizing: border-box;
}

/* 3. Category Tabs */
.tabs-scroll {
  white-space: nowrap;
  border-bottom: 2rpx solid #f0f0f0;
  background: #fff;
  flex-shrink: 0;
}

.tabs-wrap {
  display: inline-flex;
  gap: 64rpx;
  padding: 16rpx 48rpx 48rpx;
  flex-shrink: 0;
}

.tab-item {
  position: relative;
  padding-bottom: 24rpx;
  flex-shrink: 0;
}

.tab-text {
  font-size: 28rpx;
  color: #888;
  transition: color 0.2s;
}

.tab-item.active .tab-text {
  color: #2d635e;
  font-weight: 700;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: #2d635e;
  border-radius: 4rpx 4rpx 0 0;
}

/* 商品区 */
.product-section {
  padding: 32rpx;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
}

.product-card {
  width: calc(50% - 16rpx);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 🔥 核心修复：padding 比例方案 */
.product-image-wrap {
  position: relative;
  width: 100%;
  padding-top: 125%; // 4:5 比例
  background: #f9fafb;
  border-radius: 24rpx;
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.product-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: rgba(255, 255, 255, 0.9);
  padding: 8rpx 24rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.product-name {
  font-size: 28rpx;
  color: #1e2222;
}

.product-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  color: #2d635e;
}

.price-symbol {
  font-size: 22rpx;
}

.price-value {
  font-size: 34rpx;
  font-weight: 700;
}

.price-unit {
  font-size: 22rpx;
  color: #999;
}

.empty-tip,
.loading-tip,
.no-more-tip {
  padding: 80rpx 0;
  text-align: center;
}

.bottom-spacer {
  height: 200rpx;
}

.loading-text,
.no-more-text {
  font-size: 26rpx;
  color: #999;
}
</style>
