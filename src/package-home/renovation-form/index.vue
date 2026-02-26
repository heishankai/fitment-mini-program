<template>
  <view class="container">
    <!-- 滚动容器（参考 labor-price-detail）-->
    <scroll-view class="scroll-view" scroll-y>
      <!-- 可滚动的头部 -->
      <view class="header-wrap">
        <view class="hero-deco hero-deco-1" />
        <view class="hero-deco hero-deco-2" />
        <view class="hero-nav hero-nav-placeholder">
          <view class="nav-spacer" />
          <text class="nav-title">PREMIUM SERVICE</text>
          <view class="nav-spacer" />
        </view>
        <view class="hero-content">
          <view class="hero-tag">
            <view class="tag-dot" />
            <text class="tag-text">专业顾问服务</text>
          </view>
          <view class="hero-title">
            <text>预约您的</text>
            <text class="title-bold">专属装修顾问</text>
          </view>
          <text class="hero-desc">提交需求后，资深装修顾问将在24小时内与您联系，为您提供免费报价与咨询服务</text>
        </view>
      </view>

      <!-- 内容区（参考 labor-price-detail 的 detail-section 结构）-->
      <view class="content-inner">
        <!-- 服务地址 -->
        <section class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">服务地址<text class="required">*</text></text>
          </view>
          <view class="address-row">
            <view class="address-input-wrap" :class="{ loading: locationLoading }" @tap="initLocation">
              <uni-icons v-if="locationLoading" type="spinner-cycle" size="18" color="#2D635E"
                class="address-loading-icon" />
              <text v-else-if="formData.location" class="address-text">{{ formData.location }}</text>
              <text v-else class="address-placeholder">点击选择或获取位置</text>
              <text v-if="locationLoading" class="address-loading-text">获取中...</text>
            </view>
            <view class="get-location-btn" @tap="initLocation">
              <uni-icons type="paperplane" size="18" :color="locationLoading ? '#2D635E80' : '#2D635E'" />
              <text class="btn-label">获取位置</text>
            </view>
          </view>
        </section>

        <!-- 房屋类型 -->
        <section class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">房屋类型<text class="required">*</text></text>
          </view>
          <view class="house-type-grid">
            <view v-for="type in houseTypes" :key="type" class="type-item"
              :class="{ active: formData.houseType === type }" @tap="formData.houseType = type">
              {{ type }}
            </view>
          </view>
        </section>

        <!-- 户型 & 面积 -->
        <section class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">户型与面积<text class="required">*</text></text>
          </view>
          <view class="field-row">
            <view class="field-block half">
              <view class="field-label">
                <text>户型结构</text>
              </view>
              <input v-model="formData.roomType" class="input" type="text" placeholder="如: 2室1厅"
                placeholder-class="placeholder" />
            </view>
            <view class="field-block half">
              <view class="field-label">
                <text>建筑面积</text>
              </view>
              <view class="input-wrap">
                <input v-model="formData.area" class="input" type="number" placeholder="请输入"
                  placeholder-class="placeholder" />
                <text class="unit">m²</text>
              </view>
            </view>
          </view>
        </section>

        <view class="bottom-spacer" />
      </view>
    </scroll-view>

    <!-- 固定顶部导航栏 -->
    <view class="sticky-header">
      <view class="nav-back" @tap="handleBack" :style="{ top: `${navBackTop}px` }">
        <uni-icons type="left" size="22" color="#1e2222" />
      </view>
    </view>

    <!-- 底部悬浮按钮 -->
    <view class="footer-bar">
      <button class="submit-btn" :class="{ loading: loading }" :disabled="loading" @getphonenumber="handleSubmit"
        open-type="getPhoneNumber">
        <view class="btn-icon">
          <uni-icons v-if="loading" type="spinner-cycle" size="20" color="#fff" />
          <view v-else class="calc-icon" />
        </view>
        <text class="btn-text">{{ loading ? '正在计算...' : '立即获取报价' }}</text>
        <view class="btn-arrow">
          <uni-icons type="arrow-right" size="20" color="#2D635E" />
        </view>
      </button>
    </view>

    <!-- 成功弹窗 -->
    <uni-popup ref="successPopupRef" type="center" :mask-click="false">
      <view class="success-card">
        <view class="success-icon-wrap">
          <uni-icons custom-prefix="iconfont" type="icon-yiqueren" size="48" color="#2D635E" />
        </view>
        <text class="success-title">报价已提交</text>
        <text class="success-desc">
          工作人员将尽快与您联系\n请保持电话畅通
        </text>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { getUserLocation } from '@/utils'
