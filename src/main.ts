import type { App } from 'vue'
import { createSSRApp } from 'vue'
import AppComponent from './App.vue'

export function createApp(): { app: App } {
  const app = createSSRApp(AppComponent)
  return { app }
}
