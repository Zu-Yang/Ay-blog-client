// 给自定义 $nprogress 插件添加类型
import type { NProgress } from 'nprogress';
declare module '#app' {
  interface NuxtApp {
    $nprogress: NProgress
  }
};