import { loginService, getUserPhoneNumberService } from '@/pages/login/service'
import { getReverseGeocodeService, getQuoteService } from './service'

const formData = ref({
  location: '',
  houseType: '住宅公寓',
  roomType: '',
  area: '',
})

const locationLoading = ref(false)
const loading = ref(false)
const successPopupRef = ref<any>(null)

const houseTypes = ['住宅公寓', '别墅', '自建房', '商铺', '办公楼']

// 精准计算返回按钮垂直位置（参考 labor-price-detail）
const navBackTop = computed(() => {
  try {
    const sys = uni.getSystemInfoSync()
    const menuButton = wx.getMenuButtonBoundingClientRect()
    const capsuleCenterY = menuButton.top + menuButton.height / 2
    const containerSizePx = (72 * sys.windowWidth) / 750
    return Math.max(capsuleCenterY - containerSizePx / 2, 10)
  } catch {
    return (48 * uni.getSystemInfoSync().windowWidth) / 750
  }
})

const handleBack = (): void => {
  uni.navigateBack()
}

const validate = (): boolean => {
  if (!formData.value.location?.trim()) {
    uni.showToast({ title: '请输入装修位置', icon: 'none' })
    return false
  }
  if (!formData.value.roomType?.trim()) {
    uni.showToast({ title: '请输入户型', icon: 'none' })
    return false
  }
  if (!formData.value.area?.trim()) {
    uni.showToast({ title: '请输入建筑面积', icon: 'none' })
    return false
  }
  return true
}

const initLocation = async (): Promise<void> => {
  if (locationLoading.value) return
  locationLoading.value = true
  try {
    const location = await getUserLocation()
    if (!location) return

    const res = await getReverseGeocodeService(location)
    const { success, data } = res ?? {}
    if (!success) return

    formData.value.location = data?.address ?? ''
  } finally {
    locationLoading.value = false
  }
}

const handleSubmit = async (e: any): Promise<void> => {
  if (!validate()) return

  const { code: phoneCode, errMsg } = e?.detail ?? {}
  if (errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '需要手机号授权才能提交', icon: 'none' })
    return
  }

  uni?.vibrateShort()
  loading.value = true

  try {
    const { code } = await new Promise<{ code: string }>((resolve, reject) => {
      uni.login({ success: (res) => resolve(res as { code: string }), fail: reject })
    })

    const { success, data } = await loginService({ code })
    if (!success) {
      uni.showToast({ title: '登录失败，请重试', icon: 'none' })
      return
    }

    const { success: phoneSuccess, data: phoneData } = await getUserPhoneNumberService({
      code: phoneCode,
      openid: data.openid,
    })
    if (!phoneSuccess) {
      uni.showToast({ title: '获取手机号失败', icon: 'none' })
      return
    }

    uni.setStorageSync('userInfo', phoneData)

    const { success: quoteSuccess } = await getQuoteService({
      phone: phoneData?.phone,
      location: formData.value.location,
      houseType: formData.value.houseType,
      roomType: formData.value.roomType,
      area: formData.value.area,
    })

    if (!quoteSuccess) {
      uni.showToast({ title: '提交失败，请稍后重试', icon: 'none' })
      return
    }

    successPopupRef.value?.open('center')
    setTimeout(() => {
      successPopupRef.value?.close()
      wx.navigateBack()
    }, 2000)
  } catch (err) {
    console.error('提交失败:', err)
    uni.showToast({ title: '操作失败，请稍后重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onLoad(() => {
  initLocation()
})
</script>

<style lang="scss" scoped>
/* 参考 labor-price-detail 布局 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

/* ===== 可滚动的头部 ===== */
.header-wrap {
  position: relative;
  width: 100%;
  height: 45vh;
  min-height: 360rpx;
  flex-shrink: 0;
  background: #2d635e;
  overflow: hidden;
}

.hero-deco {
  position: absolute;
  border-radius: 50%;
  opacity: 0.03;
  filter: blur(80rpx);
  -webkit-filter: blur(80rpx);

  &.hero-deco-1 {
    top: -20%;
    right: -20%;
    width: 80vw;
    height: 80vw;
    background: #fff;
  }

  &.hero-deco-2 {
    bottom: -20%;
    left: -20%;
    width: 60vw;
    height: 60vw;
    background: #1a403c;
    opacity: 0.5;
  }
}

/* 固定顶部导航栏（参考 labor-price-detail）*/
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  pointer-events: none;

  .nav-back {
    position: absolute;
    left: 32rpx;
    z-index: 1000;
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    pointer-events: auto;
    background: $uni-bg-color;
  }
}

