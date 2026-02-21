<template>
  <scroll-view class="page" scroll-y>
    <!-- 1. Hero Section -->
    <section class="section section-hero">
      <view class="section-inner">
        <view class="hero-header">
          <view class="hero-title">工期准时机制</view>
          <view class="hero-subtitle">
            <text class="subtitle-main">标准节点管理，进度实时可查</text>
            <text class="subtitle-sub">杜绝传统装修"工期拖延、进度不明"的通病</text>
          </view>
        </view>

        <view class="promise-grid">
          <view class="promise-card">
            <view class="promise-icon icon-clock" />
            <view class="promise-title">标准工期</view>
            <view class="promise-desc">严格按节点执行</view>
          </view>
          <view class="promise-card">
            <view class="promise-icon icon-shield" />
            <view class="promise-title">延期赔付</view>
            <view class="promise-desc">写入合同有保障</view>
          </view>
        </view>
      </view>
    </section>

    <view class="divider" />

    <!-- 2. 标准工期可视化 -->
    <section class="section section-timeline">
      <view class="section-inner">
        <view class="section-heading">
          <view class="heading-icon icon-calendar" />
          <text class="heading-text">科学排期，节点透明</text>
        </view>

        <view class="timeline-wrap">
          <view class="timeline-line" />
          <view
            v-for="(item, i) in timelineItems"
            :key="i"
            class="timeline-item"
          >
            <view
              class="timeline-dot"
              :class="{ 'timeline-dot-active': item.active }"
            >
              <view v-if="item.active" class="dot-inner" />
            </view>
            <view
              class="timeline-content"
              :class="{ 'timeline-content-active': item.active }"
            >
              <view class="content-header">
                <view
                  class="content-title"
                  :class="{ 'content-title-active': item.active }"
                >
                  {{ item.name }}
                </view>
                <view class="content-days">{{ item.days }}</view>
              </view>
              <view class="content-desc">{{ item.desc }}</view>
              <view v-if="item.active" class="content-tags">
                <text class="tag">强弱电间距</text>
                <text class="tag">水管打压</text>
                <text class="tag">拍照留底</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </section>

    <view class="divider" />

    <!-- 3. 进度查看路径 -->
    <section class="section section-visibility">
      <view class="section-inner">
        <view class="section-heading">
          <view class="heading-icon icon-search" />
          <text class="heading-text">进度去哪看？</text>
        </view>

        <view class="visibility-body">
          <view class="visibility-steps">
            <view class="visibility-step">
              <view class="step-num">1</view>
              <view class="step-content">
                <view class="step-title">微信小程序</view>
                <view class="step-desc">随时随地查看每日施工进展与现场照片。</view>
              </view>
            </view>
            <view class="step-connector" />
            <view class="visibility-step visibility-step-2">
              <view class="step-num">2</view>
              <view class="step-content">
                <view class="step-title">节点验收单</view>
                <view class="step-desc">关键节点需监理、工长及业主三方确认。</view>
              </view>
            </view>
          </view>

          <view class="phone-mock">
            <view class="phone-frame">
              <view class="phone-topbar">
              <view class="topbar-notch" />
            </view>
              <view class="phone-content">
                <view class="ph-bar ph-primary" />
                <view class="phone-row">
                  <view class="ph-box" />
                  <view class="ph-text">
                    <view class="ph-line" />
                    <view class="ph-line ph-line-short" />
                  </view>
                </view>
                <view class="phone-progress">
                  <view class="progress-circle">
                    <view class="progress-check" />
                  </view>
                </view>
              </view>
              <view class="phone-footer">
                <text class="footer-text">今日进度更新</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </section>

    <view class="divider" />

    <!-- 4. 延期赔付规则 -->
    <section class="section section-compensation">
      <view class="section-inner">
        <view class="section-heading">
          <view class="heading-icon icon-shield" />
          <text class="heading-text">延期怎么赔？</text>
        </view>

        <view class="compensation-card">
          <view class="compensation-bg compensation-bg-1" />
          <view class="compensation-bg compensation-bg-2" />
          <view class="compensation-inner">
            <view class="compensation-label">Compensation Formula</view>
            <view class="compensation-formula">
              <view class="formula-item">
                <view class="formula-label">延期天数</view>
                <view class="formula-value">N</view>
              </view>
              <view class="formula-op">×</view>
              <view class="formula-item">
                <view class="formula-label">赔付标准</view>
                <view class="formula-value">¥100<text class="formula-unit">/天</text></view>
              </view>
              <view class="formula-op">=</view>
              <view class="formula-item">
                <view class="formula-label">赔付金</view>
                <view class="formula-value formula-value-highlight">现金</view>
              </view>
            </view>
            <view class="compensation-divider" />
            <view class="compensation-note">
              <view class="note-icon icon-alert" />
              <text class="note-text">延期认定以合同约定竣工日期为准。除不可抗力及业主原因外，所有平台原因导致的延期均按此标准执行。</text>
            </view>
          </view>
        </view>
      </view>
    </section>

    <view class="bottom-spacer" />
  </scroll-view>
