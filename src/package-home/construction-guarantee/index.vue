<template>
  <scroll-view class="page" scroll-y>
    <!-- 01. 标题区 -->
    <section class="section section-hero">
      <view class="section-inner">
        <view class="hero-label">
          <view class="label-line" />
          <text class="label-text">GUARANTEE</text>
          <view class="label-line" />
        </view>
        <view class="hero-title">施工有保障</view>
        <view class="hero-subtitle">标准化机制 · 全流程可追溯</view>
      </view>
    </section>

    <!-- 02. 三列核心模块 -->
    <section class="section section-modules">
      <view class="section-inner">
        <view class="modules-grid">
          <view v-for="(mod, i) in modules" :key="i" class="module-item">
            <view class="module-icon-wrap">
              <view :class="['module-icon', mod.iconClass]" />
            </view>
            <view class="module-heading">{{ mod.title }}</view>
            <view class="module-list">
              <view v-for="(item, j) in mod.items" :key="j" class="module-list-item">
                · {{ item }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </section>

    <!-- 03. 施工流程管理 -->
    <section class="section section-process">
      <view class="section-inner">
        <view class="section-label">
          <view class="label-line-primary" />
          <text class="label-text">PROCESS</text>
        </view>
        <view class="section-title">施工流程管理</view>
        <view class="process-list">
          <view v-for="(step, i) in processSteps" :key="i" class="process-item">
            <view class="process-num">{{ step.num }}</view>
            <view class="process-content">
              <view class="process-heading">{{ step.title }}</view>
              <view class="process-desc">{{ step.desc }}</view>
            </view>
          </view>
        </view>
      </view>
    </section>

    <!-- 04. 责任追溯机制 -->
    <section class="section section-mechanism">
      <view class="section-inner">
        <view class="section-label">
          <view class="label-line-primary" />
          <text class="label-text">MECHANISM</text>
        </view>
        <view class="section-title">责任追溯机制</view>
        <view class="mechanism-grid">
          <view v-for="(item, i) in mechanismList" :key="i" class="mechanism-cell">
            <view class="mechanism-en">{{ item.en }}</view>
            <view class="mechanism-title">{{ item.title }}</view>
            <view class="mechanism-desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </section>

    <!-- 05. 底部说明 -->
    <section class="section section-footer">
      <view class="section-inner">
        <view class="footer-desc">
          该模块表达制度保障，而非承诺宣传。
          <br />
          所有机制均以合同条款为准，具体条款请咨询平台客服。
        </view>
        <view class="footer-deco">
          <view class="deco-line" />
          <view class="deco-dot" />
          <view class="deco-line" />
        </view>
      </view>
    </section>
  </scroll-view>
</template>

<script setup lang="ts">
const modules = [
  {
    title: '工匠认证',
    iconClass: 'icon-craftsman',
    items: ['实名认证', '技能审核', '项目经验', '资质筛选'],
  },
  {
    title: '标准施工',
    iconClass: 'icon-checklist',
    items: ['统一标准', '规范执行', '节点验收', '进度透明'],
  },
  {
    title: '质保售后',
    iconClass: 'icon-toolbox',
    items: ['合同保障', '质量追溯', '延时赔付', '售后响应'],
  },
]

const processSteps = [
  {
    num: '01',
    title: '施工准备',
    desc: '材料进场验收 · 现场保护措施 · 施工人员登记',
  },
  {
    num: '02',
    title: '节点验收',
    desc: '水电验收 · 瓦工验收 · 木工验收 · 油漆验收',
  },
  {
    num: '03',
    title: '质量监督',
    desc: '工长定期巡检 · 平台抽查 · 业主实时查看',
  },
  {
    num: '04',
    title: '完工交付',
    desc: '整体验收 · 清洁保洁 · 交付使用说明',
  },
]

const mechanismList = [
  {
    en: 'DEADLINE',
    title: '延时赔付',
    desc: '超出约定工期，平台按日给予补偿，确保工期可控。',
  },
  {
    en: 'QUALITY',
    title: '质量问题',
    desc: '施工质量问题，平台介入协调，责任方承担返工费用。',
  },
  {
    en: 'COMPLAINT',
    title: '投诉机制',
    desc: '业主可随时发起投诉，平台48小时内响应处理。',
  },
  {
    en: 'ARCHIVE',
    title: '记录存档',
    desc: '所有施工照片、验收记录永久保存，可随时查询。',
  },
]
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background: $uni-bg-color;
}

.section {
  padding: 96rpx 48rpx;
  border-bottom: 2rpx solid $uni-border-color;
}

.section-inner {
  width: 100%;
  max-width: 640rpx;
  margin: 0 auto;
  box-sizing: border-box;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 64rpx;
}

.label-line,
.label-line-primary {
  width: 48rpx;
  height: 2rpx;
  background: $uni-border-color;
}

.label-line-primary {
  background: $uni-color-primary;
}

