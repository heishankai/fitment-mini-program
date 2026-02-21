<template>
  <scroll-view class="page" scroll-y>
    <!-- 1. 机制说明 -->
    <section class="section section-mechanism">
      <view class="section-inner">
        <view class="mechanism-header">
          <view class="mechanism-title">材料透明机制</view>
          <view class="mechanism-subtitle">所有辅材明细公开可查</view>
        </view>
        <view class="mechanism-desc">
          平台所有辅材统一标准管理，杜绝偷工减料与品牌调包。
          <br />
          材料名称、品牌、规格、型号、单价及预算用量均全流程公开展示，所见即所得。
        </view>
      </view>
    </section>

    <view class="divider" />

    <!-- 2. 查看路径说明 -->
    <section class="section section-path">
      <view class="section-inner">
        <view class="section-heading">
          <view class="heading-icon icon-eye" />
          <text class="heading-text">材料在哪里看？</text>
        </view>

        <view class="path-steps">
          <!-- Step 1 -->
          <view class="path-step">
            <view class="step-left">
              <view class="step-num">1</view>
              <view class="step-line" />
            </view>
            <view class="step-content">
              <view class="step-title">签约前：查看标准库</view>
              <view class="step-desc">在首页【辅材】模块，查询平台所有在售材料的品牌与指导价。</view>
              <view class="step-visual step-visual-1">
                <view class="visual-header">
                  <view class="visual-icon-wrap">
                    <view class="visual-icon icon-search" />
                  </view>
                  <view class="visual-placeholder">
                    <view class="ph-bar ph-bar-lg" />
                    <view class="ph-bar ph-bar-sm" />
                  </view>
                </view>
                <view class="visual-body">
                  <view class="ph-row" />
                  <view class="ph-row ph-row-short" />
                </view>
              </view>
            </view>
          </view>

          <!-- Step 2 -->
          <view class="path-step">
            <view class="step-left">
              <view class="step-num">2</view>
            </view>
            <view class="step-content">
              <view class="step-title">施工中：查看项目清单</view>
              <view class="step-desc">生成订单后，在【我的工地】中查看您家实际使用的详细材料表。</view>
              <view class="step-visual step-visual-2">
                <view class="visual-header-2">
                  <view class="ph-bar ph-primary" />
                  <view class="ph-pill" />
                </view>
                <view class="visual-grid">
                  <view class="grid-row">
                    <view class="grid-cell" />
                    <view class="grid-cell grid-cell-2" />
                  </view>
                  <view class="grid-row">
                    <view class="grid-cell" />
                    <view class="grid-cell grid-cell-2" />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </section>

    <view class="divider" />

    <!-- 3. 材料清单展示示例 -->
    <section class="section section-example">
      <view class="section-inner">
        <view class="section-heading">
          <view class="heading-icon icon-spreadsheet" />
          <text class="heading-text">清单长什么样？</text>
        </view>
        <view class="example-desc">真实数据示例，包含品牌、型号、规格等核心字段。</view>

        <view class="table-wrap">
          <view class="table-header">
            <view class="th th-3">材料名称</view>
            <view class="th th-3">品牌/型号</view>
            <view class="th th-3">规格/单位</view>
            <view class="th th-3">单价/数量</view>
          </view>
          <view
            v-for="(row, i) in tableData"
            :key="i"
            class="table-row"
          >
            <view class="td td-3 td-name">{{ row.name }}</view>
            <view class="td td-3">
              <text class="td-main">{{ row.brand }}</text>
              <text class="td-sub">{{ row.model }}</text>
            </view>
            <view class="td td-3 td-center">
              <text class="td-main">{{ row.spec }}</text>
              <text class="td-sub">{{ row.unit }}</text>
            </view>
            <view class="td td-3 td-right">
              <text class="td-price">¥{{ row.price }}</text>
              <text class="td-sub">x{{ row.qty }}</text>
            </view>
          </view>
          <view class="table-footer">
            ... 此处仅为部分示例，实际清单包含所有辅材 ...
          </view>
        </view>
      </view>
    </section>

    <view class="divider" />

    <!-- 4. 用户保障说明 -->
    <section class="section section-guarantee">
      <view class="section-inner">
        <view class="section-heading">
          <view class="heading-icon icon-shield" />
          <text class="heading-text">全流程保障</text>
        </view>

        <view class="guarantee-grid">
          <view
            v-for="(item, i) in guaranteeItems"
            :key="i"
            class="guarantee-item"
          >
            <view class="guarantee-icon-wrap">
              <view :class="['guarantee-icon', item.iconClass]" />
            </view>
            <view class="guarantee-title">{{ item.title }}</view>
            <view class="guarantee-desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </section>

    <view class="bottom-spacer" />
  </scroll-view>
</template>

<script setup lang="ts">
const tableData = [
  { name: 'PPR水管', brand: '伟星', model: 'S3.2系列', spec: '25mm', unit: '米', price: '15', qty: '45' },
  { name: '强电电线', brand: '远东', model: 'BV-2.5', spec: '2.5mm²', unit: '卷', price: '280', qty: '2' },
  { name: '弱电网线', brand: '秋叶原', model: '六类', spec: 'CAT6', unit: '米', price: '3.5', qty: '100' },
  { name: '水泥', brand: '海螺', model: 'P.O 42.5', spec: '50kg', unit: '包', price: '25', qty: '30' },
  { name: '石膏板', brand: '龙牌', model: '防潮型', spec: '9.5mm', unit: '张', price: '42', qty: '15' },
]

