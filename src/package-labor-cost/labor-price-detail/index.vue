<template>
  <view class="container">
    <!-- 滚动容器 -->
    <scroll-view class="scroll-view" scroll-y :scroll-top="scrollTop">
      <!-- 可滚动的 Header（图片随滚动） -->
      <view class="header-wrap">
        <image :src="item?.display_images[0] || DEFAULT_IMAGE" class="header-img" mode="aspectFill" />
        <view class="header-overlay" />

        <!-- 底部标题区域（随图滚动） -->
        <view v-if="item" class="header-bottom">
          <view class="trade-badge">
            <text class="trade-text">{{ item.work_kind?.title }}</text>
            <view class="badge-dot" />
            <text class="trade-text">标准工艺</text>
          </view>
          <text class="header-title">{{ item.work_title }}</text>
          <text class="header-desc">{{ item.description || item.serviceScope }}</text>
        </view>
      </view>

      <!-- 内容区 -->
      <view v-if="item" class="content-inner">
        <!-- 价格卡片 -->
        <view class="price-section">
          <view class="price-left">
            <text class="price-label">平台指导价</text>
            <view class="price-row">
              <text class="price-symbol">¥</text>
              <text class="price-num">{{ item.work_price }}</text>
              <text class="price-unit">/ {{ item.labour_cost.labour_cost_name }}</text>
            </view>
          </view>
          <view class="price-badge">
            <uni-icons custom-prefix="iconfont" type="icon-anquanbaozhang" size="12" color="#2D635E" />
            <text>价格透明 · 无隐形消费</text>
          </view>
        </view>

        <!-- 计价说明 -->
        <section class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">计价说明</text>
          </view>
          <view class="pricing-note">{{ item.pricing_description }}</view>
        </section>

        <!-- 服务范围 -->
        <section class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">服务范围</text>
          </view>
          <text class="service-scope">{{ item.service_scope }}</text>
        </section>

        <!-- 验收标准 -->
        <section v-if="item.service_details?.length" class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">验收标准</text>
          </view>
          <view class="standards-list">
            <view v-for="(std, idx) in item.service_details" :key="idx" class="standard-item">
              <uni-icons custom-prefix="iconfont" type="icon-wancheng" size="18" color="#2D635E" />
              <text class="standard-text">{{ std.service_desc }}</text>
            </view>
          </view>
        </section>

        <!-- 质保承诺 -->
        <section class="warranty-section">
          <uni-icons custom-prefix="iconfont" type="icon-anquanbaozhang" size="24" color="#2D635E" />
          <view class="warranty-content">
            <text class="warranty-title">平台质保承诺</text>
            <text class="warranty-desc">
              所有通过平台预约的工匠服务，均享受平台先行赔付保障。施工质量问题若不达标，无条件返工直至满意。
            </text>
          </view>
        </section>

        <view class="bottom-spacer" />
      </view>
    </scroll-view>

    <!-- 固定顶部导航栏（sticky）-->
    <view class="sticky-header">
      <view class="nav-back" @tap="goBack" :style="{ top: `${navBackTop}px` }">
        <uni-icons type="left" size="22" color="#1e2222" />
      </view>
    </view>

    <!-- 底部固定操作栏 -->
    <view class="footer-bar">
      <view class="footer-left">
        <text class="footer-label">预估总价</text>
        <text class="footer-value">待量房后确认</text>
      </view>
      <button class="footer-btn" @tap="goBook">
        <text>预约此服务</text>
        <uni-icons type="arrow-right" size="16" color="#fff" />
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getWorkTypeDetailService } from './service'

// 默认图片常量
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'

// 响应式数据
const item = ref<any>({})
const scrollTop = ref(0)

// 精准计算返回按钮垂直位置（仅微信小程序）
const navBackTop = computed(() => {
  try {
    const sys = uni.getSystemInfoSync()
    const menuButton = wx.getMenuButtonBoundingClientRect()
    const capsuleCenterY = menuButton.top + menuButton.height / 2
    const containerSizePx = (72 * sys.windowWidth) / 750 // 72rpx 转 px
    return Math.max(capsuleCenterY - containerSizePx / 2, 10)
  } catch {
    console.warn('Failed to get menu button rect, using fallback')
    return (48 * uni.getSystemInfoSync().windowWidth) / 750
  }
})

// 页面加载
onLoad(async (options) => {
  if (options?.id) {
    const { data, success } = await getWorkTypeDetailService(options?.id)
    if (success) {
      item.value = data
    }
  }
})

// 返回上一页
const goBack = (): void => {
  uni.navigateBack()
}

// 跳转填写服务需求页
const goBook = (): void => {
  if (!item.value) return
  uni.navigateTo({
    url: `/package-labor-cost/service-request/index?id=${item.value.id}&work_kind_name=${item.value.work_kind?.title}`
  })
}
</script>

