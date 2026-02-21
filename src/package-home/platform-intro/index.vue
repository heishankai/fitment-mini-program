<template>
  <scroll-view class="page" scroll-y>
    <!-- 01. 品牌宣言 -->
    <section class="section section-manifesto">
      <view class="section-inner">
        <view class="section-label">
          <view class="label-line" />
          <text class="label-text">MANIFESTO</text>
        </view>
        <view class="manifesto-title">
          装修，本该是
          <br />
          一件
          <text class="highlight">透明</text>
          的事
        </view>
        <view class="manifesto-desc">
          我们相信，好的装修不应该被信息不对称所困扰。
          <br />
          工匠的手艺值得被看见，业主的需求应当被尊重。
          <br />
          智惠装致力于搭建一个透明、公正的平台。
        </view>
        <view class="keywords-grid">
          <view class="keyword-item">
            <view class="keyword-en">TRANSPARENCY</view>
            <view class="keyword-zh">价格透明</view>
          </view>
          <view class="keyword-item">
            <view class="keyword-en">QUALITY</view>
            <view class="keyword-zh">质量保障</view>
          </view>
          <view class="keyword-item">
            <view class="keyword-en">EFFICIENCY</view>
            <view class="keyword-zh">高效对接</view>
          </view>
          <view class="keyword-item">
            <view class="keyword-en">TRACEABILITY</view>
            <view class="keyword-zh">过程可溯</view>
          </view>
        </view>
      </view>
    </section>

    <!-- 02. 我们如何做装修 -->
    <section class="section section-approach">
      <view class="section-inner">
        <view class="section-label">
          <view class="label-line" />
          <text class="label-text">APPROACH</text>
        </view>
        <view class="section-title">我们如何做装修</view>
        <view class="approach-list">
          <view v-for="(item, i) in approachList" :key="i" class="approach-item">
            <view class="approach-num">{{ item.num }}</view>
            <view class="approach-content">
              <view class="approach-heading">{{ item.title }}</view>
              <view class="approach-desc">{{ item.desc }}</view>
            </view>
          </view>
        </view>
      </view>
    </section>

    <!-- 03. 施工流程 -->
    <section class="section section-process">
      <view class="section-inner">
        <view class="section-label">
          <view class="label-line" />
          <text class="label-text">PROCESS</text>
        </view>
        <view class="section-title">施工流程</view>
        <view class="process-timeline">
          <view class="process-line" />
          <view v-for="(step, i) in processSteps" :key="i" class="process-item">
            <view class="process-dot">
              <text class="process-num">{{ step.num }}</text>
            </view>
            <view class="process-content">
              <view class="process-title">{{ step.title }}</view>
              <view class="process-desc">{{ step.desc }}</view>
            </view>
          </view>
        </view>
      </view>
    </section>

    <!-- 04. 平台优势 -->
    <section class="section section-advantages">
      <view class="section-inner">
        <view class="section-label">
          <view class="label-line" />
          <text class="label-text">ADVANTAGES</text>
        </view>
        <view class="section-title">平台优势</view>
        <view class="advantages-grid">
          <view v-for="(item, i) in advantagesList" :key="i" class="advantage-cell">
            <view class="advantage-en">{{ item.en }}</view>
            <view class="advantage-title">{{ item.title }}</view>
            <view class="advantage-desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </section>

    <!-- 05. CTA -->
    <section class="section section-cta">
      <view class="section-inner cta-inner">
        <view class="cta-title">开始您的透明装修之旅</view>
        <view class="cta-buttons">
          <view class="cta-btn cta-btn-primary" @tap="handleQuote">
            <text class="cta-btn-text">获取报价</text>
            <view class="icon-arrow icon-arrow-white" />
          </view>
          <view class="cta-btn cta-btn-outline" @tap="handleLabourCost">
            <text class="cta-btn-text">浏览工价</text>
            <view class="icon-arrow icon-arrow-primary" />
          </view>
        </view>
        <view class="cta-deco">
          <view class="deco-line" />
          <view class="deco-dot" />
          <view class="deco-line" />
        </view>
      </view>
    </section>
  </scroll-view>
</template>

<script setup lang="ts">
const approachList = [
  {
    num: '01',
    title: '去中介化',
    desc: '打破传统装修公司的层层加价模式，让业主直接对接工匠和工长，砍掉所有不必要的中间环节。',
  },
  {
    num: '02',
    title: '平台监管',
    desc: '虽然去掉了中介，但平台会对工匠进行严格认证，全程监督施工质量，并提供售后保障。',
  },
  {
    num: '03',
    title: '信息透明',
    desc: '工价、辅材价格全部公开，施工过程可追溯，让每一分钱都花得明明白白。',
  },
]

const processSteps = [
  { num: '01', title: '发布需求', desc: '在线填写装修需求与预算' },
  { num: '02', title: '匹配工匠', desc: '系统推荐附近认证工匠' },
  { num: '03', title: '上门测量', desc: '工匠免费上门勘察现场' },
  { num: '04', title: '报价确认', desc: '收到透明详细的报价清单' },
  { num: '05', title: '签约施工', desc: '确认后开始按标准施工' },
  { num: '06', title: '验收交付', desc: '验收合格后付款完成' },
]

const advantagesList = [
  {
    en: 'PRICING',
    title: '工价透明',
    desc: '所有工种价格公开\n明码标价无隐藏费用',
  },
  {
    en: 'VERIFIED',
    title: '工匠认证',
    desc: '严格审核工匠资质\n技能与口碑双重把关',
  },
  {
    en: 'WARRANTY',
    title: '质量保障',
    desc: '平台全程监管施工\n问题处理售后兜底',
  },
  {
    en: 'TRACEABLE',
    title: '材料可溯',
    desc: '品牌辅材来源透明\n假一赔三放心使用',
  },
]

