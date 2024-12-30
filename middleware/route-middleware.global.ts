// 全局路由中间件
export default defineNuxtRouteMiddleware((to, from) => {
  const $router = useRouter();
  // 未匹配的路由重定向至404页面
  if (!to.matched.length) {
    // return (window.location.href = "/result/404"); // 使用 window.location.href 进行页面跳转和刷新
    return $router.push("/result/404"); // 使用 window.location.href 进行页面跳转和刷新
  } else if (to.path === "/") {
    return $router.push("/page/1");
  }
  // 根据路由匹配布局
  if (to.path === "/result/404") {
    setPageLayout("404");
  } else if (to.path === "/article/editor") {
    setPageLayout("editor");
  } else {
    setPageLayout("default");
  }
});
