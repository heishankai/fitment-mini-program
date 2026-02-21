<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y>
      <!-- 服务地址 -->
      <section class="section">
        <view class="section-title">
          <uni-icons custom-prefix="iconfont" type="icon-dizhi" size="16" color="#2D635E" />
          <text class="title-text">服务地址<text class="required">*</text></text>
        </view>
        <view class="address-row">
          <view class="address-input-wrap" :class="{ loading: locationLoading }" @tap="initLocation">
            <uni-icons v-if="locationLoading" type="spinner-cycle" size="18" color="#2D635E"
              class="address-loading-icon" />
            <text v-else-if="formData.address" class="address-text">{{ formData.address }}</text>
            <text v-else class="address-placeholder">点击选择或获取位置</text>
            <text v-if="locationLoading" class="address-loading-text">获取中...</text>
          </view>
          <view class="get-location-btn" @tap="initLocation">
            <uni-icons type="paperplane" size="18" :color="locationLoading ? '#2D635E80' : '#2D635E'" />
            <text class="btn-label">获取位置</text>
          </view>
        </view>
      </section>

      <!-- 房屋信息 -->
      <section class="section">
        <view class="section-title">
          <uni-icons custom-prefix="iconfont" type="icon-shouye" size="16" color="#2D635E" />
          <text class="title-text">房屋信息<text class="required">*</text></text>
        </view>

        <view class="field-block">
          <view class="field-label">
            <text>房屋类型<text class="required">*</text></text>
          </view>
          <view class="house-type-grid">
            <view v-for="type in houseTypes" :key="type" class="type-item"
              :class="{ active: formData.houseType === type }" @tap="formData.houseType = type">
              {{ type }}
            </view>
          </view>
        </view>

        <view class="field-row">
          <view class="field-block half">
            <view class="field-label">
              <uni-icons custom-prefix="iconfont" type="icon-fenlei" size="12" color="#666" />
              <text>户型结构<text class="required">*</text></text>
            </view>
            <input v-model="formData.roomType" class="input" type="text" placeholder="如: 2室1厅"
              placeholder-class="placeholder" />
          </view>
          <view class="field-block half">
            <view class="field-label">
              <uni-icons custom-prefix="iconfont" type="icon-chizi_o" size="12" color="#666" />
              <text>建筑面积<text class="required">*</text></text>
            </view>
            <view class="input-wrap">
              <input v-model="formData.area" class="input" type="number" placeholder="请输入"
                placeholder-class="placeholder" />
              <text class="unit">m²</text>
            </view>
          </view>
        </view>
      </section>

      <!-- 联系方式 -->
      <section class="section section-contact">
        <view class="section-title">
          <text class="title-text">联系方式<text class="required">*</text></text>
        </view>
        <view class="field-block">
          <input v-model="formData.contactName" class="input full" type="text" placeholder="您的称呼 (先生/女士)"
            placeholder-class="placeholder" />
        </view>
        <view class="field-block">
          <input v-model="formData.contactPhone" class="input full" type="text" maxlength="11" placeholder="手机号码"
            placeholder-class="placeholder" />
        </view>
      </section>

      <!-- 期望上门时间 & 备注 -->
      <section class="section">
        <view class="section-title">
          <uni-icons custom-prefix="iconfont" type="icon-shangmen" size="16" color="#2D635E" />
          <text class="title-text">期望上门时间<text class="required">*</text></text>
        </view>
        <picker mode="date" :value="formData.serviceTime" @change="onDateChange">
          <view class="picker-wrap">
            <text :class="formData.serviceTime ? 'picker-value' : 'picker-placeholder'">
              {{ formData.serviceTime || '请选择日期' }}
            </text>
          </view>
        </picker>

        <view class="field-block remark-block">
          <view class="field-label field-label-bold">
            <text>备注说明<text class="required">*</text></text>
          </view>
          <textarea v-model="formData.remark" class="textarea" placeholder="请描述您的具体需求，例如：只刷客厅墙面、需要铲除旧墙皮等..."
            placeholder-class="placeholder" :maxlength="500" />
        </view>
      </section>

      <view class="agreement-tip">
        点击提交即代表同意《智惠装服务协议》，平台将智能匹配附近的优质工匠为您服务。
      </view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="footer-bar">
      <button class="submit-btn" :class="{ loading: loading }" :disabled="loading" @tap.stop="handleSubmit">
        <uni-icons v-if="loading" type="spinner-cycle" size="20" color="#fff" />
        <text>{{ loading ? '正在匹配附近工匠...' : '预约工匠服务' }}</text>
      </button>
    </view>

    <!-- 成功弹窗 -->
    <uni-popup ref="successPopupRef" type="center" :mask-click="false">
      <view class="success-card">
        <view class="success-icon-wrap">
          <uni-icons custom-prefix="iconfont" type="icon-yiqueren" size="48" color="#2D635E" />
        </view>
        <text class="success-title">预约已提交</text>
        <text class="success-desc">
          系统已为您推送至附近工匠\n请保持电话畅通，稍后会有师傅联系您
        </text>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { getUserLocation } from '@/utils'
