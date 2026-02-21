<template>
    <view class="header">
        <!-- 背景 -->
        <view class="header-bg">
            <image class="header-bg-img"
                src="https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1771653976757_ifjsjw_photo-1584892905725-bdac5b99e55a.jpeg"
                mode="scaleToFill" />
            <view class="header-bg-overlay" />
        </view>

        <!-- 自定义导航栏 -->
        <view class="nav-bar" :style="navBarStyle">
            <view class="nav-status-bar" :style="statusBarStyle" />
            <view class="nav-content" :style="navContentStyle">
                <view class="nav-left" @tap="goSearch">
                    <view class="search-input">
                        <view class="icon-search" />
                        <text class="search-placeholder">搜索工价/工艺...</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 头部内容 -->
        <view class="header-text" :style="{ top: navHeight + 'px' }">
            <view class="header-badge-row">
                <view class="badge">Official Standard</view>
                <view class="rating">
                    <view class="icon-star" />
                    <text class="rating-num">4.9</text>
                </view>
            </view>

            <text class="header-title">
                智惠装
                <text class="title-block">标准工价手册</text>
            </text>

            <view class="header-desc">
                <view class="icon-check" />
                <text>公开透明 · 拒绝增项</text>
            </view>
        </view>
    </view>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const goSearch = (): void => {
    uni.navigateTo({ url: '/package-labor-cost/labor-price-search/index' })
}

const statusBarHeight = ref(0)
const navContentHeight = ref(44)
const capsuleRight = ref(0)

const navHeight = computed(
    () => statusBarHeight.value + navContentHeight.value
)

const navBarStyle = computed(() => ({
    height: `${navHeight.value}px`
}))

const statusBarStyle = computed(() => ({
    height: `${statusBarHeight.value}px`
}))

const navContentStyle = computed(() => ({
    height: `${navContentHeight.value}px`,
    paddingRight: `${capsuleRight.value}px`
}))

onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    const menuButton = wx.getMenuButtonBoundingClientRect()

    statusBarHeight.value = systemInfo.statusBarHeight ?? 0

    const gap = menuButton.top - statusBarHeight.value

    navContentHeight.value = menuButton.height + gap * 2

    capsuleRight.value = systemInfo.windowWidth - menuButton.left
})
</script>


<style lang="scss" scoped>
.header {
    position: relative;
    height: 40vh;
    min-height: 500rpx;
    overflow: hidden;
}

/* 背景 */
.header-bg {
    position: absolute;
    inset: 0;
}

.header-bg-img {
    width: 100%;
    height: 100%;
    opacity: 0.95;
    filter: grayscale(20%);
}

.header-bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
            rgba(0, 0, 0, 0.6),
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.6));
}

/* 导航 */
.nav-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
}

.nav-content {
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.nav-left {
    flex: 1;
    padding: 0 48rpx;
}

.search-input {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx 32rpx;
    border-radius: 999rpx;

    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.icon-search {
    width: 28rpx;
    height: 28rpx;
    flex-shrink: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.search-placeholder {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
}

/* 头部文字 */
.header-text {
    position: absolute;
    left: 48rpx;
    z-index: 10;
    max-width: 80%;
    padding-top: 48rpx;
}

.header-badge-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
}

.badge {
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    font-size: 20rpx;
    font-weight: 700;
    letter-spacing: 2rpx;
    color: rgba(255, 255, 255, 0.9);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
}

.rating {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.icon-star {
    width: 22rpx;
    height: 22rpx;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23EAB308' stroke='%23EAB308' stroke-width='2'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
}

.rating-num {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.9);
}

.header-title {
    display: block;
    font-size: 60rpx;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    letter-spacing: 2rpx;
    margin-bottom: 16rpx;
}

.title-block {
    display: block;
}

.header-desc {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
}

.icon-check {
    width: 24rpx;
    height: 24rpx;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%234ADE80' stroke-width='2.5'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/%3E%3Cpolyline points='22 4 12 14.01 9 11.01'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
}
</style>
