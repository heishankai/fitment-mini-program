<template>
  <view class="page">
    <LabourCostHeader />

    <view class="panel">
      <!-- 左侧分类导航 -->
      <view class="nav-container">
        <scroll-view class="nav-scroll" scroll-y enhanced :show-scrollbar="false" :style="mainScrollStyle">
          <view v-for="cat in categories" :key="cat.id" class="nav-item"
            :class="{ active: selectedWorkKindId === cat.id }" @tap="selectWorkKind(cat.id)">
            <view class="nav-indicator" v-if="selectedWorkKindId === cat.id" />
            <view class="nav-icon-wrap" :class="{ active: selectedWorkKindId === cat.id }">
              <uni-icons v-if="cat.iconPrefix" :custom-prefix="cat.iconPrefix" :type="cat.iconType" size="22"
                :color="selectedWorkKindId === cat.id ? '#fff' : '#9ca3af'" />
              <uni-icons v-else :type="cat.iconType" size="22"
                :color="selectedWorkKindId === cat.id ? '#fff' : '#9ca3af'" />
            </view>
            <text class="nav-text" :class="{ active: selectedWorkKindId === cat.id }">
              {{ cat.name }}
            </text>
          </view>
          <view class="nav-bottom-spacer" />
        </scroll-view>
      </view>

      <!-- 右侧内容 -->
      <view class="content-wrap">
        <scroll-view class="content-scroll" scroll-y enhanced :show-scrollbar="false" :style="mainScrollStyle"
          @scrolltolower="onScrollToLower">
          <view class="section-header">
            <view class="section-title-wrap">
              <text class="section-title">
                {{ selectedWorkKindName }}
              </text>
              <text class="section-subtitle">
                参考单价
              </text>
            </view>
          </view>

          <view class="price-list">
            <view v-if="loading && priceList.length === 0" class="empty-tip">
              <uni-icons type="spinner-cycle" size="24" color="#2d635e" />
              <text class="empty-text">加载中...</text>
            </view>
            <view v-else-if="priceList.length === 0" class="empty-tip">
              <text class="empty-text">
                该分类暂无工价数据
              </text>
            </view>

            <LabourPriceCard v-for="item in priceList" :key="item.id" :item="item" />

            <!-- 加载更多 -->
            <view v-if="loading && priceList.length > 0" class="load-more">
              <uni-icons type="spinner-cycle" size="20" color="#9ca3af" />
              <text>加载中...</text>
            </view>
            <view v-else-if="finish && priceList.length > 0" class="no-more">
              <text>没有更多了</text>
            </view>
          </view>

          <view class="bottom-spacer" />
        </scroll-view>
      </view>
    </view>

    <CustomTabBar selected="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomTabBar from '@/components/custom-tab-bar.vue'
import LabourCostHeader from './components/labour-cost-header.vue'
import LabourPriceCard from './components/labour-price-card.vue'
import { getWorkKindListService, getPriceListService } from './service'
import { ICON_MAP } from './utils'

const workKindList = ref<{ id: number; work_kind_name: string }[]>([])
const selectedWorkKindId = ref<number | null>(null)
const priceList = ref<any[]>([])
const loading = ref(false)
const finish = ref(false)
const pageIndex = ref(1)
const pageSize = 10
const mainScrollStyle = ref({ height: '400px' })

const selectedWorkKindName = computed(() =>
  workKindList.value.find(k => k.id === selectedWorkKindId.value)?.work_kind_name ?? ''
)

// 带图标的分类（用于左侧导航）
const categories = computed(() => {
  const def = { iconType: 'person', iconPrefix: '' }
  return workKindList.value.map(k => {
    const icon = ICON_MAP[k.work_kind_name] ?? def
    return { id: k.id, name: k.work_kind_name, ...icon }
  })
})

const loadWorkKindList = async (): Promise<void> => {
  const { data, success } = await getWorkKindListService()
  if (success && data?.length) {
    // 工长排第一
    workKindList.value = [...data].sort((a, b) =>
      a.work_kind_name === '工长' ? -1 : b.work_kind_name === '工长' ? 1 : 0
    )
    selectedWorkKindId.value = workKindList.value[0].id
    loadPriceList()
  }
}

