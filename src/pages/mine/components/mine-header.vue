<template>
  <view class="brand-card">
    <view class="brand-row" @tap="openNicknameEditor">
      <view class="avatar-wrap">
        <text class="avatar-text">智</text>
      </view>
      <text class="brand-name">{{ userInfo?.nickname }}</text>
    </view>

    <uni-popup ref="nicknamePopupRef" type="center" :mask-click="true" @maskClick="closeNicknamePopup">
      <view class="nickname-popup" @tap.stop>
        <text class="nickname-popup__title">修改昵称</text>
        <input
          v-model="nicknameDraft"
          class="nickname-popup__input"
          type="nickname"
          maxlength="20"
          placeholder="请输入昵称"
          :cursor-spacing="24"
        />
        <view class="nickname-popup__actions">
          <view class="nickname-popup__btn nickname-popup__btn--cancel" @tap="closeNicknamePopup">
            <text class="nickname-popup__btn-text">取消</text>
          </view>
          <view class="nickname-popup__btn nickname-popup__btn--confirm" @tap="submitNickname">
            <text class="nickname-popup__btn-text nickname-popup__btn-text--light">确定</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <view class="welcome-row">
      <text class="welcome-text">欢迎~ 智惠装新朋友</text>
    </view>

    <view class="points-row">
      <text class="points-num">{{ '' }}</text>
      <view class="points-link" @tap="goToOrder">
        <text class="points-link-text">去下单</text>
        <uni-icons type="right" size="14" color="#A8ADAD" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { updateWechatUserInfoService } from '../service'

const props = defineProps<{
  userInfo?: any
}>()

const emit = defineEmits<{
  updated: []
}>()

const nicknamePopupRef = ref<any>(null)
const nicknameDraft = ref('')

const goToOrder = (): void => {
  uni.switchTab({ url: '/pages/labour-cost/index' })
}

const openNicknameEditor = (): void => {
  if (!props?.userInfo?.nickname) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  nicknameDraft.value = String(props.userInfo?.nickname ?? '')
  nicknamePopupRef.value?.open('center')
}

const closeNicknamePopup = (): void => {
  nicknamePopupRef.value?.close()
}

const submitNickname = async (): Promise<void> => {
  const name = nicknameDraft.value.trim()

  if (!name) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  if (!props?.userInfo?.id) {
    uni.showToast({ title: '用户信息异常', icon: 'none' })
    return
  }

  const {success} = await updateWechatUserInfoService(Number(props?.userInfo?.id), { nickname: name })

  if(!success)return

  const stored = wx.getStorageSync('userInfo') ?? {}
  wx.setStorageSync('userInfo', { ...stored, nickname: name })
  emit('updated')
  closeNicknamePopup()
  uni.showToast({ title: '已更新', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.brand-card {
  background: $uni-bg-color;
  padding: 96rpx 40rpx 40rpx;

  .brand-row {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 48rpx;

    .avatar-wrap {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      background: $uni-color-primary;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-text {
        font-size: 32rpx;
        font-weight: 700;
        color: #fff;
      }
    }

    .brand-name {
      font-size: 32rpx;
      font-weight: 500;
      color: $uni-text-color;
      letter-spacing: 1rpx;
    }
  }

  .nickname-popup {
    width: 600rpx;
    padding: 48rpx 40rpx 40rpx;
    background: $uni-bg-color;
    border-radius: 32rpx;
    box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.15);

    &__title {
      display: block;
      font-size: 34rpx;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: 32rpx;
      text-align: center;
    }

    &__input {
      width: 100%;
      height: 88rpx;
      padding: 0 28rpx;
      box-sizing: border-box;
      font-size: 28rpx;
      color: $uni-text-color;
      background: #f5f6f6;
      border-radius: 16rpx;
      margin-bottom: 40rpx;
    }

    &__actions {
      display: flex;
      gap: 24rpx;
    }

    &__btn {
      flex: 1;
      height: 80rpx;
      border-radius: 999rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &--cancel {
        background: #f0f2f2;
      }

      &--confirm {
        background: $uni-color-primary;
      }
    }

    &__btn-text {
      font-size: 28rpx;
      font-weight: 600;
      color: $uni-text-color;

      &--light {
        color: #fff;
      }
    }
  }

  .welcome-row {
    margin-bottom: 16rpx;

    .welcome-text {
      font-size: 28rpx;
      color: $uni-text-color;
      font-weight: 400;
    }
  }

  .points-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .points-num {
      font-size: 56rpx;
      font-weight: 600;
      color: $uni-text-color;
    }

    .points-link {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .points-link-text {
        font-size: 26rpx;
        color: $uni-text-color-placeholder;
      }
    }
  }
}
</style>
