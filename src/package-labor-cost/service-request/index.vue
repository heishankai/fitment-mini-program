<template>
  <view class="container">
    <!-- 主要内容区域 -->
    <scroll-view class="scroll-view" scroll-y>
      <view class="content-inner">
        <!-- 1. 服务地址卡片 -->
        <section-block title="服务地址">
          <view class="address-card" @tap="initLocation">
            <view class="address-icon-wrap" :class="{ filled: formData.address }">
              <uni-icons v-if="locationLoading" type="spinner-cycle" size="20" color="#2D635E" />
              <uni-icons v-else custom-prefix="iconfont" type="icon-dizhi" size="20"
                :color="formData.address ? '#2D635E' : '#999'" />
            </view>
            <view class="address-content">
              <text v-if="formData.address" class="address-main">{{ formData.address }}</text>
              <text v-else class="address-main placeholder">点击获取位置</text>
              <text class="address-sub">{{ formData.address ? '已自动定位' : '请确保开启定位权限' }}</text>
            </view>
            <uni-icons type="right" size="18" color="#CCC" />
          </view>
        </section-block>

        <!-- 2. 房屋信息 -->
        <section-block title="房屋信息">
          <template #right>
            <view class="privacy-badge">
              <text class="privacy-text">100% 隐私保护</text>
            </view>
          </template>
          <view class="house-card">
            <!-- 房屋类型 -->
            <view class="house-block">
              <text class="block-label">房屋类型</text>
              <view class="house-type-grid">
                <view v-for="type in houseTypes" :key="type" class="type-item"
                  :class="{ active: formData.houseType === type }" @tap="formData.houseType = type">
                  {{ type }}
                </view>
              </view>
            </view>

            <view class="divider" />

            <!-- 房屋结构 -->
            <view class="house-row" @tap="openLayoutPicker">
              <text class="block-label">房屋结构</text>
              <view class="house-row-value">
                <text :class="['layout-value', { placeholder: !layoutDisplay }]">{{ layoutDisplay || '请选择户型' }}</text>
                <uni-icons type="right" size="16" color="#CCC" />
              </view>
            </view>

            <view class="divider" />

            <!-- 建筑面积 -->
            <view class="house-block">
              <text class="block-label">建筑面积</text>
              <view class="area-input-row">
                <input confirm-type="done" :cursor-spacing="50" v-model="formData.area" class="area-input" type="number"
                  placeholder="请输入" placeholder-class="area-placeholder" />
                <text class="area-unit">m²</text>
              </view>
            </view>
          </view>
        </section-block>

        <!-- 3. 选择服务类型 -->
        <section-block title="选择服务类型">
          <view class="work-kind-grid">
            <view v-for="item in workKindList" :key="item.work_kind_code" class="work-kind-item"
              :class="{ active: formData.work_kind_code === item.work_kind_code }" @tap="selectWorkKind(item)">
              <text class="work-kind-name">{{ item.work_kind_name }}</text>
              <text class="work-kind-icon iconfont" :class="getWorkKindIcon(item.work_kind_name)" />
            </view>
          </view>
        </section-block>

        <!-- 4. 预约信息 -->
        <section-block title="预约信息">
          <view class="appointment-card">
            <picker mode="date" :value="formData.serviceTime" @change="onDateChange" class="picker-full-row">
              <view class="appointment-row">
                <view class="row-left">
                  <uni-icons type="calendar" size="18" color="#999" />
                  <text class="row-label">期望上门时间</text>
                </view>
                <view class="row-right">
                  <text :class="['row-value', { placeholder: !formData.serviceTime }]">
                    {{ formData.serviceTime || '请选择日期' }}
                  </text>
                  <uni-icons type="right" size="16" color="#CCC" />
                </view>
              </view>
            </picker>
            <view class="appointment-divider" />
            <view class="appointment-row">
              <view class="row-left">
                <uni-icons type="person" size="18" color="#999" />
                <text class="row-label">联系人</text>
              </view>
              <input :cursor-spacing="50" v-model="formData.contactName" class="row-input" type="text"
                placeholder="请输入称呼" placeholder-class="placeholder" />
            </view>
            <view class="appointment-divider" />
            <view class="appointment-row">
              <view class="row-left">
                <uni-icons type="phone" size="18" color="#999" />
                <text class="row-label">联系电话</text>
              </view>
              <input :cursor-spacing="50" v-model="formData.contactPhone" class="row-input" type="number" maxlength="11"
                placeholder="请输入手机号" placeholder-class="placeholder" />
            </view>
            <view class="appointment-divider" />
            <view class="appointment-block">
              <view class="row-left mb-2">
                <uni-icons type="chat" size="18" color="#999" />
                <text class="row-label">备注需求</text>
              </view>
              <textarea :cursor-spacing="120" confirm-type="done" v-model="formData.remark" class="remark-textarea"
                placeholder="例如：需要拆除旧地板，只刷客厅墙面..." placeholder-class="placeholder" :maxlength="500" />
            </view>
          </view>
        </section-block>
      </view>
    </scroll-view>

    <!-- 底部悬浮按钮 -->
    <view class="footer-bar">
      <view class="trust-badges">
        <template v-for="(item, i) in TRUST_BADGES" :key="item.text">
          <view v-if="i" class="trust-divider" />
          <trust-item :icon="item.icon" :text="item.text" />
        </template>
      </view>
      <button class="submit-btn" :class="{ disabled: !formData.work_kind_code, loading }"
        :disabled="loading || !formData.work_kind_code" @tap="handleSubmit">
        <uni-icons v-if="loading" type="spinner-cycle" size="20" color="#fff" />
        <text>{{ loading ? '提交中...' : '立即预约' }}</text>
      </button>
    </view>

    <!-- 房屋结构选择器弹窗 -->
    <layout-picker-popup ref="layoutPopupRef" :model-value="formData.layout" @update:model-value="onLayoutUpdate" />

    <!-- 提交成功弹窗 -->
    <success-popup ref="successPopupRef" @close="goToMine" />
  </view>
