<template>
  <view class="page">
    <!-- 1. Header with Search Bar -->
    <view class="search-header">
      <view class="header-inner">
        <view class="search-input-wrap">
          <view class="icon-search">
            <uni-icons type="search" size="18" color="#999" />
          </view>
          <input v-model="query" class="search-input" :focus="true" type="text" placeholder="搜索材料名称、品牌..."
            placeholder-class="placeholder" />
          <view v-if="query" class="icon-clear" @tap.stop="clearQuery">
            <uni-icons type="clear" size="16" color="#CCC" />
          </view>
        </view>
        <view class="search-btn" @tap="handleSearch">搜索</view>
      </view>
    </view>

    <!-- 2. Content -->
    <scroll-view class="content-scroll" scroll-y>
      <template v-if="!hasSearched">
        <!-- History -->
        <view v-if="searchHistory.length > 0" class="section">
          <view class="section-header">
            <text class="section-title">历史搜索</text>
            <view class="clear-btn" @tap="clearHistory">清空</view>
          </view>
          <view class="tag-list">
            <view v-for="(item, i) in searchHistory" :key="`h-${i}`" class="tag history-tag"
              @tap="handleSearchTerm(item)">
              <text class="tag-text">{{ item }}</text>
            </view>
          </view>
        </view>

        <!-- Popular -->
        <view class="section">
          <view class="section-header popular-header">
            <view class="popular-indicator" />
            <text class="section-title">大家都在搜</text>
          </view>
          <view class="tag-list">
            <view v-for="(item, i) in popularSearches" :key="`p-${i}`" class="tag"
              :class="i < 3 ? 'popular-tag-highlight' : 'popular-tag'" @tap="handleSearchTerm(item)">
              <text class="tag-text">{{ item }}</text>
            </view>
          </view>
        </view>
      </template>

      <!-- Results List -->
      <template v-else>
        <view v-if="loading && results.length === 0" class="loading-state">
          <uni-icons type="spinner-cycle" size="32" color="#2d635e" />
          <text class="loading-text">搜索中...</text>
        </view>
        <template v-else>
          <view class="result-summary">找到 {{ results.length }} 个相关结果</view>
          <view class="result-list">
            <view v-for="item in results" :key="item.id" class="result-item" @tap="goDetail(item.id)">
              <view class="result-image-wrap">
                <image class="result-image" :src="item.image" mode="aspectFill" />
              </view>
              <view class="result-info">
                <view class="result-name">{{ item.name }}</view>
                <view class="result-brand-wrap">
                  <text class="result-brand">{{ item.brand }}</text>
                </view>
                <view class="result-price-wrap">
                  <text class="price-symbol">¥</text>
                  <text class="price-num">{{ item.price }}</text>
                  <text class="price-unit">/{{ item.unit }}</text>
                </view>
              </view>
              <uni-icons type="right" size="16" color="#DDD" />
            </view>
          </view>

          <!-- No Results -->
          <view v-if="!loading && results.length === 0" class="empty-state">
            <uni-icons type="search" size="48" color="#CCC" />
            <text class="empty-title">未找到相关材料</text>
          </view>
        </template>
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { searchMaterialService } from './service'
import type { MaterialSearchItem } from './service'

const HISTORY_KEY = 'material_search_history'
const statusBarHeight = ref(0)
const MAX_HISTORY = 10

const searchHistory = ref<string[]>([])
const popularSearches = [
  'PPR水管',
  '强电线',
  '防水涂料',
  'E0级板材',
  '潜水艇地漏',
]

const query = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const results = ref<MaterialSearchItem[]>([])

const DEFAULT_HISTORY = ['伟星水管', '立邦漆', '德高瓷砖胶']

const loadHistory = (): void => {
  try {
    const raw = uni.getStorageSync(HISTORY_KEY)
    if (raw === '' || raw === undefined || raw === null) {
      searchHistory.value = DEFAULT_HISTORY
      return
    }
    const stored = Array.isArray(raw) ? raw.slice(0, MAX_HISTORY) : []
    searchHistory.value = stored
  } catch {
    searchHistory.value = DEFAULT_HISTORY
  }
}

const saveHistory = (list: string[]): void => {
  try {
    uni.setStorageSync(HISTORY_KEY, list)
  } catch {
    console.warn('Failed to save search history')
  }
}

const addToHistory = (term: string): void => {
  const trimmed = term.trim()
  if (!trimmed) return
  const existsIndex = searchHistory.value.indexOf(trimmed)
  let newHistory = [...searchHistory.value]
  if (existsIndex > -1) {
    newHistory.splice(existsIndex, 1)
  }
  newHistory.unshift(trimmed)
  newHistory = newHistory.slice(0, MAX_HISTORY)
  searchHistory.value = newHistory
  saveHistory(newHistory)
}