</template>

<script setup lang="ts">
const timelineItems = [
  { name: '开工交底', days: 'Day 1', desc: '现场保护、拆除交底', active: false },
  { name: '水电阶段', days: 'Day 2-10', desc: '开槽布线、隐蔽工程验收', active: true },
  { name: '泥木阶段', days: 'Day 11-25', desc: '防水测试、瓷砖铺贴、吊顶', active: false },
  { name: '油漆阶段', days: 'Day 26-35', desc: '墙面找平、底漆面漆', active: false },
  { name: '竣工安装', days: 'Day 36-45', desc: '材料安装、竣工验收', active: false },
]
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
}

.divider {
  height: 16rpx;
  background: #f9fafb;
}

.bottom-spacer {
  height: 48rpx;
}

/* px-6 = 48rpx, pt-8 pb-6 */
.section {
  padding: 64rpx 48rpx;
}

.section-hero {
  padding-top: 64rpx;
  padding-bottom: 48rpx;
}

.section-inner {
  max-width: 640rpx;
  margin: 0 auto;
}

/* Section heading */
/* text-[16px] mb-6, icon size 18 */
.section-heading {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 48rpx;
}

.heading-icon {
  width: 36rpx;
  height: 36rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-clock {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12 6 12 12 16 14'/%3E%3C/svg%3E");
}

.icon-calendar {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='16' y1='2' x2='16' y2='6'/%3E%3Cline x1='8' y1='2' x2='8' y2='6'/%3E%3Cline x1='3' y1='10' x2='21' y2='10'/%3E%3C/svg%3E");
}

.icon-search {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
}

.icon-shield {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E");
}

.icon-alert {
  width: 32rpx;
  height: 32rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='12'/%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.heading-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #1e2222;
}

/* 1. Hero - text-2xl mb-2, text-[15px], text-[13px], grid gap-3, p-4, w-5 h-5 */
.hero-header {
  margin-bottom: 48rpx;
}

.hero-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #1e2222;
  letter-spacing: 1rpx;
  margin-bottom: 16rpx;
}

.hero-subtitle {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.subtitle-main {
  font-size: 30rpx;
  color: #2d635e;
  font-weight: 500;
  line-height: 1.5;
}

.subtitle-sub {
  font-size: 26rpx;
  color: #8a8f8f;
  font-weight: 400;
}

.promise-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.promise-card {
  background: #f9fafb;
  padding: 32rpx;
  border-radius: 24rpx;
  border: 2rpx solid #f0f0f0;
}

.promise-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 16rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.promise-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 4rpx;
}

.promise-desc {
  font-size: 22rpx;
  color: #888;
}

/* 2. Timeline - px-6 py-8, pl-2, left-[9px], space-y-6, pl-8, w-[19px] border-[3px], p-4 */
.section-timeline {
  padding: 64rpx 48rpx;
}

.timeline-wrap {
  position: relative;
  padding-left: 16rpx;
}

.timeline-line {
  position: absolute;
  left: 18rpx;
  top: 16rpx;
  bottom: 48rpx;
  width: 2rpx;
  background: #e5e5e5;
}

.timeline-item {
  position: relative;
  padding-left: 64rpx;
  margin-bottom: 48rpx;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 12rpx;
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  border: 6rpx solid #e5e5e5;
  background: #fff;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-dot-active {
  border-color: #2d635e;
}

.dot-inner {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #2d635e;
}

.timeline-content {
  padding: 32rpx;
  border-radius: 24rpx;
  border: 2rpx solid #f0f0f0;
  background: #fff;
}

.timeline-content-active {
  background: rgba(45, 99, 94, 0.05);
  border-color: #2d635e;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.content-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
}

.content-title-active {
  color: #2d635e;
}

