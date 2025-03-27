/**
 * fetch()的网络请求封装
 * @param options 请求参数
 * @returns 响应结果
 */

export const fetch = (url: string, options: object = {}) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL;

  return new Promise<void>((resolve, reject) => {
    $fetch(
      url, // 请求api接口地址
      {
        // method, body, query, ...
        ...options,
        // ofetch 库会自动识别请求地址，对于url已包含域名的请求不会再拼接baseURL
        baseURL,
        // 请求拦截
        onRequest({ request, options }) {
          /**如果接口需求携带token请求，则可先自行使用官方的useCookie()方法设置Cookie存储后，再使用useCookie()方法，取出token使用。如下例子：*/
          //const token = useCookie('token')
          //@ts-ignore
          //options.headers.Authorization = token.value||null
        },
        // 请求错误拦截
        onRequestError(e) {
          reject(e);
        },
        // 响应拦截
        onResponse({ request, response, options }) {
          resolve(response._data); // 处理响应数据
        },
        // 响应错误拦截
        onResponseError(e) {
          reject(e);
        },
      }
    );
  });
};