.label-text {
  font-size: 22rpx;
  color: #b8bdbd;
  letter-spacing: 0.3em;
  font-weight: 300;
}

.section-title {
  font-size: 48rpx;
  line-height: 1.5;
  color: $uni-text-color;
  font-weight: 500;
  letter-spacing: 2rpx;
  margin-bottom: 80rpx;
}

/* 01. 标题区 */
.section-hero {
  padding-top: 192rpx;
  padding-bottom: 160rpx;
}

.hero-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  margin-bottom: 40rpx;
}

.hero-title {
  font-size: 68rpx;
  line-height: 1.4;
  color: $uni-text-color;
  font-weight: 500;
  letter-spacing: 4rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.hero-subtitle {
  font-size: 28rpx;
  color: $uni-text-color-grey;
  letter-spacing: 2rpx;
  line-height: 1.8;
  text-align: center;
}

/* 02. 三列模块 */
.section-modules {
  background: #fafafa;

  .section-inner {
    max-width: 100%;
  }
}

.modules-grid {
  display: flex;
  justify-content: space-between;
  gap: 48rpx;
}

.module-item {
  flex: 1;
  min-width: 0;
  text-align: center;

  .module-icon-wrap {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: rgba(45, 99, 94, 0.04);
    border: 2rpx solid rgba(45, 99, 94, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 48rpx;
  }

  .module-icon {
    width: 56rpx;
    height: 56rpx;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .icon-craftsman {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='8.5' cy='7' r='4'/%3E%3Cpolyline points='17 11 19 13 23 9'/%3E%3C/svg%3E");
  }

  .icon-checklist {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='8' y1='6' x2='21' y2='6'/%3E%3Cline x1='8' y1='12' x2='21' y2='12'/%3E%3Cline x1='8' y1='18' x2='21' y2='18'/%3E%3Cline x1='3' y1='6' x2='3.01' y2='6'/%3E%3Cline x1='3' y1='12' x2='3.01' y2='12'/%3E%3Cline x1='3' y1='18' x2='3.01' y2='18'/%3E%3C/svg%3E");
  }

  .icon-toolbox {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/%3E%3Cpolyline points='3.27 6.96 12 12.01 20.73 6.96'/%3E%3Cline x1='12' y1='22.08' x2='12' y2='12'/%3E%3C/svg%3E");
  }

  .module-heading {
    font-size: 36rpx;
    font-weight: 500;
    color: $uni-text-color;
    letter-spacing: 1.6rpx;
    margin-bottom: 48rpx;
  }

  .module-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
  }

  .module-list-item {
    font-size: 26rpx;
    color: $uni-text-color-grey;
    letter-spacing: 0.8rpx;
  }
}

/* 03. 施工流程 */
.process-list {
  display: flex;
  flex-direction: column;
  gap: 96rpx;
}

.process-item {
  display: flex;
  gap: 80rpx;
}

.process-num {
  flex-shrink: 0;
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: rgba(45, 99, 94, 0.04);
  border: 2rpx solid rgba(45, 99, 94, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: $uni-color-primary;
  font-weight: 300;
  letter-spacing: 2rpx;
}

.process-content {
  flex: 1;
  padding-top: 16rpx;
}

.process-heading {
  font-size: 34rpx;
  font-weight: 500;
  color: $uni-text-color;
  letter-spacing: 1rpx;
  margin-bottom: 16rpx;
}

.process-desc {
  font-size: 26rpx;
  letter-spacing: 1rpx;
  line-height: 1.8;
  color: $uni-text-color-grey;
}

/* 04. 责任机制 */
.section-mechanism {
  background: #fafafa;

  .section-inner {
    max-width: 100%;
  }
}

.mechanism-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 48rpx;
}

.mechanism-cell {
  flex: 1 1 45%;
  padding: 80rpx 48rpx;
  background: $uni-bg-color;
  border: 2rpx solid rgba(230, 234, 234, 0.5);
  border-radius: 32rpx;
  box-sizing: border-box;
}

.mechanism-en {
  font-size: 22rpx;
  color: #b8bdbd;
  letter-spacing: 0.25em;
  font-weight: 300;
  margin-bottom: 20rpx;
}

.mechanism-title {
  font-size: 34rpx;
  font-weight: 500;
  color: $uni-text-color;
  letter-spacing: 1rpx;
  margin-bottom: 20rpx;
}

.mechanism-desc {
  font-size: 26rpx;
  letter-spacing: 0.8rpx;
  line-height: 2;
  color: $uni-text-color-grey;
}

/* 05. 底部 */
.section-footer {
  border-bottom: none;
}

.footer-desc {
  font-size: 24rpx;
  color: #b8bdbd;
  letter-spacing: 1rpx;
  line-height: 2.2;
  text-align: center;
}

.footer-deco {
  margin-top: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
}

.deco-line {
  width: 160rpx;
  height: 2rpx;
  background: $uni-border-color;
}

.deco-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $uni-border-color;
}
</style>