.hero-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: calc(88rpx + env(safe-area-inset-top)) 32rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.hero-nav-placeholder .nav-spacer {
    width: 80rpx;
  }
}

.nav-title {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.2em;
  font-weight: 300;
}

.nav-spacer {
  width: 80rpx;
}

.hero-content {
  position: absolute;
  top: 224rpx;
  left: 48rpx;
  right: 48rpx;
  z-index: 10;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border-radius: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32rpx;
}

.tag-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #00d2ba;
  box-shadow: 0 0 16rpx rgba(0, 210, 186, 0.5);
}

.tag-text {
  font-size: 22rpx;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: 56rpx;
  font-weight: 300;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 24rpx;

  .title-bold {
    font-weight: 700;
  }
}

.hero-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  max-width: 80%;
}

/* ===== 内容区（与 labor-price-detail 保持一致）===== */
.content-inner {
  position: relative;
  z-index: 2;
  margin-top: -48rpx;
  border-radius: 48rpx 48rpx 0 0;
  overflow: hidden;
  background: #fff;
  padding: 64rpx 40rpx 200rpx;
}

.detail-section {
  margin-bottom: 80rpx;

  .section-title {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 24rpx;

    .title-bar {
      width: 8rpx;
      height: 40rpx;
      background: #2d635e;
      border-radius: 8rpx;
    }

    .title-text {
      font-size: 34rpx;
      font-weight: 700;
      color: #111;

      .required {
        color: $uni-color-error;
        margin-left: 2rpx;
      }
    }
  }
}

.bottom-spacer {
  height: 80rpx;
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

.field-row {
  display: flex;
  gap: 32rpx;
}

.field-block {
  margin-bottom: 0;
  min-width: 0;

  &.half {
    flex: 1;
    min-width: 0;
  }
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

/* ===== 底部按钮 ===== */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx;
  padding-bottom: max(40rpx, env(safe-area-inset-bottom));
  background: linear-gradient(to top, #fff 60%, transparent);
  z-index: 30;
}

.submit-btn {
  width: 100%;
  height: 112rpx;
  background: #2d635e;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16rpx;
  box-shadow: 0 16rpx 48rpx rgba(45, 99, 94, 0.3);
  border: none;
  transition: all 0.2s ease;

  &::after {
    border: none;
  }

  &.loading {
    opacity: 0.85;
  }
}

.btn-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.calc-icon {
  width: 40rpx;
  height: 40rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z'/%3E%3Cpath d='M14 2V8H20'/%3E%3Cpath d='M8 13H10'/%3E%3Cpath d='M14 13H16'/%3E%3Cpath d='M8 17H10'/%3E%3Cpath d='M14 17H16'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.btn-text {
  flex: 1;
  margin-left: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.05em;
  text-align: left;
}

.btn-arrow {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
}

/* 成功弹窗内容（参考 service-request）*/
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