const mapApiItem = (item: any): MaterialSearchItem => ({
  id: item.id ?? item.commodity_id,
  name: item.commodity_name ?? item.name ?? '',
  brand: item.brand_name ?? item.brand ?? '',
  price: String(item.commodity_price ?? item.price ?? '--'),
  unit: item.commodity_unit ?? item.unit ?? '件',
  image: item.commodity_cover ?? item.image ?? '',
})

const doSearch = async (q: string): Promise<void> => {
  const term = q.trim()
  if (!term) return

  loading.value = true
  results.value = []

  try {
    const res = await searchMaterialService({
      pageIndex: 1,
      pageSize: 10,
      commodity_name: term,
    })

    if (res?.success && res?.data) {
      const list = Array.isArray(res.data) ? res.data : res.data?.list ?? res.data?.records ?? []
      results.value = list.map(mapApiItem)
    } else {
      results.value = []
      uni.showToast({ icon: 'none', title: res?.message || '搜索失败' })
    }
  } catch {
    results.value = []
    uni.showToast({ icon: 'none', title: '搜索失败，请重试' })
  } finally {
    loading.value = false
  }
}

const handleSearchTerm = (term: string): void => {
  query.value = term
}

const handleSearch = (): void => {
  const term = query.value.trim()
  if (term) {
    addToHistory(term)
    hasSearched.value = true
    doSearch(term)
  }
}

const clearQuery = (): void => {
  query.value = ''
  results.value = []
  hasSearched.value = false
}

const clearHistory = (): void => {
  searchHistory.value = []
  saveHistory([])
}

const goDetail = (id: string | number): void => {
  uni.navigateTo({ url: `/package-auxiliary-material/product-detail/index?id=${id}` })
}

watch(query, (val) => {
  if (!val.trim()) {
    results.value = []
    hasSearched.value = false
  }
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = (systemInfo.statusBarHeight ?? 0) as number
})

loadHistory()
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.search-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-bottom: 2rpx solid #f0f0f0;

  .header-inner {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 24rpx;
    padding: 24rpx 32rpx;
  }

  .search-input-wrap {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 0 64rpx 0 80rpx;
    background: #f5f7f6;
    border-radius: 999rpx;

    .icon-search {
      position: absolute;
      left: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .icon-clear {
      position: absolute;
      right: 24rpx;
      padding: 8rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
      height: 100%;
    }
  }

  .search-btn {
    font-size: 28rpx;
    font-weight: 500;
    color: #2d635e;
  }
}

.placeholder {
  color: #999;
}

.content-scroll {
  flex: 1;
  min-height: 0;
  height: 0;
}

.section {
  padding: 48rpx 48rpx 0;
  margin-bottom: 64rpx;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;

  &.popular-header {
    justify-content: flex-start;
    gap: 16rpx;
  }
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #222;
}

.clear-btn {
  font-size: 22rpx;
  color: #999;
}

.popular-indicator {
  width: 8rpx;
  height: 28rpx;
  background: #2d635e;
  border-radius: 4rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.tag {
  padding: 12rpx 28rpx;
  border-radius: 8rpx;

  .tag-text {
    font-size: 24rpx;
    color: #555;
  }
}

.history-tag {
  background: #f9fafb;
  border: 2rpx solid #f0f0f0;
}

.popular-tag {
  background: #f9fafb;
  border: 2rpx solid #f0f0f0;

  .tag-text {
    color: #555;
  }
}

.popular-tag-highlight {
  background: #fff;
  border: 2rpx solid rgba(45, 99, 94, 0.2);

  .tag-text {
    color: #2d635e;
    font-weight: 500;
  }
}

.result-summary {
  padding: 24rpx 48rpx;
  font-size: 22rpx;
  color: #999;
  background: #fafafa;
  border-bottom: 2rpx solid #f0f0f0;
}

.result-list {
  padding: 16rpx 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 32rpx;
  margin: 0 32rpx;
  border-bottom: 2rpx solid #f5f7f6;
  border-radius: 16rpx;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #fafafa;
  }
}

.result-image-wrap {
  width: 144rpx;
  height: 144rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  background: #f5f7f6;
  overflow: hidden;
}

.result-image {
  width: 100%;
  height: 100%;
}

.result-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.result-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #222;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-brand-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.result-brand {
  padding: 4rpx 12rpx;
  font-size: 22rpx;
  color: #666;
  background: #f5f7f6;
  border-radius: 8rpx;
}

.result-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  margin-top: 8rpx;
}

.price-symbol {
  font-size: 20rpx;
  font-weight: 700;
  color: #2d635e;
}

.price-num {
  font-size: 32rpx;
  font-weight: 700;
  color: #2d635e;
  font-family: ui-monospace, 'DIN Alternate', monospace;
}

.price-unit {
  font-size: 20rpx;
  color: #999;
  margin-left: 4rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 320rpx 0;
  gap: 24rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 320rpx 0;
  gap: 24rpx;
}

.empty-state uni-icons {
  opacity: 0.5;
}

.empty-title {
  font-size: 26rpx;
  color: #999;
}
</style>
