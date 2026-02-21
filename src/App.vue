<script setup lang="ts">
import '@/static/iconfont.css'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style>
/* 全局背景色 */
page {
  box-sizing: border-box;
  background-color: var(--uni-bg-color-grey, #f5f5f5);
  margin: 0;
  padding: 0;
}
</style>