.content-days {
  font-size: 22rpx;
  font-weight: 500;
  color: #999;
  background: #f5f5f5;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.content-desc {
  font-size: 24rpx;
  color: #666;
}

.content-tags {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid rgba(45, 99, 94, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.tag {
  padding: 8rpx 16rpx;
  background: #fff;
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #2d635e;
  border: 2rpx solid rgba(45, 99, 94, 0.2);
}

/* 3. Visibility - flex gap-4, mb-6, gap-3, pt-2, w-6 h-6, text-[12px] [14px] [12px] */
.visibility-body {
  display: flex;
  gap: 32rpx;
  margin-bottom: 48rpx;
}

.visibility-steps {
  flex: 1;
  padding-top: 16rpx;
}

.visibility-step {
  display: flex;
  gap: 24rpx;
}

.step-connector {
  width: 2rpx;
  height: 32rpx;
  background: #e5e5e5;
  margin-left: 24rpx;
  margin-top: 8rpx;
  margin-bottom: 8rpx;
}

.visibility-step-2 {
  margin-top: 0;
}

.step-num {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #2d635e;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 8rpx;
}

.step-desc {
  font-size: 24rpx;
  color: #888;
  line-height: 1.5;
}

/* Phone: w-28 h-48, border-[3px], rounded-[16px], h-4 topbar, p-2 space-y-2, text-[8px] */
.phone-mock {
  width: 224rpx;
  flex-shrink: 0;
}

.phone-frame {
  position: relative;
  border: 6rpx solid #f0f0f0;
  border-radius: 32rpx;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  height: 384rpx;
}

.phone-topbar {
  height: 32rpx;
  background: #f5f5f5;
  border-bottom: 2rpx solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.topbar-notch {
  width: 64rpx;
  height: 8rpx;
  background: #ddd;
  border-radius: 8rpx;
}

.phone-content {
  padding: 16rpx;
}

.ph-bar {
  margin-bottom: 16rpx;
}

.ph-primary {
  width: 128rpx;
  height: 16rpx;
  background: rgba(45, 99, 94, 0.2);
  border-radius: 4rpx;
}

.phone-row {
  display: flex;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.ph-box {
  width: 64rpx;
  height: 64rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
}

.ph-text {
  flex: 1;
}

.ph-line {
  height: 12rpx;
  background: #eee;
  border-radius: 4rpx;
  margin-bottom: 8rpx;
}

.ph-line-short {
  width: 66%;
}

.phone-progress {
  height: 96rpx;
  background: #f9fafb;
  border: 2rpx solid #eee;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circle {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 4rpx solid #2d635e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-check {
  width: 12rpx;
  height: 24rpx;
  border-right: 4rpx solid #2d635e;
  border-bottom: 4rpx solid #2d635e;
  transform: rotate(45deg);
  margin-top: -6rpx;
}

.phone-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  border-top: 2rpx solid #eee;
  padding: 16rpx;
  text-align: center;
}

.footer-text {
  font-size: 16rpx;
  color: #2d635e;
  font-weight: 700;
}

/* 4. Compensation - rounded-xl p-5, text-[12px] [11px] [20px] font-din, w-4 h-4 alert */
.compensation-card {
  background: #2d635e;
  border-radius: 24rpx;
  padding: 40rpx;
  position: relative;
  overflow: hidden;
}

.compensation-bg {
  position: absolute;
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  filter: blur(40rpx);
}

.compensation-bg-1 {
  right: -32rpx;
  top: -32rpx;
}

.compensation-bg-2 {
  left: -32rpx;
  bottom: -32rpx;
}

.compensation-inner {
  position: relative;
  z-index: 10;
  text-align: center;
}

.compensation-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2rpx;
  margin-bottom: 16rpx;
  text-transform: uppercase;
}

.compensation-formula {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin: 32rpx 0;
}

.formula-item {
  text-align: center;
}

.formula-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8rpx;
}

.formula-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif;
}

.formula-unit {
  font-size: 24rpx;
  font-weight: 400;
}

.formula-value-highlight {
  color: #ffd700;
}

.formula-op {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.6);
}

.compensation-divider {
  height: 2rpx;
  background: rgba(255, 255, 255, 0.1);
  margin: 32rpx 0;
}

.compensation-note {
  display: flex;
  gap: 16rpx;
  text-align: left;
}

.note-icon {
  flex-shrink: 0;
  width: 32rpx;
  height: 32rpx;
  margin-top: 4rpx;
}

.note-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}
</style>
