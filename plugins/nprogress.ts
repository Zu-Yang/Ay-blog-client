import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置默认参数
NProgress.configure({
  easing: "ease", // 动画方式
  speed: 200, // 递增进度条的速度
  showSpinner: false, // 是否显示加载icon
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.4, // 更改启动时使用的最小百分比
  parent: "body", //指定进度条的父容器
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('nprogress', NProgress)
}) 