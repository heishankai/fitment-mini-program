<template>
  <view class="page">
    <scroll-view class="scroll-view" scroll-y>
      <!-- 标题区 -->
      <view class="title-section">
        <text class="main-title">智惠装小程序隐私条款</text>
        <view class="meta-list">
          <text class="meta-item">生效日期：2026年2月23日</text>
          <text class="meta-item">更新日期：2026年2月23日</text>
          <text class="meta-item">运营主体：智惠装</text>
        </view>
      </view>

      <!-- 正文 -->
      <view class="content">
        <!-- 一、引言 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">一、引言</text>
          </view>
          <text class="section-p">我们深知个人信息对您的重要性，并承诺依法保护您的个人信息安全。本《隐私条款》适用于"智惠装"小程序（以下简称"本小程序"），旨在清晰、透明地说明我们如何收集、使用、存储、共享和保护您的个人信息，以及您享有的相关权利。</text>
          <text class="section-p section-p-highlight">请您在使用本小程序前，仔细阅读并充分理解本条款。如您不同意本条款内容，请立即停止使用。</text>
        </section>

        <!-- 二、我们如何收集和使用您的个人信息 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">二、我们如何收集和使用您的个人信息</text>
          </view>
          <text class="section-p section-p-mb">为向您提供高效、便捷的辅材选购与配送服务，我们在最小必要原则下仅收集以下信息：</text>

          <!-- 1. 一键登录 -->
          <view class="info-card">
            <text class="info-card-title">1. 一键登录（获取手机号）</text>
            <view class="info-list">
              <view class="info-row">
                <text class="info-label">信息类型：</text>
                <text class="info-value">您的微信绑定手机号码</text>
              </view>
              <view class="info-row">
                <text class="info-label">收集方式：</text>
                <text class="info-value">通过微信官方 button(open-type="getPhoneNumber") 组件，在您主动点击"一键登录"按钮后获取</text>
              </view>
              <view class="info-row">
                <text class="info-label">使用目的：</text>
                <view class="info-sublist">
                  <text class="info-sublist-item">· 完成账号注册与登录；</text>
                  <text class="info-sublist-item">· 作为订单联系人，确保配送人员能及时与您沟通；</text>
                  <text class="info-sublist-item">· 发送订单状态通知（如发货、配送中）。</text>
                </view>
              </view>
              <view class="info-row">
                <text class="info-label">是否必需：</text>
                <text class="info-value">是（如不提供，将无法完成下单和接收配送服务）</text>
              </view>
            </view>
            <view class="info-tip info-tip-warn">
              <text class="info-tip-icon">⚠️</text>
              <text class="info-tip-text">我们不会存储您的原始手机号明文，仅用于本次会话及订单关联。</text>
            </view>
          </view>

          <!-- 2. 获取当前位置 -->
          <view class="info-card">
            <text class="info-card-title">2. 获取当前位置（用于派单）</text>
            <view class="info-list">
              <view class="info-row">
                <text class="info-label">信息类型：</text>
                <text class="info-value">您的实时地理位置（经纬度）</text>
              </view>
              <view class="info-row">
                <text class="info-label">收集方式：</text>
                <text class="info-value">调用微信 wx.getLocation API，在您点击"允许获取位置"后获取</text>
              </view>
              <view class="info-row">
                <text class="info-label">使用目的：</text>
                <view class="info-sublist">
                  <text class="info-sublist-item">· 自动匹配最近的仓库或配送站点；</text>
                  <text class="info-sublist-item">· 优化配送路线，提升送达效率。</text>
                </view>
              </view>
              <view class="info-row">
                <text class="info-label">是否必需：</text>
                <text class="info-value">否（您可手动输入收货地址代替，但可能影响配送时效）</text>
              </view>
            </view>
            <view class="info-tip info-tip-info">
              <text class="info-tip-icon">📍</text>
              <text class="info-tip-text">位置信息仅在本次会话中使用，不会长期存储，且不会用于用户画像或广告推送。</text>
            </view>
          </view>

          <!-- 3. 订单相关信息 -->
          <view class="info-card">
            <text class="info-card-title">3. 订单相关信息</text>
            <text class="info-card-desc">收货地址、商品信息、订单状态：用于完成交易、安排配送及售后服务。</text>
          </view>
        </section>

        <!-- 三、我们如何共享、转让、公开披露您的信息 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">三、我们如何共享、转让、公开披露您的信息</text>
          </view>
          <text class="section-p section-p-mb">我们不会出售或出租您的个人信息。仅在以下情形下共享：</text>
          <view class="ul-list">
            <view class="ul-item">
              <text class="ul-label">物流合作方：</text>
              <text class="ul-value">向配送服务商提供您的姓名、电话、收货地址、商品信息，仅用于完成订单配送；</text>
            </view>
            <view class="ul-item">
              <text class="ul-label">支付通道：</text>
              <text class="ul-value">通过微信支付处理订单，相关信息由微信官方处理，我们无法获取银行卡等敏感信息；</text>
            </view>
            <view class="ul-item">
              <text class="ul-label">法律要求：</text>
              <text class="ul-value">如国家机关依法调取，我们将配合提供必要信息。</text>
            </view>
          </view>
        </section>

        <!-- 四、我们如何保护您的个人信息 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">四、我们如何保护您的个人信息</text>
          </view>
          <view class="ul-list">
            <text class="ul-item-simple">· 采用 HTTPS 加密传输，防止数据泄露；</text>
            <text class="ul-item-simple">· 对手机号等敏感信息进行脱敏或加密存储；</text>
            <text class="ul-item-simple">· 严格限制内部员工访问权限；</text>
            <text class="ul-item-simple">· 所有数据均存储于中国境内服务器。</text>
          </view>
        </section>

        <!-- 五、您的权利 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">五、您的权利</text>
          </view>
          <text class="section-p section-p-mb">您有权：</text>
          <view class="ul-list">
            <view class="ul-item">
              <text class="ul-label">查询、更正收货信息：</text>
              <text class="ul-value">进入"我的订单"操作；</text>
            </view>
            <view class="ul-item">
              <text class="ul-label">删除信息：</text>
              <text class="ul-value">注销账号后，我们将删除您的非必要信息（法律法规要求保留的除外）；</text>
            </view>
            <view class="ul-item">
              <text class="ul-label">撤回授权：</text>
              <view class="ul-sublist">
                <text class="ul-sublist-item">· 微信 → 我 → 设置 → 隐私 → 授权管理 → 找到"智惠装" → 关闭权限；</text>
                <text class="ul-sublist-item">· 或在小程序内关闭位置授权；</text>
              </view>
            </view>
            <view class="ul-item">
              <text class="ul-label">注销账号：</text>
              <text class="ul-value">请联系客服处理（见下方联系方式）。</text>
            </view>
          </view>
        </section>

        <!-- 六、未成年人保护 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">六、未成年人保护</text>
          </view>
          <text class="section-p">本小程序主要面向成年人。如您未满14周岁，请在父母或监护人指导下使用，并确保已获得其同意。</text>
        </section>

        <!-- 七、隐私条款的更新 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">七、隐私条款的更新</text>
          </view>
          <text class="section-p">我们可能适时更新本条款。重大变更时，将通过小程序公告或弹窗通知。继续使用即视为接受更新。</text>
        </section>

        <!-- 八、联系我们 -->
        <section class="section">
          <view class="section-title">
            <view class="title-bar" />
            <text class="title-text">八、联系我们</text>
          </view>
          <text class="section-p section-p-mb">如您对本隐私条款有任何疑问，或需行使您的权利，请通过以下方式联系我们：</text>
          <view class="contact-card">
            <view class="contact-row">
              <text class="contact-label">客服邮箱：</text>
              <text class="contact-value">privacy@zhihuizhuang.com</text>
            </view>
            <view class="contact-row">
              <text class="contact-label">客服电话：</text>
              <text class="contact-value">400-888-XXXX</text>
              <text class="contact-note">（工作日 9:00–18:00）</text>
            </view>
            <view class="contact-row contact-row-block">
              <text class="contact-label">公司地址：</text>
              <text class="contact-value">[请在此处填写贵司注册地址]</text>
            </view>
          </view>
          <text class="section-p section-p-mt">我们将尽快响应您的请求。</text>
        </section>

        <!-- 底部提示 -->
        <view class="footer-tip">
          <text class="footer-tip-text">温馨提示：</text>
          <text class="footer-tip-text">本小程序严格遵守《中华人民共和国个人信息保护法》及微信平台《小程序用户隐私保护指引》，仅收集实现核心功能所必需的信息。感谢您对"智惠装"的信任！</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