import { getReverseGeocodeService, createOrderService } from './service'
import { validateServiceRequestForm } from './utils'

const formData = <any>ref({
  // 详细地址（展示用）
  address: '',
  // 详细位置
  location: '',
  // 房屋类型（默认住宅公寓）
  houseType: '住宅公寓',
  // 户型
  roomType: '',
  // 面积
  area: '',
  // 省份
  province: '',
  // 城市
  city: '',
  // 区县
  district: '',
  // 纬度
  latitude: null,
  // 经度
  longitude: null,
  // 工种名称
  work_kind_name: null,
  // 工种id
  id: null,


  // 联系电话
  contactPhone: '',
  // 联系人姓名
  contactName: '',
  // 期望上门时间
  serviceTime: '',
  // 备注说明
  remark: '',
})

const loading = ref<boolean>(false)
const locationLoading = ref<boolean>(false)
const successPopupRef = ref<any>(null)

const houseTypes = ['住宅公寓', '别墅', '自建房', '商铺', '办公楼']

const onDateChange = (e: any): void => {
  formData.value.serviceTime = e.detail.value
}


const initLocation = async (): Promise<void> => {
  locationLoading.value = true
  try {
    const location = await getUserLocation()
    if (!location) return
    const { success: ok, data } = await getReverseGeocodeService(location)
    if (!ok) return
    const { city, district, address, province } = data
    formData.value.address = address
    formData.value.location = `${province} ${city} ${district}`
    formData.value.province = province
    formData.value.city = city
    formData.value.district = district
    formData.value.latitude = location.latitude
    formData.value.longitude = location.longitude
  } finally {
    locationLoading.value = false
  }
}

// 提交订单
const handleSubmit = async (): Promise<void> => {

  const data = {
    address: formData.value.address,
    houseType: formData.value.houseType,
    roomType: formData.value.roomType,
    area: formData.value.area,
    contactName: formData.value.contactName,
    contactPhone: formData.value.contactPhone,
    serviceTime: formData.value.serviceTime,
    remark: formData.value.remark,
  }

  const { valid, message } = validateServiceRequestForm(data)

  if (!valid) {
    uni.showToast({ icon: 'none', title: message ?? '请完善表单信息' })
    return
  }

  uni?.vibrateShort()

  if (loading.value) return

  loading.value = true
  try {
    const res = await createOrderService(formData.value)

    if (!res.success) {
      uni.showToast({ icon: 'none', title: res.message ?? '提交失败，请重试', duration: 2000 })
      return
    }

    successPopupRef.value?.open('center')

    setTimeout(() => {
      successPopupRef.value?.close()
      uni.reLaunch({ url: '/pages/mine/index' })
    }, 2000)

  } finally {
    loading.value = false
  }
}

onLoad(async (options) => {
  const { work_kind_name, id } = options ?? {}
  console.log(options, 'options')

  if (work_kind_name && id) {
    formData.value.work_kind_name = decodeURIComponent(work_kind_name)
    formData.value.id = id
  }
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
  height: 0;
  overflow: hidden;
}

.footer-bar {
  padding: 24rpx 24rpx;
  padding-bottom: max(24rpx, env(safe-area-inset-bottom));
  background: $uni-bg-color;
  border-top: 2rpx solid $uni-border-color;
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.04);

  .submit-btn {
    width: 100%;
    height: 96rpx;
    background: $uni-color-primary;
    border-radius: 48rpx;
    color: $uni-text-color-inverse;
    font-size: 32rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    border: none;
    box-shadow: 0 8rpx 32rpx rgba($uni-color-primary, 0.25);

    &::after {
      border: none;
    }

    &.loading {
      background: rgba($uni-color-primary, 0.75);
      opacity: 1;
    }
  }
}

.section {
  margin-bottom: 24rpx;
  padding: 48rpx;
  background: $uni-bg-color;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 40rpx rgba(45, 99, 94, 0.06);
  overflow: hidden;
  box-sizing: border-box;
}