const loadPriceList = async (isLoadMore = false): Promise<void> => {
  const workKindId = selectedWorkKindId.value
  if (loading.value || workKindId == null) return
  if (isLoadMore && finish.value) return

  if (!isLoadMore) {
    pageIndex.value = 1
    priceList.value = []
    finish.value = false
  }

  loading.value = true
  try {
    const res = await getPriceListService({
      pageIndex: pageIndex.value,
      pageSize,
      work_kind_id: workKindId,
    })

    if (!res.success) return

    const list = res.data ?? []
    const items = list.map((w: any) => ({
      id: w.id,
      name: w.work_title ?? '',
      price: w.work_price ?? '--',
      unit: w.labour_cost?.labour_cost_name ?? '项',
      pricingNote: w.pricing_description ?? '',
      serviceScope: w.service_scope ?? '',
    }))

    if (isLoadMore) {
      priceList.value = priceList.value.concat(items)
    } else {
      priceList.value = items
    }

    // 使用 pageTotal 判断是否还有更多（接口返回：pageIndex、pageSize、total、pageTotal）
    finish.value = (res.pageIndex ?? pageIndex.value) >= (res.pageTotal ?? 1)
    if (list.length) pageIndex.value++
  } catch {
    uni.showToast({ icon: 'none', title: '加载失败' })
  } finally {
    loading.value = false
  }
}

const onScrollToLower = (): void => {
  loadPriceList(true)
}

const selectWorkKind = (id: number): void => {
  selectedWorkKindId.value = id
  loadPriceList()
}

const updateScrollHeight = (): void => {
  const sys = uni.getSystemInfoSync()
  const rpx2px = sys.windowWidth / 750
  const reserved = 320 * rpx2px + 260 * rpx2px
  mainScrollStyle.value = { height: `${Math.max(200, Math.floor(sys.windowHeight - reserved))}px` }
}

onLoad(() => {
  updateScrollHeight()
  loadWorkKindList()
})
onReady(updateScrollHeight)
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  background: #f2f4f7;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 260rpx;
  background: #f2f4f7;
}

.panel {
  flex: 1;
  min-height: 0;
  margin-top: -120rpx;
  background: #f2f4f7;
  border-radius: 48rpx 48rpx 0 0;
  overflow: hidden;
  display: flex;
  position: relative;
  box-shadow: 0 -20rpx 80rpx rgba(0, 0, 0, 0.1);
}

/* 参考: w-[84px] bg-[#F9FAFB] border-r border-[#EFEFEF] */
.nav-container {
  position: relative;
  width: 168rpx;
  flex-shrink: 0;
  background: #f9fafb;
  border-right: 2rpx solid #efefef;
  border-radius: 48rpx 0 0 24rpx;


  .nav-scroll {
    width: 100%;
    height: 100%;
    padding-top: 16rpx;
  }

  .nav-bottom-spacer {
    height: 200rpx;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32rpx 8rpx;
    position: relative;
    transition: transform 0.2s;

    .nav-indicator {
      position: absolute;
      left: 0;
      /* 与图标中心对齐：padding-top 32rpx + icon-wrap 一半 44rpx */
      top: 76rpx;
      transform: translateY(-50%);
      width: 6rpx;
      height: 40rpx;
      background: #2d635e;
      border-radius: 0 8rpx 8rpx 0;
      pointer-events: none;
    }

    &:active {
      transform: scale(0.98);
    }

    /* 参考: w-11 h-11 rounded-2xl, active: bg-[#2D635E] shadow-lg shadow-[#2D635E]/30 */
    .nav-icon-wrap {
      width: 88rpx;
      /* 44px */
      height: 88rpx;
      border-radius: 32rpx;
      /* rounded-2xl */
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      background: #fff;
      border: 2rpx solid #f3f4f6;
      transition: all 0.3s ease;

      &.active {
        background: #2d635e;
        border-color: transparent;
        box-shadow: 0 16rpx 48rpx rgba(45, 99, 94, 0.3);
        /* shadow-lg shadow-[#2D635E]/30 */
      }
    }

    .nav-text {
      font-size: 22rpx;
      font-weight: 500;
      color: #9ca3af;
      transition: color 0.2s;

      &.active {
        color: #2d635e;
      }
    }
  }
}

/* 参考: bg-white rounded-tr-3xl pb-20 */
.content-wrap {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 0 48rpx 24rpx 0;
  /* rounded-tr-3xl，底部微圆角 */

  .content-scroll {
    width: 100%;
    height: 100%;
    padding: 32rpx;
    /* 底部留白，不遮挡 tabbar */
    box-sizing: border-box;

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32rpx;
      padding: 16rpx 0;

      .section-title-wrap {
        display: flex;
        align-items: baseline;
        gap: 16rpx;

        .section-title {
          font-size: 34rpx;
          font-weight: 700;
          color: #111827;
        }

        .section-subtitle {
          font-size: 24rpx;
          color: #9ca3af;
        }
      }
    }

    .price-list {
      display: flex;
      flex-direction: column;
      gap: 32rpx;

      .empty-tip {
        padding: 80rpx 0;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16rpx;

        .empty-text {
          font-size: 28rpx;
          color: #9ca3af;
        }
      }

      .load-more,
      .no-more {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12rpx;
        padding: 32rpx;
        font-size: 24rpx;
        color: #9ca3af;
      }
    }

    .bottom-spacer {
      height: 160rpx;
    }
  }
}
</style>