// 隐私条款页面
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $uni-bg-color;
}

.scroll-view {
  height: 100vh;
}

.title-section {
  padding: 48rpx 40rpx 32rpx;
  text-align: center;
}

.main-title {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 32rpx;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.meta-item {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
}

.content {
  padding: 0 40rpx 80rpx;
}

.section {
  margin-bottom: 64rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.title-bar {
  width: 4rpx;
  height: 32rpx;
  background: $uni-color-primary;
  border-radius: 2rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #222;
}

.section-p {
  display: block;
  font-size: 28rpx;
  line-height: 1.8;
  color: $uni-text-color-grey;

  &.section-p-mb {
    margin-bottom: 32rpx;
  }

  &.section-p-mt {
    margin-top: 24rpx;
  }

  &.section-p-highlight {
    font-weight: 500;
    color: $uni-color-primary;
  }
}

.info-card {
  background: #f9fafb;
  border: 2rpx solid #f0f0f0;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.info-card-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.info-card-desc {
  font-size: 26rpx;
  color: $uni-text-color-grey;
  line-height: 1.7;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-row {
  font-size: 26rpx;
  line-height: 1.6;
}

.info-label {
  color: $uni-text-color-placeholder;
}

.info-value {
  color: $uni-text-color;
}

.info-sublist {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 8rpx;
}

.info-sublist-item {
  padding-left: 24rpx;
  color: $uni-text-color-grey;
}

.info-tip {
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
  padding: 16rpx;
  border-radius: 16rpx;
  margin-top: 24rpx;
}

.info-tip-warn {
  background: #fef2f2;
}

.info-tip-info {
  background: #f0f9ff;
}

.info-tip-icon {
  flex-shrink: 0;
  font-size: 24rpx;
}

.info-tip-warn .info-tip-text {
  font-size: 24rpx;
  color: #b91c1c;
}

.info-tip-info .info-tip-text {
  font-size: 24rpx;
  color: #0369a1;
}

.ul-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ul-item {
  font-size: 26rpx;
  line-height: 1.7;
  color: $uni-text-color-grey;
}

.ul-label {
  font-weight: 500;
  color: #333;
}

.ul-value {
  color: $uni-text-color-grey;
}

.ul-item-simple {
  font-size: 26rpx;
  line-height: 1.8;
  color: $uni-text-color-grey;
}

.ul-sublist {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 8rpx;
}

.ul-sublist-item {
  padding-left: 24rpx;
  font-size: 26rpx;
  color: $uni-text-color-grey;
}

.contact-card {
  background: #f5f7f6;
  border-radius: 24rpx;
  padding: 32rpx;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
  font-size: 26rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.contact-row-block {
    align-items: flex-start;
  }
}

.contact-label {
  flex-shrink: 0;
  width: 160rpx;
  color: $uni-text-color-placeholder;
}

.contact-value {
  font-weight: 500;
  color: #222;
}

.contact-note {
  font-size: 22rpx;
  color: $uni-text-color-placeholder;
}

.footer-tip {
  padding-top: 48rpx;
  margin-top: 48rpx;
  border-top: 2rpx solid #f0f0f0;
  text-align: center;
}

.footer-tip-text {
  display: block;
  font-size: 24rpx;
  line-height: 1.8;
  color: $uni-text-color-placeholder;
  margin-bottom: 8rpx;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
