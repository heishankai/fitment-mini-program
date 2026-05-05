<template>
  <view class="container">
    <view class="filter-bar">
      <scroll-view scroll-x class="filter-scroll" :show-scrollbar="false">
        <view class="filter-list">
          <view
            v-for="(item, index) in paymentTypeTabs"
            :key="item.value || 'all'"
            class="filter-item"
            :class="{ active: activeTabIndex === index }"
            @tap="handleChangePaymentType(index)"
          >
            {{ item.label }}
          </view>
        </view>
      </scroll-view>
    </view>

    <swiper
      class="record-swiper"
      :current="activeTabIndex"
      :duration="220"
      @change="handleSwiperChange"
    >
      <swiper-item
        v-for="tab in paymentTypeTabs"
        :key="tab.value || 'all'"
        class="record-swiper-item"
      >
        <scroll-view
          class="scroll-view"
          scroll-y
          enhanced
          :lower-threshold="80"
          :show-scrollbar="false"
          refresher-enabled
          :refresher-triggered="getTabState(tab.value).isTriggered"
          @refresherrefresh="onRefresherrefresh(tab.value)"
          @scrolltolower="loadMore(tab.value)"
        >
          <view v-if="getTabState(tab.value).records.length" class="record-list">
            <view
              v-for="record in getTabState(tab.value).records"
              :key="record.id"
              class="record-card"
              :class="{ current: isFromCurrentOrder(record) }"
            >
              <view class="record-header">
                <view class="record-type">{{ getPaymentTypeText(record) }}</view>
                <view class="record-amount">¥{{ formatMoney(record.payment_amount) }}</view>
              </view>

              <view class="record-meta">
                <view class="meta-row">
                  <text class="meta-label">订单号</text>
                  <text class="meta-value">{{ getOrderNo(record) }}</text>
                </view>
                <view class="meta-row">
                  <text class="meta-label">付款时间</text>
                  <text class="meta-value">{{ formatDate(record.createdAt) }}</text>
                </view>
                <view v-if="showWxPayAmount(record)" class="meta-row">
                  <text class="meta-label">微信实付</text>
                  <text class="meta-value">¥{{ formatMoney(record.wx_payment_amount) }}</text>
                </view>
              </view>

              <view v-if="record.description" class="description">
                {{ record.description }}
              </view>

              <view v-if="getPaidItems(record).length" class="snapshot-list">
                <view
                  v-for="(item, index) in getPaidItems(record)"
                  :key="index"
                  class="snapshot-item"
                >
                  {{ item }}
                </view>
              </view>
            </view>

            <view class="load-state">
              {{ getLoadStateText(getTabState(tab.value)) }}
            </view>
          </view>

          <empty-state v-else :text="getEmptyText(getTabState(tab.value))" />
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import EmptyState from '@/components/empty-state.vue'
import { getMyPaymentRecordsService, type PaymentType } from './service'

const paymentTypeTabs: { label: string; value: PaymentType }[] = [
  { label: '全部', value: '' },
  { label: '辅材', value: 'materials' },
  { label: '工价', value: 'work_price' },
  { label: '平台服务费', value: 'platform_service_fee' },
  { label: '工长费', value: 'gangmaster_cost' },
]

const paymentTypeMap: Record<string, string> = {
  materials: '辅材',
  platform_service_fee: '平台服务费',
  gangmaster_cost: '工长费',
  work_price: '工价',
  order: '订单费用',
}

interface TabState {
  records: any[]
  pageIndex: number
  finish: boolean
  loading: boolean
  isTriggered: boolean
  loaded: boolean
}

const pageSize = 20
const fromOrderId = ref<string>('')
const activeTabIndex = ref(0)
const tabStates = reactive<Record<string, TabState>>({})

const getTabKey = (type: PaymentType): string => type || 'all'

const getTabState = (type: PaymentType): TabState => {
  const key = getTabKey(type)
  if (!tabStates[key]) {
    tabStates[key] = {
      records: [],
      pageIndex: 1,
      finish: false,
      loading: false,
      isTriggered: false,
      loaded: false,
    }
  }
  return tabStates[key]
}

const getPaymentTypeText = (record: any): string =>
  record?.payment_type_text || paymentTypeMap[record?.payment_type] || '付款'

const getOrderNo = (record: any): string =>
  record?.order_no || record?.order?.order_no || (record?.orderId ? `订单 ${record.orderId}` : '-')

const formatMoney = (value: unknown): string => (Number(value) || 0).toFixed(2)

const formatDate = (value: unknown): string =>
  value ? dayjs(value as string).format('YYYY-MM-DD HH:mm') : '-'

const showWxPayAmount = (record: any): boolean => {
  if (record?.wx_payment_amount == null) return false
  return Number(record.wx_payment_amount).toFixed(2) !== Number(record.payment_amount).toFixed(2)
}

const isFromCurrentOrder = (record: any): boolean => {
  if (!fromOrderId.value) return false
  return String(record?.orderId) === String(fromOrderId.value)
}