.section:last-of-type {
  margin-bottom: 0;
}

.section-contact .field-block {
  margin-bottom: 24rpx;
  width: 100%;
}

.section-contact .field-block:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 32rpx;
}

.title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;

  .required {
    color: $uni-color-error;
    margin-left: 2rpx;
  }
}

.address-row {
  display: flex;
  gap: 24rpx;

  .address-input-wrap {
    flex: 1;
    min-width: 0;
    min-height: 88rpx;
    background: $uni-bg-color-grey;
    border-radius: $uni-border-radius-base;
    padding: 0 80rpx 0 32rpx;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;

    .address-text {
      flex: 1;
      min-width: 0;
      font-size: 28rpx;
      color: $uni-text-color;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .address-placeholder {
      font-size: 28rpx;
      color: $uni-text-color-placeholder;
    }

    &.loading {
      .address-loading-icon {
        flex-shrink: 0;
        margin-right: 12rpx;
      }

      .address-loading-text {
        font-size: 28rpx;
        color: $uni-text-color-placeholder;
      }
    }
  }
}

.clear-btn {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 12rpx;
}

.get-location-btn {
  flex-shrink: 0;
  width: 120rpx;
  min-height: 88rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba($uni-color-primary, 0.05);
  border-radius: $uni-border-radius-base;
}

.btn-label {
  font-size: 20rpx;
  color: $uni-color-primary;
  font-weight: 500;
  margin-top: 4rpx;
}

.field-block {
  margin-bottom: 40rpx;
  min-width: 0;

  &.half {
    flex: 1;
    min-width: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.remark-block {
  margin-top: 40rpx;
}

.field-row {
  display: flex;
  gap: 32rpx;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: $uni-text-color-grey;
  margin-bottom: 16rpx;
  font-weight: 500;

  .required {
    color: $uni-color-error;
    margin-left: 2rpx;
  }

  &.field-label-bold {
    font-size: 30rpx;
    font-weight: 600;
    color: $uni-text-color;
    margin-bottom: 16rpx;
  }
}

.house-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.type-item {
  padding: 20rpx 16rpx;
  text-align: center;
  font-size: 26rpx;
  color: $uni-text-color-grey;
  background: $uni-bg-color-grey;
  border-radius: $uni-border-radius-base;
  border: 2rpx solid transparent;

  &.active {
    background: $uni-color-primary;
    color: $uni-text-color-inverse;
    font-weight: 500;
    border-color: $uni-color-primary;
    box-shadow: 0 8rpx 24rpx rgba($uni-color-primary, 0.25);
  }
}

.input {
  width: 100%;
  max-width: 100%;
  height: 88rpx;
  background: $uni-bg-color-grey;
  border-radius: $uni-border-radius-base;
  padding: 0 32rpx;
  font-size: 28rpx;
  color: $uni-text-color;
  box-sizing: border-box;

  &.full {
    height: 88rpx;
  }
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;

  .input {
    padding-right: 72rpx;
  }

  .unit {
    position: absolute;
    right: 32rpx;
    font-size: 24rpx;
    color: $uni-text-color-placeholder;
  }
}

.placeholder {
  color: $uni-text-color-placeholder;
}

.picker-wrap {
  height: 88rpx;
  background: $uni-bg-color-grey;
  border-radius: $uni-border-radius-base;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
}

.picker-value {
  font-size: 28rpx;
  color: $uni-text-color;
}

.picker-placeholder {
  font-size: 28rpx;
  color: $uni-text-color-placeholder;
}

.textarea {
  width: 100%;
  min-height: 180rpx;
  background: $uni-bg-color-grey;
  border-radius: $uni-border-radius-base;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  color: $uni-text-color;
  margin-top: 12rpx;
  box-sizing: border-box;
}

.agreement-tip {
  padding: 40rpx 24rpx 48rpx;
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
  text-align: center;
  line-height: 1.7;
}

/* 成功弹窗内容（uni-popup 内部） */
.success-card {
  width: 560rpx;
  padding: 64rpx 48rpx;
  background: $uni-bg-color;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.15);
}

.success-icon-wrap {
  width: 128rpx;
  height: 128rpx;
  margin-bottom: 32rpx;
  background: rgba($uni-color-primary, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin-bottom: 16rpx;
}

.success-desc {
  font-size: 28rpx;
  color: $uni-text-color-grey;
  line-height: 1.6;
  white-space: pre-line;
}
</style>
