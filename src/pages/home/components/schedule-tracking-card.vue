<template>
  <view class="schedule-card" @tap="handleDetail">
    <view class="card-inner">
      <view class="card-body">
        <!-- Left Text -->
        <view class="text-section">
          <view class="card-title">工期准时</view>
          <view class="card-subtitle">标准节点管理 · 进度可查</view>
          <view class="card-desc">
            施工按标准节点执行，进度实时记录，延期规则明确。
          </view>
          <view class="card-badge">
            <view class="badge-dot" />
            <text class="badge-text">平台监督节点验收</text>
          </view>
        </view>

        <!-- Right Visual - Timeline -->
        <view class="timeline-wrap">
          <view class="timeline-card">
            <view class="timeline-inner">
              <view class="timeline-line" />
              <view class="timeline-nodes">
                <!-- Node 1: Completed -->
                <view class="timeline-node">
                  <view class="node-dot node-dot-done">
                    <view class="node-check" />
                  </view>
                  <text class="node-label node-label-done">开工交底</text>
                </view>
                <!-- Node 2: Current -->
                <view class="timeline-node">
                  <view class="node-dot node-dot-current" />
                  <text class="node-label node-label-current">水电验收</text>
                </view>
                <!-- Node 3: Pending -->
                <view class="timeline-node timeline-node-pending">
                  <view class="node-dot node-dot-pending" />
                  <text class="node-label node-label-pending">泥木验收</text>
                </view>
                <!-- Node 4: Pending -->
                <view class="timeline-node timeline-node-pending">
                  <view class="node-dot node-dot-pending" />
                  <text class="node-label node-label-pending">完工交付</text>
                </view>
              </view>
            </view>
          </view>
          <view class="timeline-bg" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleDetail = (): void => {
  uni.navigateTo({ url: '/package-home/schedule-tracking/index' })
}
</script>

<style lang="scss" scoped>
.schedule-card {
  margin: 0 24rpx 36rpx;
}

.card-inner {
  border-radius: 24rpx;
  overflow: hidden;
  background: #fff;
  border: 2rpx solid #f0f0f0;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.03);
}

.card-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 40rpx;
}

.text-section {
  flex: 1;
  padding-right: 32rpx;
  padding-top: 8rpx;
  z-index: 10;
}

.card-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1e2222;
  margin-bottom: 8rpx;
}

.card-subtitle {
  font-size: 26rpx;
  color: #2d635e;
  font-weight: 500;
  margin-bottom: 24rpx;
}

.card-desc {
  font-size: 22rpx;
  color: #8a8f8f;
  line-height: 1.625;
  letter-spacing: 0.5rpx;
  margin-bottom: 24rpx;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 16rpx;
  background: #f5f7f6;
  border-radius: 8rpx;
}

.badge-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #2d635e;
}

.badge-text {
  font-size: 20rpx;
  color: #6e7373;
}

/* Right Timeline */
.timeline-wrap {
  width: 200rpx;
  flex-shrink: 0;
  position: relative;
}

.timeline-card {
  background: #fff;
  border: 2rpx solid #f0f0f0;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
  padding: 24rpx;
  position: relative;
  z-index: 10;
}

.timeline-inner {
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 10rpx;
  top: 12rpx;
  bottom: 12rpx;
  width: 2rpx;
  background: #e6eaea;
  z-index: 0;
}

.timeline-nodes {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.timeline-node {
  display: flex;
  align-items: center;
  gap: 16rpx;
  position: relative;
  z-index: 1;
}

.timeline-node-pending {
  opacity: 0.6;
}

.node-dot {
  width: 22rpx;
  height: 22rpx;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-dot-done {
  background: #2d635e;
  border: 4rpx solid #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.node-check {
  width: 12rpx;
  height: 12rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='2 6 4.5 9 10 3'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.node-dot-current {
  background: #fff;
  border: 4rpx solid #2d635e;
}

.node-dot-pending {
  background: #f5f7f6;
  border: 4rpx solid #e6eaea;
}

.node-label {
  font-size: 20rpx;
}

.node-label-done {
  color: #9ca3af;
  text-decoration: line-through;
}

.node-label-current {
  color: #2d635e;
  font-weight: 700;
}

.node-label-pending {
  color: #a8adad;
}

.timeline-bg {
  position: absolute;
  top: 16rpx;
  right: -16rpx;
  width: 100%;
  height: 100%;
  background: #f9fafb;
  border-radius: 20rpx;
  border: 2rpx solid #f0f0f0;
  z-index: -1;
}
</style>