const guaranteeItems = [
  {
    title: '可追溯',
    desc: '品牌型号\n来源清晰',
    iconClass: 'icon-search',
  },
  {
    title: '所见即所得',
    desc: '施工材料\n与订单一致',
    iconClass: 'icon-check',
  },
  {
    title: '平台监督',
    desc: '严控品质\n假一赔三',
    iconClass: 'icon-shield',
  },
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

.section {
  padding: 64rpx 48rpx;
}

.section-inner {
  max-width: 640rpx;
  margin: 0 auto;
}

/* 1. 机制说明 */
.section-mechanism {
  padding-top: 48rpx;
}

.mechanism-header {
  margin-bottom: 32rpx;
}

.mechanism-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #111;
  letter-spacing: 1rpx;
  margin-bottom: 8rpx;
}

.mechanism-subtitle {
  font-size: 30rpx;
  color: $uni-color-primary;
  font-weight: 500;
}

.mechanism-desc {
  font-size: 26rpx;
  line-height: 1.8;
  color: #666;
  text-align: justify;
}

/* 2. 查看路径 */
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

.icon-eye {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E");
}

.icon-search {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
}

.icon-spreadsheet {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpath d='M14 2v6h6'/%3E%3Cpath d='M16 13H8'/%3E%3Cpath d='M16 17H8'/%3E%3Cpath d='M10 9H8'/%3E%3C/svg%3E");
}

.icon-shield {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E");
}

.icon-check {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%232D635E' stroke-width='2'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/%3E%3Cpolyline points='22 4 12 14.01 9 11.01'/%3E%3C/svg%3E");
}

.heading-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #111;
}

.path-steps {
  display: flex;
  flex-direction: column;
  gap: 64rpx;
}

.path-step {
  display: flex;
  gap: 32rpx;
}

.step-left {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-num {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: $uni-color-primary;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-line {
  width: 2rpx;
  flex: 1;
  min-height: 80rpx;
  background: #e5e5e5;
  margin-top: 8rpx;
}

.step-content {
  flex: 1;
  padding-bottom: 16rpx;
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
  margin-bottom: 24rpx;
}

.step-visual {
  background: #f5f7f6;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 2rpx solid #eee;
  max-width: 480rpx;
}

.step-visual-1 .visual-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #e5e5e5;
  margin-bottom: 16rpx;
}

.visual-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  background: #fff;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-placeholder {
  flex: 1;
}

.ph-bar {
  height: 16rpx;
  background: #ddd;
  border-radius: 4rpx;
  margin-bottom: 8rpx;
}

.ph-bar-lg {
  width: 128rpx;
}

.ph-bar-sm {
  width: 80rpx;
  height: 12rpx;
}

.ph-row {
  height: 16rpx;
  background: #e0e0e0;
  border-radius: 4rpx;
  margin-bottom: 12rpx;
  opacity: 0.6;
}

.ph-row-short {
  width: 75%;
}

.step-visual-2 .visual-header-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.ph-primary {
  width: 160rpx;
  height: 16rpx;
  background: $uni-color-primary;
  border-radius: 4rpx;
  opacity: 0.8;
}

.ph-pill {
  width: 96rpx;
  height: 32rpx;
  background: #ddd;
  border-radius: 32rpx;
}

.visual-grid {
  background: #fff;
  border: 2rpx solid #e5e5e5;
  border-radius: 16rpx;
  padding: 16rpx;
}

.grid-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.grid-row:last-child {
  margin-bottom: 0;
}

.grid-cell {
  flex: 1;
  height: 12rpx;
  background: #eee;
  border-radius: 4rpx;
}

.grid-cell-2 {
  flex: 2;
}

/* 3. 材料清单表格 */
.example-desc {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 32rpx;
}

.table-wrap {
  border: 2rpx solid #e5e5e5;
  border-radius: 24rpx;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #f9fafb;
  border-bottom: 2rpx solid #e5e5e5;
  padding: 16rpx 24rpx;
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
}

.th {
  flex: 1;
}

.th-3 {
  flex: 0 0 25%;
}

.table-row {
  display: flex;
  border-bottom: 2rpx solid #f0f0f0;
  padding: 24rpx;
  font-size: 22rpx;
  color: #333;
  align-items: center;
}

.table-row:last-of-type {
  border-bottom: none;
}

.td {
  flex: 1;
}

.td-3 {
  flex: 0 0 25%;
}

.td-name {
  font-weight: 500;
}

.td-center {
  text-align: center;
}

.td-right {
  text-align: right;
}

.td-main {
  display: block;
}

.td-sub {
  font-size: 20rpx;
  color: #999;
}

.td-price {
  font-weight: 700;
}

.table-footer {
  background: #fdfdfd;
  padding: 16rpx;
  text-align: center;
  font-size: 20rpx;
  color: #aaa;
  letter-spacing: 1rpx;
}

/* 4. 全流程保障 */
.guarantee-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32rpx;
}

.guarantee-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.guarantee-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(45, 99, 94, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.guarantee-icon {
  width: 36rpx;
  height: 36rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.guarantee-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 8rpx;
}

.guarantee-desc {
  font-size: 22rpx;
  color: #888;
  line-height: 1.5;
  white-space: pre-line;
}
</style>