const getPaidItems = (record: any): string[] => {
  if (Array.isArray(record?.materials_snapshot) && record.materials_snapshot.length) {
    return record.materials_snapshot.map((item: any) => {
      const quantity = Number(item?.quantity) || 0
      const unit = item?.commodity_unit || ''
      return `${item?.commodity_name || '辅材'} ×${quantity}${unit}`
    })
  }

  if (Array.isArray(record?.work_price_items_snapshot) && record.work_price_items_snapshot.length) {
    return record.work_price_items_snapshot.map((item: any) => {
      const quantity = Number(item?.quantity) || 0
      const unit = item?.labour_cost_name || ''
      return `${item?.work_title || '工价'} ×${quantity}${unit}`
    })
  }

  return []
}

const loadRecords = async (type: PaymentType, reset = false): Promise<void> => {
  const state = getTabState(type)
  if (state.loading) return
  if (!reset && state.finish) return

  state.loading = true
  if (reset) {
    state.pageIndex = 1
    state.finish = false
  }

  try {
    const { success, data } = await getMyPaymentRecordsService({
      pageIndex: state.pageIndex,
      pageSize,
      ...(type ? { payment_type: type } : {}),
    })
    if (!success) return

    const list = Array.isArray(data?.data) ? data.data : []
    state.records = reset ? list : [...state.records, ...list]
    state.finish = (data?.pageIndex ?? state.pageIndex) >= (data?.pageTotal ?? 1)
    state.loaded = true
    if (list.length) state.pageIndex += 1
  } finally {
    state.loading = false
  }
}

const loadMore = (type: PaymentType): void => {
  loadRecords(type)
}

const onRefresherrefresh = async (type: PaymentType): Promise<void> => {
  const state = getTabState(type)
  state.isTriggered = true
  await loadRecords(type, true)
  state.isTriggered = false
}

const getActivePaymentType = (): PaymentType =>
  paymentTypeTabs[activeTabIndex.value]?.value ?? ''

const switchTab = (index: number): void => {
  if (index < 0 || index >= paymentTypeTabs.length) return
  activeTabIndex.value = index
  const type = getActivePaymentType()
  const state = getTabState(type)
  if (!state.loaded && !state.loading) {
    loadRecords(type, true)
  }
}

const handleChangePaymentType = (index: number): void => {
  if (activeTabIndex.value === index) return
  switchTab(index)
}

const handleSwiperChange = (event: any): void => {
  const index = Number(event?.detail?.current) || 0
  if (activeTabIndex.value === index) return
  switchTab(index)
}

const getLoadStateText = (state: TabState): string => {
  if (state.loading) return '加载中...'
  if (state.finish) return '已加载全部'
  return '上拉加载更多'
}

const getEmptyText = (state: TabState): string =>
  state.loading || !state.loaded ? '正在加载付款记录' : '暂无付款记录'

onLoad((options) => {
  fromOrderId.value = String(options?.orderId || '')
  loadRecords(getActivePaymentType(), true)
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #f6f8f7;
}
</style>

<style lang="scss" scoped>
.container {
  height: 100vh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #f6f8f7;
}

.filter-bar {
  padding: 20rpx 24rpx 12rpx;
  background: #fff;
  border-top: 1rpx solid #f1f2f2;
  border-bottom: 1rpx solid #eef0f0;
  flex-shrink: 0;
}

.filter-scroll {
  width: 100%;
  white-space: nowrap;
}

.filter-list {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
}

.filter-item {
  height: 56rpx;
  padding: 0 28rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6e7373;
  background: #f3f5f5;
  font-size: 24rpx;
  line-height: 56rpx;

  &.active {
    color: #fff;
    background: #2d635e;
  }
}

.record-swiper {
  flex: 1;
  height: 0;
  min-height: 0;
}

.record-swiper-item {
  height: 100%;
}

.scroll-view {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.record-list {
  padding: 24rpx;
  box-sizing: border-box;
}

.record-card {
  margin-bottom: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  background: #fff;
  border: 1rpx solid #edf0f0;

  &.current {
    border-color: #9fc8c1;
  }
}

.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.record-type {
  color: #1e2222;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}

.record-amount {
  color: #2d635e;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 44rpx;
}

.record-meta {
  margin-top: 18rpx;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 36rpx;
}

.meta-label {
  color: #8a8f8f;
  flex-shrink: 0;
}

.meta-value {
  color: #4d5353;
  text-align: right;
  word-break: break-all;
}

.description {
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid #eef0f0;
  color: #6e7373;
  font-size: 24rpx;
  line-height: 36rpx;
}

.snapshot-list {
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.snapshot-item {
  padding: 12rpx 16rpx;
  border-radius: 8rpx;
  background: #f6f8f7;
  color: #4d5353;
  font-size: 23rpx;
  line-height: 34rpx;
}

.load-state {
  padding: 16rpx 0 40rpx;
  color: #a8adad;
  text-align: center;
  font-size: 24rpx;
}
</style>
