<template>
  <view class="order-card-wrap">
    <custom-card :show-bottom-margin="true">
      <view class="order-info-card">
        <!-- 订单号 -->
        <view v-if="orderNo" class="order-no-row" @tap.stop="handleCopyOrderNo">
          <text class="row-label">订单号</text>
          <view class="row-value-wrap">
            <text class="row-value">{{ orderNo }}</text>
            <text class="copy-hint">点击复制</text>
          </view>
        </view>

        <!-- 工匠信息卡片（可点击跳转主页） -->
        <view class="craftsman-card" @tap="handleGoCraftsmanProfile">
          <view class="craftsman-main">
            <image class="avatar" :src="craftsman?.avatar || '/static/logo.png'" mode="aspectFill" />
            <view class="craftsman-info">
              <view class="name-wrap">
                <text class="name">{{ craftsman?.nickname || '工匠' }}</text>
                <view class="badges">
                  <view v-if="craftsman?.isVerified" class="badge">
                    <uni-icons type="checkmarkempty" size="10" color="#fff" />
                    <text>实名</text>
                  </view>
                  <view v-if="craftsman?.isSkillVerified" class="badge">
                    <uni-icons type="checkmarkempty" size="10" color="#fff" />
                    <text>技能</text>
                  </view>
                </view>
              </view>
              <view class="meta-list">
                <view class="meta-item">
                  <uni-icons type="phone" size="14" color="#6e7373" />
                  <text>{{ formatPhone(craftsman?.phone) || '暂无' }}</text>
                </view>
                <view v-if="craftsman?.address" class="meta-item">
                  <uni-icons type="location" size="14" color="#6e7373" />
                  <text class="meta-text">{{ craftsman.address }}</text>
                </view>
              </view>
            </view>
          </view>
          <view v-if="craftsman?.id" class="craftsman-footer">
            <text class="footer-link-text">查看主页</text>
            <view class="icon-chevron" />
          </view>
        </view>
      </view>
    </custom-card>

    <construction-progress-card :order-id="orderId" />
  </view>
</template>

<script setup lang="ts">
import CustomCard from '@/components/custom-card.vue'
import ConstructionProgressCard from './construction-progress-card.vue'
import { formatPhone } from '@/utils'

const props = defineProps<{
  craftsman?: {
    id?: number | string
    avatar?: string
    nickname?: string
    phone?: string
    address?: string
    isVerified?: boolean
    isSkillVerified?: boolean
  }
  orderId?: number | string
  orderNo?: string
}>()

const handleCopyOrderNo = (): void => {
  if (!props.orderNo) return
  uni.setClipboardData({
    data: props.orderNo,
    success: () => uni.showToast({ title: '订单号已复制', icon: 'none' }),
    fail: () => uni.showToast({ title: '复制失败', icon: 'none' }),
  })
}

const handleGoCraftsmanProfile = (): void => {
  if (!props.craftsman?.id) return
  uni?.vibrateShort()
  uni.navigateTo({
    url: `/package-mine/craftsman-profile/index?id=${props.craftsman.id}`,
  })
}
</script>

<style lang="scss" scoped>
.order-info-card {
  border-radius: 32rpx;
  overflow: hidden;
  background: #fff;
  border: 2rpx solid #f0f0f0;
  box-shadow: 0 12rpx 48rpx -20rpx rgba(0, 0, 0, 0.08);
}

.order-no-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background: linear-gradient(135deg, rgba($uni-color-primary, 0.06) 0%, rgba($uni-color-primary, 0.02) 100%);
  border-bottom: 2rpx solid $uni-border-color;

  .row-label {
    font-size: 26rpx;
    color: $uni-text-color-grey;
    flex-shrink: 0;
  }

  .row-value-wrap {
    flex: 1;
    min-width: 0;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16rpx;
  }

  .row-value {
    font-size: 26rpx;
    font-weight: 500;
    color: $uni-text-color;
    word-break: break-all;
  }

  .copy-hint {
    font-size: 24rpx;
    color: $uni-color-primary;
    flex-shrink: 0;
  }
}

.craftsman-card {
  padding: 32rpx;

  .craftsman-main {
    display: flex;
    gap: 28rpx;
  }

  .avatar {
    width: 128rpx;
    height: 128rpx;
    border-radius: 24rpx;
    background: linear-gradient(135deg, #e7efec 0%, #e6eaea 100%);
    flex-shrink: 0;
    border: 2rpx solid rgba($uni-color-primary, 0.08);
  }

  .craftsman-info {
    flex: 1;
    min-width: 0;
  }

  .name-wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-bottom: 20rpx;
  }

  .name {
    font-size: 34rpx;
    font-weight: 600;
    color: $uni-text-color;
    letter-spacing: 0.5rpx;
  }

  .badges {
    display: flex;
    gap: 10rpx;
    flex-wrap: wrap;

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4rpx;
      padding: 6rpx 14rpx;
      border-radius: 12rpx;
      font-size: 20rpx;
      color: #fff;
      background: linear-gradient(135deg, $uni-color-primary 0%, #3d7a6e 100%);
      box-shadow: 0 4rpx 12rpx rgba(45, 99, 94, 0.25);
    }
  }

  .meta-list {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 26rpx;
    color: $uni-text-color-grey;

    .meta-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .craftsman-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8rpx;
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 2rpx dashed $uni-border-color;
  }

  .footer-link-text {
    font-size: 26rpx;
    font-weight: 500;
    color: $uni-color-primary;
  }

  .icon-chevron {
    width: 24rpx;
    height: 24rpx;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