<style lang="scss" scoped>
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

/* === 可滚动的 Header === */
.header-wrap {
  position: relative;
  width: 100%;
  height: 600rpx;
  flex-shrink: 0;

  .header-img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .header-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top,
        rgba(0, 0, 0, 0.8),
        rgba(0, 0, 0, 0.2),
        transparent);
  }

  .header-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40rpx 40rpx 64rpx;
    z-index: 2;

    .trade-badge {
      display: inline-flex;
      align-items: center;
      gap: 12rpx;
      padding: 8rpx 16rpx;
      border-radius: 12rpx;
      background: #2d635e;
      margin-bottom: 24rpx;

      .trade-text {
        font-size: 22rpx;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.95);
      }

      .badge-dot {
        width: 4rpx;
        height: 20rpx;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 4rpx;
      }
    }

    .header-title {
      display: block;
      font-size: 48rpx;
      font-weight: 700;
      color: #fff;
      letter-spacing: 2rpx;
      margin-bottom: 16rpx;
    }

    .header-desc {
      display: block;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.content-inner {
  position: relative;
  z-index: 2;
  margin-top: -48rpx;
  border-radius: 48rpx 48rpx 0 0;
  overflow: hidden;
  background: #fff;
  padding: 64rpx 40rpx 200rpx;

  .price-section {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 48rpx;
    margin-bottom: 48rpx;
    border-bottom: 2rpx solid #f0f0f0;

    .price-left {
      flex: 1;

      .price-label {
        display: block;
        font-size: 24rpx;
        color: #888;
        font-weight: 500;
        margin-bottom: 8rpx;
      }

      .price-row {
        display: flex;
        align-items: baseline;
        gap: 8rpx;

        .price-symbol {
          font-size: 32rpx;
          font-weight: 700;
          color: #2d635e;
        }

        .price-num {
          font-size: 72rpx;
          font-weight: 700;
          font-family: ui-monospace, monospace;
          color: #2d635e;
          letter-spacing: -2rpx;
          line-height: 1;
        }

        .price-unit {
          font-size: 28rpx;
          color: #666;
          margin-left: 8rpx;
        }
      }
    }

    .price-badge {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 12rpx 20rpx;
      background: rgba(45, 99, 94, 0.05);
      border: 2rpx solid rgba(45, 99, 94, 0.1);
      border-radius: 16rpx;
      font-size: 22rpx;
      color: #2d635e;
    }
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
      }
    }

    .pricing-note {
      padding: 32rpx;
      background: #f9fafb;
      border-radius: 24rpx;
      font-size: 28rpx;
      color: #555;
      line-height: 1.6;
      border: 2rpx solid #f0f0f0;
    }

    .service-scope {
      font-size: 28rpx;
      color: #555;
      line-height: 1.8;
      text-align: justify;
    }

    .standards-list {
      display: flex;
      flex-direction: column;
      gap: 24rpx;

      .standard-item {
        display: flex;
        align-items: flex-start;
        gap: 24rpx;

        uni-icons {
          flex-shrink: 0;
          margin-top: 4rpx;
        }

        .standard-text {
          flex: 1;
          font-size: 28rpx;
          color: #555;
          line-height: 1.6;
        }
      }
    }
  }

  .warranty-section {
    display: flex;
    align-items: flex-start;
    gap: 24rpx;
    padding: 40rpx;
    background: linear-gradient(135deg,
        rgba(45, 99, 94, 0.05),
        rgba(45, 99, 94, 0.1));
    border-radius: 32rpx;
    border: 2rpx solid rgba(45, 99, 94, 0.1);

    uni-icons {
      flex-shrink: 0;
    }

    .warranty-content {
      flex: 1;

      .warranty-title {
        display: block;
        font-size: 30rpx;
        font-weight: 700;
        color: #2d635e;
        margin-bottom: 12rpx;
      }

      .warranty-desc {
        font-size: 24rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }

  .bottom-spacer {
    height: 80rpx;
  }
}

/* === Sticky 顶部导航栏 === */
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

/* === 底部操作栏 === */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 990;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 40rpx;
  padding-bottom: max(24rpx, env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(12rpx);
  backdrop-filter: blur(12rpx);
  border-top: 2rpx solid #f0f0f0;
  box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.03);

  .footer-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .footer-label {
      font-size: 22rpx;
      color: #999;
    }

    .footer-value {
      font-size: 30rpx;
      font-weight: 700;
      color: #222;
    }
  }

  .footer-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    padding: 28rpx 64rpx;
    background: #2d635e;
    color: #fff;
    border: none;
    border-radius: 999rpx;
    font-size: 30rpx;
    font-weight: 500;
    box-shadow: 0 16rpx 48rpx rgba(45, 99, 94, 0.25);
    line-height: 1;

    &::after {
      border: none;
    }
  }
}
</style>