</template>

<script setup lang="ts">
import { getUserLocation } from '@/utils'
import { getReverseGeocodeService, createOrderService, getWorkKindListService } from './service'
import SectionBlock from './components/section-block.vue'
import LayoutPickerPopup from './components/layout-picker-popup.vue'
import SuccessPopup from './components/success-popup.vue'
import TrustItem from './components/trust-item.vue'

const formData = ref({
  address: '',
  location: '',
  houseType: '住宅公寓',
  layout: { room: 3, bath: 2 } as { room: number; bath: number },
  roomType: '3房2卫',
  area: '',
  province: '',
  city: '',
  district: '',
  latitude: null as number | null,
  longitude: null as number | null,
  work_kind_name: '工长',
  work_kind_code: 'GONGZHANG',
  contactPhone: '',
  contactName: '',
  serviceTime: '',
  remark: '',
})

const loading = ref(false)
const locationLoading = ref(false)
const layoutPopupRef = ref<any>(null)
const successPopupRef = ref<any>(null)
const workKindList = ref<{ work_kind_code: string; work_kind_name: string }[]>([])

const houseTypes = ['住宅公寓', '别墅', '自建房', '商铺', '办公楼']

const TRUST_BADGES = [
  { icon: 'icon-anquanbaozhang', text: '实名认证' },
  { icon: 'icon-zhengjianqueren', text: '价格透明' },
  { icon: 'icon-xunzhang', text: '售后无忧' },
] as const

const WORK_KIND_ICONS: [string, string][] = [
  ['油漆', 'icon-shuazi1'],
  ['设计', 'icon-chizi_o'],
  ['泥', 'icon-hammer-outline'],
  ['木', 'icon-fenlei'],
  ['拆除', 'icon-hammer-outline'],
  ['水电', 'icon-dianli'],
  ['工长', 'icon-a-anquananquanmao'],
]

