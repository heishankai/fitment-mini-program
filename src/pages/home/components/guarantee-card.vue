<template>
  <view class="guarantee-card" @tap="handleDetail">
    <view class="card-inner">
      <!-- 标题区 -->
      <view class="card-header">
        <view class="card-title">施工保障体系</view>
        <view class="card-subtitle">标准流程 · 工地可查 · 售后质保</view>
      </view>

      <!-- 三列内容 -->
      <view class="card-body">
        <view class="grid-cols">
          <view
            v-for="(col, i) in columns"
            :key="i"
            class="col-item"
            :class="{ 'col-border-x': i === 1 }"
          >
            <view class="col-icon-wrap">
              <view :class="['col-icon', col.iconClass]" />
            </view>
            <view class="col-num">{{ col.num }}</view>
            <view class="col-heading">{{ col.title }}</view>
            <view class="col-list">
              <view v-for="(item, j) in col.items" :key="j" class="col-list-item">
                · {{ item }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="card-footer">
        <view class="footer-link">
          <text class="link-text">了解完整保障体系</text>
          <view class="icon-chevron" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const columns = [
  {
    num: '01',
    title: '工匠认证',
    iconClass: 'icon-craftsman',
    items: ['实名认证', '技能审核', '项目经验', '资质筛选'],
  },
  {
    num: '02',
    title: '标准施工',
    iconClass: 'icon-checklist',
    items: ['统一标准', '规范执行', '节点验收', '进度透明'],
  },
  {
    num: '03',
    title: '质保售后',
    iconClass: 'icon-toolbox',
    items: ['合同保障', '质量追溯', '延时赔付', '售后响应'],
  },
]

const handleDetail = (): void => {
  uni.navigateTo({ url: '/package-home/construction-guarantee/index' })
}
</script>

<style lang="scss" scoped>
.guarantee-card {
  margin: 0 24rpx 36rpx;
}

.card-inner {
  border-radius: 32rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4rpx 40rpx rgba(45, 99, 94, 0.06);
}

.card-header {
  padding: 40rpx 48rpx 32rpx;
  text-align: center;
  border-bottom: 2rpx solid rgba(230, 234, 234, 0.3);
}

.card-title {
  font-size: 34rpx;
  font-weight: 500;
  color: $uni-text-color;
  letter-spacing: 2rpx;
  margin-bottom: 16rpx;
}

.card-subtitle {
  font-size: 22rpx;
  color: #8a8f8f;
  letter-spacing: 1.2rpx;
  line-height: 1.6;
}

.card-body {
  padding: 40rpx 48rpx;
}

.grid-cols {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 64rpx;
}

.col-item {
  text-align: center;

  &.col-border-x {
    border-left: 2rpx solid rgba(230, 234, 234, 0.3);
    border-right: 2rpx solid rgba(230, 234, 234, 0.3);
  }
}

.col-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16rpx;
}

.col-icon {
  width: 48rpx;
  height: 48rpx;
  opacity: 0.2;
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

.col-num {
  font-size: 20rpx;
  color: #b8bdbd;
  letter-spacing: 0.2em;
  font-weight: 300;
  margin-bottom: 12rpx;
}

.col-heading {
  font-size: 28rpx;
  font-weight: 500;
  color: $uni-text-color;
  letter-spacing: 0.6rpx;
  margin-bottom: 16rpx;
}

.col-list {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.col-list-item {
  font-size: 22rpx;
  color: $uni-text-color-grey;
  letter-spacing: 0.4rpx;
}

.card-footer {
  padding: 0 48rpx 36rpx;
  text-align: center;
  border-top: 2rpx solid rgba(230, 234, 234, 0.3);
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 24rpx;
}

.link-text {
  font-size: 22rpx;
  font-weight: 500;
  color: $uni-color-primary;
  letter-spacing: 0.8rpx;
}

.icon-chevron {
  width: 28rpx;
  height: 28rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
