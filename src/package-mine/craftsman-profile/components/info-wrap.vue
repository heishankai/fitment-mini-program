<template>
  <view class="info-wrap">
    <image class="avatar" :src="craftsman_user?.avatar" mode="aspectFill" />
    <view class="nickname">{{ craftsman_user?.nickname }}</view>
    <view class="work_kind_name_wrap">
      <text> 工种：{{ craftsman_user?.skillInfo?.work_kind_name }}</text>
      <text class="dot"></text>
      <text>{{ craftsman_user?.skillInfo?.work_years }}年工龄</text>
    </view>
    <view class="tags-wrap">
      <view class="tag" v-if="craftsman_user?.isVerified">
        <view class="tag-icon">
          <uni-icons custom-prefix="iconfont" type="icon-anquanbaozhang" size="14" color="#2d635e" />
        </view>
        <text>实名认证</text>
      </view>
      <view class="tag" v-if="craftsman_user?.isSkillVerified">
        <view class="tag-icon">
          <uni-icons custom-prefix="iconfont" type="icon-xunzhang" size="14" color="#2d635e" />
        </view>
        <text>技能认证</text>
      </view>
    </view>
    <view class="description" v-if="craftsman_user?.skillInfo?.skill_intro">
      {{ craftsman_user?.skillInfo?.skill_intro }}
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  craftsman_user?: any
}>()
</script>

<style lang="scss" scoped>
uni-icons {
  display: flex;
  align-items: center;
}

.info-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .avatar {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    border: 3.5px solid #f9fafa;
    background: #f0f0f0;
  }

  .nickname {
    margin-top: 12px;
    color: #222;
    font-size: 28px;
    font-weight: 700;
    line-height: 42px;
    letter-spacing: -0.317px;
  }

  .work_kind_name_wrap {
    margin-top: 12px;
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: -0.15px;

    .dot {
      margin: 0 8px;
      width: 4px;
      height: 4px;
      flex-shrink: 0;
      border-radius: 50%;
      background: #d9d9d9;
    }
  }

  .tags-wrap {
    margin-top: 12px;
    display: flex;
    align-items: center;

    .tag {
      margin-right: 12px;
      padding: 8px 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 2px;
      border: 0.701px solid #e5e5e5;

      .tag-icon {
        display: flex;
        align-items: center;
        line-height: 0;
      }

      text {
        color: #222;
        font-size: 12px;
        font-weight: 500;
        line-height: 14px;
      }
    }
  }

  .description {
    margin-top: 24px;
    padding: 16px;
    border-radius: 12px;
    background: #f9fafa;
    color: #666;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    line-height: 22.75px;
    letter-spacing: -0.15px;
  }
}
</style>
