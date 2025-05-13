// 全局路由中间件
export default defineNuxtRouteMiddleware((to, from) => {
  // console.log(to, from);
  // 如果路径相同但哈希值不同，则阻止默认导航并手动滚动到锚点
  if (to.path === from.path && to.hash !== from.hash) {
    // 阻止默认导航行为
    return abortNavigation(to.path);
  }

  // 未匹配的路由重定向至404页面
  if (to.path === "/") {
    return navigateTo("/page/1");
  }

  // 根据路由匹配布局
  if (to.path === "/article/editor") {
    setPageLayout("editor");
  } else {
    setPageLayout("default");
  }
});
