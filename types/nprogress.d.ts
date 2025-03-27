import type { NProgress } from 'nprogress'

// 给自定义 $nprogress 插件添加类型
declare module '#app' {
  interface NuxtApp {
    $nprogress: NProgress
  }
} 