const layoutDisplay = computed(() => {
  const { room, bath } = formData.value.layout
  return room && bath ? `${room}房 ${bath}卫` : ''
})

function getWorkKindIcon(name: string): string {
  if (!name) return 'icon-fenlei'
  return WORK_KIND_ICONS.find(([key]) => name.includes(key))?.[1] ?? 'icon-gongren'
}

const selectWorkKind = (item: { work_kind_code: string; work_kind_name: string }): void => {
  console.log(item,'itemitemitem');
  formData.value.work_kind_code = item.work_kind_code
  formData.value.work_kind_name = item.work_kind_name
}

function onLayoutUpdate(v: { room: number; bath: number }): void {
  formData.value.layout = v
  formData.value.roomType = `${v.room}房${v.bath}卫`
}

function onDateChange(e: { detail: { value: string } }): void {
  formData.value.serviceTime = e.detail.value
}

function openLayoutPicker(): void {
  layoutPopupRef.value?.open()
}

async function initLocation(): Promise<void> {
  locationLoading.value = true
  try {
    const location = await getUserLocation()
    if (!location) return
    const { success: ok, data } = await getReverseGeocodeService(location)
    if (!ok) return
    const { city, district, address, province } = data
    Object.assign(formData.value, {
      address,
      location: `${province} ${city} ${district}`,
      province,
      city,
      district,
      latitude: location.latitude,
      longitude: location.longitude,
    })
  } finally {
    locationLoading.value = false
  }
}

function goToMine(): void {
  successPopupRef.value?.close()
  uni.reLaunch({ url: '/pages/mine/index' })
}

async function handleSubmit(): Promise<void> {
  uni?.vibrateShort()
  if (loading.value) return
  if (!formData.value.work_kind_code) {
    uni.showToast({ icon: 'none', title: '请选择服务类型' })
    return
  }
  loading.value = true
  try {
    const res = await createOrderService({ ...formData.value })
    if (!res.success) {
      uni.showToast({ icon: 'none', title: res.message ?? '提交失败，请重试', duration: 2000 })
      return
    }
    successPopupRef.value?.open()
    setTimeout(goToMine, 2000)
  } finally {
    loading.value = false
  }
}

onLoad(async (options?: any) => {
  const { work_kind_name, work_kind_code } = options ?? {}

  const { data, success } = await getWorkKindListService()

  if (success){
    workKindList.value = data
  }

  if(work_kind_code){
    formData.value.work_kind_code = work_kind_code 
    formData.value.work_kind_name = decodeURIComponent(work_kind_name) 
  }

  const userInfo = uni.getStorageSync('userInfo') ?? {}
  if (userInfo?.phone) formData.value.contactPhone = String(userInfo.phone)
  await initLocation()
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

.content-inner {
  padding: 32rpx;
}

.privacy-badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 12rpx 24rpx;
  background: rgba(45, 99, 94, 0.05);
  border-radius: 999rpx;

  .privacy-text {
    font-size: 20rpx;
    font-weight: 700;
    color: rgba(45, 99, 94, 0.8);
  }
}

/* 服务地址卡片 */
.address-card {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .address-icon-wrap {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: #F2F2F2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.filled {
      background: rgba(45, 99, 94, 0.1);
    }
  }

  .address-content {
    flex: 1;
    min-width: 0;
  }

  .address-main {
    display: block;
    font-size: 32rpx;
    font-weight: 700;
    color: #111;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.placeholder {
      color: #333;
    }
  }

  .address-sub {
    font-size: 24rpx;
    color: #999;
    margin-top: 4rpx;
  }
}

