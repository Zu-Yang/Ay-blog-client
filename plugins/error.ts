export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (err: any) => {
    // const { message } = useDiscreteApi();

    // 处理特定错误
    // if (err.statusCode === 404) {
    //   navigateTo('/result/404');
    //   return;
    // }
    // console.error(err);

    // 显示错误消息
    // message.error(err.message || '发生未知错误');
  });
});
