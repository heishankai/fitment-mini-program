import type { App } from 'vue'
import { createSSRApp } from 'vue'
import AppComponent from './App.vue'
// #ifdef MP-WEIXIN
import mpShareMixin from './mixins/mp-share'
// #endif

export function createApp(): { app: App } {
  const app = createSSRApp(AppComponent)

  // #ifdef MP-WEIXIN
  app.mixin(mpShareMixin)
  // #endif

  return { app }
}
