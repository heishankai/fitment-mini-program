<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y :show-scrollbar="false">
      <!-- 可滚动的 Header（轮播图 + 底部文字，参考工价详情） -->
      <view class="header-wrap">
        <swiper class="header-swiper" :indicator-dots="carouselImages.length > 1" :autoplay="carouselImages.length > 1"
          :circular="true" :duration="500" :interval="3000">
          <swiper-item v-for="(img, idx) in carouselImages" :key="idx">
            <image class="header-img" :src="img" mode="aspectFill" @tap="handlePreviewCarousel(idx)" />
          </swiper-item>
        </swiper>
        <view class="header-overlay" />
        <view v-if="productDetail" class="header-bottom">
          <view class="trade-badge">
            <text class="trade-text">{{ productDetail.category_name || '辅材' }}</text>
            <view class="badge-dot" />
            <text class="trade-text">官方正品</text>
          </view>
          <text class="header-title">{{ productDetail.commodity_name }}</text>
        </view>
      </view>

      <!-- 内容区 -->
      <view v-if="productDetail" class="content-inner">
        <!-- 价格卡片 -->
        <view class="price-section">
          <view class="price-left">
            <text class="price-label">参考价格</text>
            <view class="price-row">
              <text class="price-symbol">¥</text>
              <text class="price-num">{{ productDetail.commodity_price }}</text>
              <text class="price-unit">/ {{ productDetail.commodity_unit || '件' }}</text>
            </view>
          </view>
          <view class="price-badge">
            <uni-icons custom-prefix="iconfont" type="icon-anquanbaozhang" size="12" color="#2D635E" />
            <text>假一赔三 · 正品保障</text>
          </view>
        </view>

        <!-- 规格网格 -->
        <section class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">产品规格</text>
          </view>
          <view class="specs-grid">
            <view v-for="(spec, idx) in displaySpecs" :key="idx" class="spec-item">
              <text class="spec-label">{{ spec.label }}</text>
              <text class="spec-value">{{ spec.value }}</text>
            </view>
          </view>
        </section>

        <!-- 智惠严选逻辑 -->
        <section class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">智惠严选逻辑</text>
          </view>
          <view class="pricing-note">
            智惠装始终坚持“隐蔽工程不隐患”的选品原则。我们深入产业源头，以严苛标准甄选每一件辅材，确保其在环保性、耐用度及工艺细节上均达到行业顶尖水平。只为在您看不见的地方，提供看得见的长久守护。
          </view>
        </section>

        <!-- 服务保障 -->
        <section v-if="productDetail.service_guarantee" class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">服务保障</text>
          </view>
          <view class="pricing-note">{{ productDetail.service_guarantee }}</view>
        </section>

        <!-- 商品详情图 -->
        <section v-if="productDetail.commodity_details?.length" class="detail-section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">商品详情</text>
          </view>
          <view v-for="(item, index) in productDetail.commodity_details" :key="index" class="detail-item">
            <view v-if="item.title" class="detail-item-title">{{ item.title }}</view>
            <image v-for="(img, imgIndex) in item.image || []" :key="imgIndex" class="detail-image" :src="img"
              mode="widthFix" @tap="handlePreviewImage(img, item.image)" />
            <view v-if="item.desc" class="detail-desc">{{ item.desc }}</view>
          </view>
        </section>

        <!-- 质保承诺 -->
        <section class="warranty-section">
          <uni-icons custom-prefix="iconfont" type="icon-anquanbaozhang" size="24" color="#2D635E" />
          <view class="warranty-content">
            <text class="warranty-title">平台质保承诺</text>
            <text class="warranty-desc">
              所有通过平台选购的辅材，均享受平台先行赔付保障。材料质量问题若不达标，无条件退换直至满意。
            </text>
          </view>
        </section>

        <view class="bottom-spacer" />
      </view>
    </scroll-view>

    <!-- 固定顶部返回按钮（参考工价详情） -->
    <view class="sticky-header">
      <view class="nav-back" @tap="goBack" :style="{ top: `${navBackTop}px` }">
        <uni-icons type="left" size="22" color="#1e2222" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { previewImage } from '@/utils'
import { getCommodityDetailService } from './service'

const productDetail = ref<any>(null)

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'

const carouselImages = computed(() => {
  const imgs = productDetail.value?.commodity_images || productDetail.value?.commodity_cover || []
  const arr = Array.isArray(imgs) ? imgs : imgs ? [imgs] : []
  return arr.length > 0 ? arr : [DEFAULT_IMAGE]
})

const navBackTop = computed(() => {
  try {
    const sys = uni.getSystemInfoSync()
    const menuButton = (wx as any).getMenuButtonBoundingClientRect()
    const capsuleCenterY = menuButton.top + menuButton.height / 2
    const containerSizePx = (72 * sys.windowWidth) / 750
    return Math.max(capsuleCenterY - containerSizePx / 2, 10)
  } catch {
    return (48 * uni.getSystemInfoSync().windowWidth) / 750
  }
})

const displaySpecs = computed(() => {
  const raw = productDetail.value?.specs || productDetail.value?.commodity_specs
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((s: any) => ({ label: s.label || s.name, value: s.value || s.desc || '' }))
  }
  return [
    { label: '规格', value: productDetail.value?.commodity_unit ? `标准/${productDetail.value.commodity_unit}` : '标准规格' },
    { label: '材质', value: '优选材质' },
    { label: '品类', value: productDetail.value?.category_name || '—' },
    { label: '保障', value: productDetail.value?.service_guarantee || '平台质保' },
  ]
})

const goBack = (): void => {
  uni.navigateBack()
}

const loadProductDetail = async (id: string): Promise<void> => {
  const { success, data } = await getCommodityDetailService(id)
  if (!success) return
  productDetail.value = data
}

const handlePreviewCarousel = (index: number): void => {
  const images = carouselImages.value.filter(Boolean)
  if (images.length === 0) return
  previewImage(images[index] || images[0], images)
}

const handlePreviewImage = (currentImage: string, images: string[]): void => {
  const allImages = productDetail.value?.commodity_details?.flatMap((item: any) => item.image || []) || []
  previewImage(currentImage, allImages.length > 0 ? allImages : images || [])
}

onLoad((options: any) => {
  const id = options?.id || ''
  if (id) loadProductDetail(String(id))
})
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

/* === 可滚动的 Header（轮播图，比工价详情略小）=== */
.header-wrap {
  position: relative;
  width: 100%;
  height: 500rpx;
  flex-shrink: 0;

  .header-swiper {
    width: 100%;
    height: 100%;
  }

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
    }
  }
}

/* === 内容区（参考工价详情）=== */
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

    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24rpx 16rpx;

      .spec-item {
        display: flex;
        flex-direction: column;
        border-left: 4rpx solid #f5f5f5;
        padding-left: 24rpx;

        .spec-label {
          font-size: 22rpx;
          color: #999;
          margin-bottom: 8rpx;
        }

        .spec-value {
          font-size: 28rpx;
          font-weight: 500;
          color: #222;
        }
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

    .detail-item {
      margin-top: 24rpx;

      &:first-child {
        margin-top: 0;
      }

      .detail-item-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #1e2222;
        margin-bottom: 16rpx;
      }

      .detail-image {
        width: 100%;
        border-radius: 24rpx;
        margin-bottom: 24rpx;
        overflow: hidden;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      .detail-desc {
        font-size: 28rpx;
        color: #555;
        line-height: 1.8;
        white-space: pre-line;
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

/* === Sticky 顶部返回按钮（参考工价详情）=== */
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
    background: #fff;
  }
}
</style>