const handleQuote = (): void => {
  uni.showToast({ title: '敬请期待', icon: 'none' })
}

const handleLabourCost = (): void => {
  uni.switchTab({ url: '/pages/labour-cost/index' })
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background: $uni-bg-color;
}

.section {
  padding: 96rpx 48rpx 128rpx;
  border-bottom: 2rpx solid $uni-border-color;
}

.section-inner {
  max-width: 600rpx;
  margin: 0 auto;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.label-line {
  width: 32rpx;
  height: 2rpx;
  background: $uni-color-primary;
}

.label-text {
  font-size: 20rpx;
  color: $uni-text-color-placeholder;
  letter-spacing: 0.2em;
}

.section-title {
  font-size: 48rpx;
  line-height: 1.5;
  color: $uni-text-color;
  font-weight: 300;
  margin-bottom: 64rpx;
}

/* 01. 品牌宣言 */
.section-manifesto {
  padding-top: 192rpx;
}

.manifesto-title {
  font-size: 64rpx;
  line-height: 1.4;
  color: $uni-text-color;
  font-weight: 300;
  letter-spacing: 0.04rpx;
  margin-bottom: 32rpx;
}

.highlight {
  color: $uni-color-primary;
}

.manifesto-desc {
  font-size: 30rpx;
  line-height: 1.9;
  color: $uni-text-color-grey;
  letter-spacing: 0.06rpx;
  margin-bottom: 48rpx;
}

.keywords-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48rpx 64rpx;
}

.keyword-item {
  .keyword-en {
    font-size: 22rpx;
    color: $uni-text-color-placeholder;
    letter-spacing: 0.15em;
    margin-bottom: 8rpx;
  }
  .keyword-zh {
    font-size: 30rpx;
    color: $uni-text-color;
    font-weight: 400;
  }
}

/* 02. 我们如何做装修 */
.section-approach {
  background: $uni-bg-color-grey;
}

.approach-list {
  display: flex;
  flex-direction: column;
  gap: 64rpx;
}

.approach-item {
  display: flex;
  gap: 48rpx;
}

.approach-num {
  flex-shrink: 0;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: rgba(45, 99, 94, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: $uni-color-primary;
  font-weight: 300;
}

.approach-content {
  flex: 1;
  padding-top: 8rpx;
}

.approach-heading {
  font-size: 32rpx;
  color: $uni-text-color;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.approach-desc {
  font-size: 28rpx;
  line-height: 1.8;
  color: $uni-text-color-grey;
}

/* 03. 施工流程 */
.process-timeline {
  position: relative;
}

.process-line {
  position: absolute;
  left: 46rpx;
  top: 48rpx;
  bottom: 48rpx;
  width: 2rpx;
  background: $uni-border-color;
}

.process-item {
  position: relative;
  display: flex;
  gap: 48rpx;
  padding-bottom: 64rpx;
}

.process-item:last-child {
  padding-bottom: 0;
}

.process-dot {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  width: 96rpx;
  height: 96rpx;
  background: $uni-bg-color;
  border: 2rpx solid $uni-border-color;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.process-num {
  font-size: 22rpx;
  color: $uni-text-color-grey;
  font-weight: 300;
}

.process-content {
  flex: 1;
  padding-top: 8rpx;
}

.process-title {
  font-size: 30rpx;
  color: $uni-text-color;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.process-desc {
  font-size: 26rpx;
  color: $uni-text-color-placeholder;
}

/* 04. 平台优势 */
.section-advantages {
  background: $uni-bg-color-grey;
}

.advantages-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rpx;
  background: $uni-border-color;
}

.advantage-cell {
  background: $uni-bg-color;
  padding: 48rpx;
}

.advantage-en {
  font-size: 22rpx;
  color: $uni-text-color-placeholder;
  letter-spacing: 0.15em;
  margin-bottom: 16rpx;
}

.advantage-title {
  font-size: 30rpx;
  color: $uni-text-color;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.advantage-desc {
  font-size: 24rpx;
  line-height: 1.7;
  color: $uni-text-color-grey;
  white-space: pre-line;
}

/* 05. CTA */
.section-cta {
  border-bottom: none;
  padding-bottom: 96rpx;
}

.cta-inner {
  text-align: center;
}

.cta-title {
  font-size: 40rpx;
  color: $uni-text-color;
  font-weight: 300;
  letter-spacing: 0.04rpx;
  margin-bottom: 48rpx;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: center;
}

.cta-btn {
  width: 100%;
  max-width: 400rpx;
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.cta-btn-primary {
  background: $uni-color-primary;
}

.cta-btn-primary .cta-btn-text {
  color: $uni-text-color-inverse;
}

.cta-btn-outline {
  background: $uni-bg-color;
  border: 2rpx solid $uni-border-color;
}

.cta-btn-outline .cta-btn-text {
  color: $uni-color-primary;
}

.cta-btn-text {
  font-size: 28rpx;
  letter-spacing: 0.1rpx;
}

.icon-arrow {
  width: 32rpx;
  height: 32rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-arrow-white {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3Cpath d='M12 5l7 7-7 7'/%3E%3C/svg%3E");
}

.icon-arrow-primary {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3Cpath d='M12 5l7 7-7 7'/%3E%3C/svg%3E");
}

.cta-deco {
  margin-top: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
}

.deco-line {
  width: 96rpx;
  height: 2rpx;
  background: $uni-border-color;
}

.deco-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: $uni-border-color;
}
</style>
