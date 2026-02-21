<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y>
      <!-- 顶部品牌区 -->
      <mine-header :points="0" :userInfo="userInfo" />

      <!-- 我的装修（核心区域） -->
      <mine-renovation />

      <!-- 施工保障 -->
      <view class="section guarantee-section" @tap="goToGuarantee">
        <view class="guarantee-inner">
          <view class="guarantee-left">
            <text class="guarantee-label">施工保障</text>
            <text class="guarantee-status">已开启</text>
          </view>
          <view class="guarantee-btn">
            <text class="guarantee-btn-text">查看详情</text>
          </view>
        </view>
      </view>

      <!-- 我的优惠 -->
      <view class="section coupon-section" @tap="goToCoupons">
        <view class="coupon-row">
          <view class="coupon-left">
            <uni-icons type="gift" size="16" color="#1E2222" />
            <text class="coupon-title">我的优惠</text>
          </view>
          <view class="coupon-right">
            <text class="coupon-count">0 张</text>
            <uni-icons type="right" size="14" color="#D0D5D5" />
          </view>
        </view>
      </view>

      <!-- 服务支持 -->
      <mine-support @message-list="goToMessageList" @material-tracking="goToMaterialTracking"
        @schedule-tracking="goToScheduleTracking" @call-service="callService" />

      <!-- 隐私与条款 -->
      <view v-if="userInfo?.nickname" class="section privacy-section">
        <view class="list-item" @tap="goToPrivacy">
          <view class="list-left">
            <uni-icons type="compose" size="16" color="#A8ADAD" />
            <text class="list-text list-text-grey">隐私与条款</text>
          </view>
          <uni-icons type="right" size="14" color="#D0D5D5" />
        </view>
      </view>

      <!-- 退出登录 / 去登录 -->
      <view class="section logout-section">
        <view class="logout-btn" @tap="handleAuthAction">
          <uni-icons type="auth" size="16" color="#C0C5C5" />
          <text class="logout-text">{{ userInfo?.nickname ? '退出登录' : '去登录' }}</text>
        </view>
      </view>

      <!-- 底部版本信息 -->
      <view class="version-wrap">
        <text class="version-text">智惠装 v1.0.0</text>
      </view>
      <view class="scroll-bottom" />
    </scroll-view>
    <custom-tab-bar selected="3" />
  </view>
</template>

<script setup lang="ts">
import CustomTabBar from '@/components/custom-tab-bar.vue'
import MineHeader from './components/mine-header.vue'
import MineRenovation from './components/mine-renovation.vue'
import MineSupport from './components/mine-support.vue'

const userInfo = ref<any>({})

// 页面显示时加载用户信息
onShow(() => {
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = (): void => {
  const data = wx.getStorageSync('userInfo')
  if (data) {
    userInfo.value = { ...data }
  }
  console.log(data, 'userInfo')
}

// 登录/登出统一入口（点击时根据当前状态决定）
const handleAuthAction = (): void => {
  if (userInfo.value?.nickname) {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmColor: '#2d635e', // 主题色
      success: ({ confirm }) => {
        if (!confirm) return
        wx.removeStorageSync('userInfo')
        wx.navigateTo({
          url: '/pages/login/index',
        })
      },
    })
  } else {
    wx.navigateTo({ url: '/pages/login/index' })
  }
}

const goToGuarantee = (): void => {
  uni.navigateTo({ url: '/package-home/construction-guarantee/index' })
}

const goToCoupons = (): void => {
  uni.showToast({ title: '敬请期待', icon: 'none' })
}

const goToMessageList = (): void => {
  uni.navigateTo({ url: '/package-mine/message-list/index' })
}

const goToMaterialTracking = (): void => {
  uni.navigateTo({ url: '/package-home/material-transparency/index' })
}

const goToScheduleTracking = (): void => {
  uni.navigateTo({ url: '/package-home/schedule-tracking/index' })
}

const callService = (): void => {
  uni.navigateTo({ url: '/package-mine/customer-service/index' })
}

const goToPrivacy = (): void => {
  uni.showToast({ title: '敬请期待', icon: 'none' })
}
</script>

<style lang="scss" scoped>
page {
  height: 100vh;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

.scroll-bottom {
  height: 200rpx;
}

// 通用区块基础样式
.section {
  margin-top: 24rpx;
  background: $uni-bg-color;

  // 施工保障
  &.guarantee-section {
    padding: 40rpx;

    .guarantee-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .guarantee-left {
        display: flex;
        flex-direction: column;

        .guarantee-label {
          font-size: 24rpx;
          color: $uni-text-color-placeholder;
          margin-bottom: 16rpx;
        }

        .guarantee-status {
          font-size: 40rpx;
          font-weight: 600;
          color: $uni-color-primary;
        }
      }

      .guarantee-btn {
        padding: 16rpx 32rpx;
        border-radius: 999rpx;
        background: $uni-text-color;

        .guarantee-btn-text {
          font-size: 24rpx;
          font-weight: 500;
          color: $uni-bg-color;
        }
      }
    }
  }

  // 我的优惠
  &.coupon-section {
    padding: 32rpx 40rpx;

    .coupon-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .coupon-left {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .coupon-title {
          font-size: 28rpx;
          font-weight: 400;
          color: $uni-text-color;
        }
      }

      .coupon-right {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .coupon-count {
          font-size: 26rpx;
          color: $uni-text-color-placeholder;
        }
      }
    }
  }

  // 隐私与条款
  &.privacy-section {
    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 40rpx;

      .list-left {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .list-text {
          font-size: 28rpx;
          color: $uni-text-color;

          &.list-text-grey {
            color: $uni-text-color-grey;
          }
        }
      }
    }
  }

  // 退出登录
  &.logout-section {
    padding: 0;

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16rpx;
      padding: 32rpx;

      .logout-text {
        font-size: 28rpx;
        color: $uni-text-color-disable;
      }
    }
  }
}

// 版本信息（不属于 section）
.version-wrap {
  padding: 48rpx 40rpx 64rpx;
  text-align: center;

  .version-text {
    font-size: 22rpx;
    color: $uni-text-color-disable;
    letter-spacing: 0.6rpx;
  }
}
</style>
