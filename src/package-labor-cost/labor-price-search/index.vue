<template>
  <view class="page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <view class="icon-search">
          <uni-icons type="search" size="18" color="#999" />
        </view>
        <input v-model="searchQuery" class="search-input" type="text" placeholder="搜索工种、工价..."
          placeholder-class="placeholder" :focus="true" @confirm="handleSearchConfirm" />
        <view v-if="searchQuery" class="icon-clear" @tap.stop="clearSearch">
          <uni-icons type="clear" size="16" color="#CCC" />
        </view>
      </view>
      <text class="search-btn" @tap="handleSearchConfirm">搜索</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 默认展示：历史记录与热门搜索 -->
      <view v-if="!hasSearched" class="default-content">
        <!-- 历史记录 -->
        <view v-if="history.length > 0" class="section">
          <view class="section-header">
            <view class="section-title-row">
              <uni-icons type="clock" size="16" color="#999" />
              <text class="section-title">历史搜索</text>
            </view>
            <view class="icon-clear" @tap="clearHistory">
              <uni-icons type="clear" size="16" color="#CCC" />
            </view>
          </view>
          <view class="tag-list">
            <view v-for="(term, i) in history" :key="`h-${i}`" class="tag history-tag" @tap="selectSearchTerm(term)">
              <text class="tag-text">{{ term }}</text>
            </view>
          </view>
        </view>

        <!-- 热门搜索 -->
        <view class="section">
          <view class="section-header">
            <view class="section-title-row hot-title">
              <uni-icons type="fire" size="16" color="#FF6B6B" />
              <text class="section-title">热门搜索</text>
            </view>
          </view>
          <view class="tag-list">
            <view v-for="(term, i) in hotSearches" :key="`hot-${i}`" class="tag hot-tag" @tap="selectSearchTerm(term)">
              <text class="tag-text">{{ term }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 搜索结果列表 -->
      <view v-else class="result-content">
        <view v-if="loading && results.length === 0" class="loading-state">
          <uni-icons type="spinner-cycle" size="32" color="#2d635e" />
          <text class="loading-text">搜索中...</text>
        </view>
        <view v-else-if="results.length > 0">
          <view class="result-summary">找到 {{ results.length }} 个相关结果</view>
          <view v-for="item in results" :key="item.id" class="result-item" @tap="goDetail(item.id)">
            <view class="result-main">
              <view class="result-top">
                <view class="trade-badge">{{ item.trade }}</view>
                <text class="result-name">{{ item.name }}</text>
              </view>
              <text class="result-note">{{ item.pricingNote }}</text>
            </view>
            <view class="result-price-wrap">
              <text class="price-main">
                <text class="price-symbol">¥</text>
                <text class="price-num">{{ item.price }}</text>
              </text>
              <text class="price-unit">{{ item.unit }}</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else-if="!loading" class="empty-state">
          <uni-icons type="search" size="48" color="#CCC" />
          <text class="empty-title">未找到相关工价标准</text>
          <text class="empty-desc">换个关键词试试吧</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { searchPriceListService } from './service'

interface SearchResultItem {
  id: number
  trade: string
  name: string
  price: string
  unit: string
  pricingNote: string
  serviceScope: string
}

const HISTORY_KEY = 'labor_price_search_history'
const MAX_HISTORY = 10
const PAGE_INDEX = 1
const PAGE_SIZE = 10

// ========== 数据 ==========
const hotSearches = [
  '墙面乳胶漆',
  '水电改造',
  '木工吊顶',
  '地砖铺贴',
  '拆除',
  '美缝',
  '全屋定制',
  '开荒保洁'
]

const searchQuery = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const history = ref<string[]>([])
const results = ref<SearchResultItem[]>([])

// ========== 工具函数 ==========
const loadHistory = (): void => {
  try {
    const raw = uni.getStorageSync(HISTORY_KEY)
    history.value = Array.isArray(raw) ? raw.slice(0, MAX_HISTORY) : []
  } catch {
    history.value = []
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
  const existsIndex = history.value.indexOf(trimmed)
  let newHistory = [...history.value]
  if (existsIndex > -1) {
    newHistory.splice(existsIndex, 1)
  }
  newHistory.unshift(trimmed)
  newHistory = newHistory.slice(0, MAX_HISTORY)
  history.value = newHistory
  saveHistory(newHistory)
}

// ========== 搜索逻辑 ==========
const doSearch = async (query: string): Promise<void> => {
  const term = query.trim()
  if (!term) return

  loading.value = true
  results.value = []
  try {
    const res = await searchPriceListService({
      pageIndex: PAGE_INDEX,
      pageSize: PAGE_SIZE,
      work_title: term
    })

    if (!res.success) {
      uni.showToast({ icon: 'none', title: res.message || '搜索失败' })
      return
    }

    const list = res.data ?? []
    results.value = list.map((w: any) => ({
      id: w.id,
      trade: w.work_kind?.work_kind_name ?? w.work_kind?.title ?? '',
      name: w.work_title ?? '',
      price: String(w.work_price ?? '--'),
      unit: w.labour_cost?.labour_cost_name ?? '项',
      pricingNote: w.pricing_description ?? '',
      serviceScope: w.service_scope ?? ''
    }))
    hasSearched.value = true
  } catch {
    uni.showToast({ icon: 'none', title: '搜索失败，请重试' })
  } finally {
    loading.value = false
  }
}

// ========== 交互 ==========
const selectSearchTerm = (term: string): void => {
  searchQuery.value = term
  addToHistory(term)
  doSearch(term)
}

const handleSearchConfirm = (): void => {
  const term = searchQuery.value.trim()
  if (term) {
    addToHistory(term)
    doSearch(term)
  }
}

const clearSearch = (): void => {
  searchQuery.value = ''
  results.value = []
  hasSearched.value = false
}

const clearHistory = (): void => {
  history.value = []
  saveHistory([])
}

const goDetail = (id: number): void => {
  uni.navigateTo({
    url: `/package-labor-cost/labor-price-detail/index?id=${id}`
  })
}

// ========== 初始化 ==========
loadHistory()
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;

  .search-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 24rpx;
    padding: 24rpx 32rpx 24rpx;
    border-bottom: 2rpx solid #f0f0f0;
    background: #fff;

    .search-input-wrap {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      height: 72rpx;
      padding: 0 80rpx 0 72rpx;
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

        &::placeholder {
          color: #a0a0a0;
        }
      }
    }

    .search-btn {
      font-size: 28rpx;
      font-weight: 500;
      color: #2d635e;
    }
  }

  .content-scroll {
    flex: 1;
    overflow: hidden;
  }

  .default-content {
    padding: 40rpx 32rpx;

    .section {
      margin-bottom: 64rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24rpx;

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 12rpx;

          &.hot-title {
            uni-icons {
              color: #ff6b6b;
            }
          }

          .section-title {
            font-size: 28rpx;
            font-weight: 700;
            color: #333;
          }
        }

        .icon-clear {
          padding: 8rpx;
        }
      }

      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;

        .tag {
          padding: 24rpx 28rpx;
          border-radius: 16rpx;

          .tag-text {
            font-size: 24rpx;
            color: #666;
          }
        }

        .history-tag {
          background: #f7f8fa;
          max-width: 240rpx;

          .tag-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
          }
        }

        .hot-tag {
          background: #fff;
          border: 2rpx solid #f0f0f0;

          .tag-text {
            color: #555;
            font-size: 26rpx;
          }
        }
      }
    }
  }

  .result-content {
    padding: 0 32rpx 40rpx;

    .result-summary {
      padding: 16rpx 0;
      background: #fafafa;
      font-size: 22rpx;
      color: #999;
      text-align: center;
      margin: 24rpx 0;
      border-radius: 12rpx;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 32rpx 0;
      border-bottom: 2rpx solid #f5f5f5;

      .result-main {
        flex: 1;
        min-width: 0;
        padding-right: 24rpx;

        .result-top {
          display: flex;
          align-items: center;
          gap: 16rpx;
          margin-bottom: 12rpx;

          .trade-badge {
            flex-shrink: 0;
            padding: 4rpx 12rpx;
            font-size: 20rpx;
            color: #2d635e;
            background: rgba(45, 99, 94, 0.05);
            border-radius: 8rpx;
          }

          .result-name {
            flex: 1;
            font-size: 30rpx;
            font-weight: 500;
            color: #222;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .result-note {
          font-size: 24rpx;
          color: #888;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
      }

      .result-price-wrap {
        flex-shrink: 0;
        text-align: right;

        .price-main {
          display: block;
          color: #2d635e;
          font-weight: 700;
          font-family: ui-monospace, monospace;

          .price-symbol {
            font-size: 20rpx;
            font-weight: 400;
            margin-right: 4rpx;
          }

          .price-num {
            font-size: 32rpx;
          }
        }

        .price-unit {
          display: block;
          font-size: 20rpx;
          color: #999;
        }
      }
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 160rpx 0;
    gap: 24rpx;

    .loading-text {
      font-size: 28rpx;
      color: #999;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 160rpx 0;

    uni-icons {
      opacity: 0.5;
      margin-bottom: 32rpx;
    }

    .empty-title {
      font-size: 28rpx;
      color: #ccc;
      margin-bottom: 16rpx;
    }

    .empty-desc {
      font-size: 24rpx;
      color: #ccc;
      opacity: 0.7;
    }
  }
}
</style>