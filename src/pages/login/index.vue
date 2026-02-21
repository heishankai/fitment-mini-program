<template>
  <view class="login-page">
    <!-- Background - top half -->
    <view class="bg-wrap">
      <image
        class="bg-image"
        src="https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771657850243_av2n9g_photo-1600210492493-0946911123ea.jpeg"
        mode="aspectFill"
      />
      <view class="bg-overlay" />
    </view>

    <!-- Content -->
    <view class="content">
      <!-- Logo and Title -->
      <view class="brand-section">
        <view class="logo-wrap">
          <view class="logo-box">
            <image class="logo-img" src="/static/logo.png" mode="aspectFit" />
          </view>
        </view>
        <text class="brand-title">智惠装</text>
        <view class="title-divider" />
        <text class="brand-subtitle">装修直连工匠与工长</text>
      </view>

      <!-- Login card -->
      <view class="login-section">
        <!-- Features -->
        <view class="feature-list">
          <view v-for="(item, index) in features" :key="index" class="feature-item">
            <view class="feature-icon-wrap">
              <uni-icons type="checkmarkempty" size="14" color="#2D635E" />
            </view>
            <text class="feature-text">{{ item.text }}</text>
          </view>
        </view>

        <!-- Login Button -->
        <view class="btn-wrap">
          <button class="login-btn" open-type="getPhoneNumber" @getphonenumber="handlePhoneLogin">
            <text class="btn-text">一键登录</text>
            <uni-icons type="arrow-right" size="20" color="#fff" />
          </button>
        </view>

        <!-- Terms -->
        <view class="terms">
          <text class="terms-text">登录即代表同意</text>
          <text class="terms-link">《用户协议》</text>
          <text class="terms-text">和</text>
          <text class="terms-link">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { loginService, getUserPhoneNumberService } from './service'

const features = [
  { text: '平台认证工匠，安全可靠' },
  { text: '价格透明，无隐形消费' },
  { text: '售后保障，平台兜底' },
]

const handlePhoneLogin = async (e: any): Promise<void> => {
  const { code: phoneCode, errMsg } = e?.detail ?? {}

  if (errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '需要手机号授权才能登录', icon: 'none' })
    return
  }

  uni.showLoading({ title: '登录中...', mask: true })

  try {
    // 先获取登录凭证
    const { code } = await new Promise<{ code: string }>((resolve, reject) => {
      uni.login({
        success: (res) => resolve(res as { code: string }),
        fail: (err) => reject(err),
      })
    })

    // 调用后端接口登录 获取用户信息
    const { success, data } = await loginService({ code })

    if (!success) {
      uni.showToast({ title: '登录失败', icon: 'none' })
      return
    }

    // 调用后端接口解密手机号
    const { success: phoneSuccess, data: phoneData } = await getUserPhoneNumberService({
      code: phoneCode,
      openid: data.openid,
    })

    if (!phoneSuccess) {
      uni.showToast({ title: '获取手机号失败', icon: 'none' })
      return
    }

    uni.setStorageSync('userInfo', phoneData)
    uni.navigateBack()
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  background: #fff;
  overflow: hidden;
}

.bg-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
}

.bg-image {
  width: 100%;
  height: 100%;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(255, 255, 255, 1) 100%
  );
}

.content {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 48rpx;
}

.brand-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0 64rpx;
}

.logo-wrap {
  margin-bottom: 32rpx;
}

.logo-box {
  width: 128rpx;
  height: 128rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx;
}

.logo-img {
  width: 100%;
  height: 100%;
}

.brand-title {
  font-size: 80rpx;
  font-weight: 300;
  color: $uni-color-primary;
  letter-spacing: 0.2em;
  margin-bottom: 24rpx;
}

.title-divider {
  width: 64rpx;
  height: 2rpx;
  background: rgba($uni-color-primary, 0.3);
  margin-bottom: 32rpx;
}

.brand-subtitle {
  font-size: 36rpx;
  color: rgba(#444a4a, 0.6);
  letter-spacing: 0.1em;
}

.login-section {
  background: #fff;
  padding-bottom: 64rpx;
}

.feature-list {
  margin-bottom: 64rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 32rpx;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon-wrap {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba($uni-color-primary, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-text {
  font-size: 28rpx;
  color: rgba(#444a4a, 0.7);
}

.btn-wrap {
  margin-bottom: 48rpx;
}

.login-btn {
  width: 100%;
  height: 112rpx;
  background: $uni-color-primary;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  border: none;

  &::after {
    border: none;
  }
}

.btn-text {
  font-size: 32rpx;
  color: #fff;
  letter-spacing: 0.1em;
}

.terms {
  text-align: center;
}

.terms-text {
  font-size: 24rpx;
  color: rgba(#444a4a, 0.4);
}

.terms-link {
  font-size: 24rpx;
  color: $uni-color-primary;
}
</style>