/* 房屋信息卡片 */
.house-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .house-block {
    margin-bottom: 0;
  }

  .block-label {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 24rpx;
    display: block;
  }

  .house-type-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;
  }

  .type-item {
    padding: 16rpx 16rpx 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    font-weight: 500;
    border-radius: 24rpx;
    border: 2rpx solid transparent;
    background: #F9F9F9;
    color: #666;

    &.active {
      background: #2D635E;
      border-color: #2D635E;
      color: #fff;
      box-shadow: 0 8rpx 24rpx rgba(45, 99, 94, 0.2);
    }
  }

  .divider {
    height: 2rpx;
    background: #F2F2F2;
    margin: 32rpx 0;
  }

  .house-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 0;
  }

  .house-row-value {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .layout-value {
    font-size: 32rpx;
    font-weight: 700;
    color: #111;

    &.placeholder {
      color: #CCC;
    }
  }

  .area-input-row {
    display: flex;
    align-items: flex-end;
    gap: 16rpx;
  }

  .area-input {
    flex: 1;
    font-size: 56rpx;
    font-weight: 700;
    color: #111;
    height: 80rpx;
    padding: 0;
    background: transparent;
  }

  .area-placeholder {
    color: #EEE;
  }

  .area-unit {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 16rpx;
  }
}

/* 选择服务类型 */
.work-kind-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;

  .work-kind-item {
    height: 120rpx;
    padding: 24rpx;
    border-radius: 24rpx;
    border: 2rpx solid #F0F0F0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.active {
      background: #2D635E;
      border-color: #2D635E;
      box-shadow: 0 8rpx 24rpx rgba(45, 99, 94, 0.2);

      .work-kind-name {
        color: #fff;
      }

      .work-kind-icon {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .work-kind-name {
    font-size: 30rpx;
    font-weight: 700;
    color: #333;
  }

  .work-kind-icon {
    font-family: 'iconfont' !important;
    font-size: 40rpx;
    color: #CCC;
  }
}

/* 预约信息卡片 */
.appointment-card {
  background: #fff;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .picker-full-row {
    display: block;
    width: 100%;
  }

  .appointment-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
  }

  .row-right {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .row-left {
    display: flex;
    align-items: center;
    gap: 24rpx;

    &.mb-2 {
      margin-bottom: 16rpx;
    }
  }

  .row-label {
    font-size: 28rpx;
    color: #333;
  }

  .row-value {
    font-size: 28rpx;
    color: #666;

    &.placeholder {
      color: #CCC;
    }
  }

  .row-input {
    flex: 1;
    text-align: right;
    font-size: 28rpx;
    color: #666;
    width: 260rpx;
  }

  .appointment-divider {
    height: 2rpx;
    background: #F2F2F2;
    margin: 0 32rpx;
  }

  .appointment-block {
    padding: 32rpx;
  }

  .remark-textarea {
    width: 100%;
    min-height: 160rpx;
    background: #F9F9F9;
    border-radius: 24rpx;
    padding: 24rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }

  .placeholder {
    color: #CCC;
  }
}

/* 底部栏 */
.footer-bar {
  padding: 32rpx;
  padding-bottom: max(32rpx, env(safe-area-inset-bottom));
  background: #fff;
  border-top: 2rpx solid #F0F0F0;
  box-shadow: 0 -10rpx 40rpx rgba(0, 0, 0, 0.03);
  z-index: 50;

  .trust-badges {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40rpx;
    margin-bottom: 24rpx;
  }

  .trust-divider {
    width: 2rpx;
    height: 20rpx;
    background: #EEE;
  }

  .submit-btn {
    width: 100%;
    height: 96rpx;
    border-radius: 96rpx;
    font-size: 32rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    background: #2D635E;
    color: #fff;
    border: none;
    box-shadow: 0 16rpx 48rpx rgba(45, 99, 94, 0.3);

    &::after {
      border: none;
    }

    &.disabled {
      background: #F2F2F2;
      color: #CCC;
      box-shadow: none;
    }

    &.loading {
      opacity: 0.9;
    }
  }
}
</style>
