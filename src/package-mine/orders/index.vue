<template>
  <view class="container">
    <!-- Tabs -->
    <view class="tabs-container">
      <view
        v-for="(tab, index) in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: currentIndex === index }"
        @click="switchTab(index)"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- Swiper -->
    <swiper
      class="swiper-container"
      :current="currentIndex"
      @change="onSwiperChange"
      :duration="300"
    >
      <swiper-item v-for="(tab, index) in tabs" :key="tab.key" class="swiper-item">
        <scroll-view
          class="scroll-view"
          scroll-y
          refresher-enabled
          :refresher-triggered="refresherTriggered[index]"
          @refresherrefresh="() => refresh(index)"
        >
          <!-- Order List -->
          <view
            v-for="order in orderMap[tab.status]"
            :key="order.id"
            class="order-card"
            @click="goDetail(order.id)"
          >
            <!-- Tags -->
            <view class="order-tags">
              <view class="house-type-tag" :class="getHouseTypeInfo(order.houseType).class">
                {{ getHouseTypeInfo(order.houseType).text }}
              </view>
              <view class="status-tag" :class="statusClassMap[order.order_status]">
                {{ order.order_status_name }}
              </view>
            </view>

            <!-- Title -->
            <view class="order-title">
              {{ order.work_kind_name || '订单' }}
            </view>

            <!-- Details -->
            <view class="order-details">
              <view class="detail-item">
                <uni-icons type="calendar" size="14" color="#999" />
                <text class="detail-text">
                  {{ formatDate(order.createdAt) }}
                </text>
              </view>
              <view class="detail-item">
                <uni-icons type="home" size="14" color="#999" />
                <text class="detail-text">
                  {{ formatLocation(order) }}
                </text>
              </view>
            </view>

            <view class="arrow-icon">
              <uni-icons type="arrow-right" size="16" color="#ccc" />
            </view>
          </view>

          <!-- Empty -->
          <empty-state v-if="!orderMap[tab.status]?.length" />
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import EmptyState from '@/components/empty-state.vue'
import { getOrderListService } from './service'

/* ================= Tabs ================= */
const tabs = [
  { key: 'construction', name: '施工中', status: 2 },
  { key: 'pending', name: '待开工', status: 1 },
  { key: 'cancelled', name: '已取消', status: 4 },
  { key: 'completed', name: '已完工', status: 3 },
]

/* ================= 映射配置 ================= */
const houseTypeMap: Record<string, { text: string; class: string }> = {
  new: { text: '新房', class: 'house-type-new' },
  old: { text: '旧房', class: 'house-type-old' },
  新房: { text: '新房', class: 'house-type-new' },
  旧房: { text: '旧房', class: 'house-type-old' },
  住宅公寓: { text: '住宅公寓', class: 'house-type-default' },
  别墅: { text: '别墅', class: 'house-type-default' },
  自建房: { text: '自建房', class: 'house-type-default' },
  商铺: { text: '商铺', class: 'house-type-default' },
  办公楼: { text: '办公楼', class: 'house-type-default' },
}

const getHouseTypeInfo = (houseType?: string): { text: string; class: string } =>
  houseTypeMap[houseType ?? ''] ?? { text: houseType || '其他', class: 'house-type-default' }

const statusClassMap: Record<number, string> = {
  1: 'status-pending',
  2: 'status-construction',
  3: 'status-completed',
  4: 'status-cancelled',
}

/* ================= State ================= */
const currentIndex = ref(0)
const orderList = ref<any[]>([])
const refresherTriggered = ref<boolean[]>(tabs.map(() => false))

/* ================= Computed ================= */
/** 按订单状态分组，避免模板中重复 filter */
const orderMap = computed<Record<number, any[]>>(() => {
  const map: Record<number, any[]> = {}
  tabs.forEach((tab) => (map[tab.status] = []))
  orderList.value.forEach((order) => {
    map[order.order_status]?.push(order)
  })
  return map
})

/* ================= Actions ================= */
const switchTab = (index: number): void => {
  currentIndex.value = index
}

const onSwiperChange = (e: any): void => {
  currentIndex.value = e.detail.current
}

const goDetail = (id: string): void => {
  uni.navigateTo({ url: `/package-mine/order-detail/index?id=${id}` })
}

const refresh = async (index: number): Promise<void> => {
  refresherTriggered.value[index] = true
  await fetchOrders()
  refresherTriggered.value[index] = false
}

const fetchOrders = async (): Promise<void> => {
  const res = await getOrderListService()
  const ok = res?.success === true || res?.code === 200 || res?.code === '0'
  const raw = res?.data ?? res
  const list = Array.isArray(raw) ? raw : raw?.list ?? []
  orderList.value = ok ? list : []
}

/* ================= Utils ================= */
const formatDate = (date?: string): string => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

const formatLocation = (order: any): string =>
  [order.location, order.roomType].filter(Boolean).join(' ') || '暂无信息'

onLoad(fetchOrders)
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: $uni-bg-color-grey;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Tabs */
.tabs-container {
  display: flex;
  background: $uni-bg-color;
  border-bottom: 1px solid $uni-border-color;

  .tab {
    flex: 1;
    padding: 16px 0;
    text-align: center;
    font-size: 15px;
    color: $uni-text-color-placeholder;
    position: relative;

    &.active {
      color: $uni-text-color;
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 2px;
        background: $uni-color-primary;
      }
    }
  }
}

/* Swiper */
.swiper-container,
.swiper-item {
  flex: 1;
  height: 100%;
}

.scroll-view {
  height: 100%;
  padding: 12px 0;
}

/* Order Card */
.order-card {
  position: relative;
  background: $uni-bg-color;
  margin: 0 16px 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .order-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .house-type-tag,
  .status-tag {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 12px;
  }

  .house-type-new {
    background: rgba($uni-color-primary, 0.15);
    color: $uni-color-primary;
  }

  .house-type-old {
    background: rgba($uni-color-warning, 0.2);
    color: $uni-color-warning;
  }

  .house-type-default {
    background: rgba($uni-text-color-grey, 0.12);
    color: $uni-text-color-grey;
  }

  .status-pending {
    background: rgba($uni-color-warning, 0.15);
    color: $uni-color-warning;
  }

  .status-construction {
    background: rgba($uni-color-primary, 0.15);
    color: $uni-color-primary;
  }

  .status-completed {
    background: rgba($uni-color-success, 0.15);
    color: $uni-color-success;
  }

  .status-cancelled {
    background: rgba($uni-text-color-placeholder, 0.15);
    color: $uni-text-color-placeholder;
  }

  .order-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-right: 30px;
  }

  .order-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 30px;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: $uni-text-color-grey;
  }

  .arrow-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
