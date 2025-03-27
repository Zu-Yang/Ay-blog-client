export default defineNuxtPlugin((nuxtApp) => {
  // 全局错误处理
  nuxtApp.hook("vue:error", (err: any) => {
    const { message } = useDiscreteApi();
    message.error(err.message);
  });
});
