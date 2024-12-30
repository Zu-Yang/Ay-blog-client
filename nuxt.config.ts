import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // 页面过渡
    pageTransition: { name: "slide", mode: "out-in" },
    // 布局过渡
    layoutTransition: { name: "slide", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/logo.jpg" }],
      script: [
        {
          // src: "https://api.suyanw.cn/api/mouse/yinghua.js",
          // tagPosition: "bodyClose", // 有关操作dom的js需要插入body后,否则获取不到dom
          // async: true,
          // defer: true,
        },
      ],
      htmlAttrs: {},
      bodyAttrs: {
        class: "",
      },
    },
  },
  // 全局变量
  runtimeConfig: {
    // apiSecret 只能在服务器端上访问
    apiSecret: "",
    // public 命名空间中定义的，在服务器端和客户端都可以普遍访问
    public: {
      baseURL: process.env.NUXT_PUBLIC_API_BASE, // nestjs api地址
      imageBaseURL: process.env.MINIO_ARTICLE_IMAGE_API_BASE, // minio api地址
    },
  },
  imports: {
    // Auto-import pinia stores defined in `~/stores`
    dirs: ["~/stores", "~/composables"],
  },
  ssr: false,
  plugins: [],
  modules: [
    "nuxt-swiper",
    "nuxtjs-naive-ui",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        // 自动导入 import { defineStore } from 'pinia'
        // store解构后会丢失响应式，解构使用storeToRefs保持响应式
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    [
      "@pinia-plugin-persistedstate/nuxt",
      {
        // 持久化pinia，指定 localStorage 作为持久化存储的方式。
        storage: "localStorage",
      },
    ],
  ],
  devServer: {
    host: "0.0.0.0",
    port: 8080,
  },
  router: {
    options: {
      // 其他路由配置...
      // hashMode: true, // 哈希路由
      // scrollBehaviorType: "smooth",
    },
  },
  vite: {
    plugins: [
      // svg图标
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "assets/images/svg")], // 存放svg的文件夹
      }),
      // 自动导入组件
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      // 自动注册组件
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
  // 自动导入components组件
  components: [
    {
      path: "~/components/common",
      pathPrefix: false,
    },
  ],
  build: {},
  devtools: { enabled: false },
  css: [
    "~/assets/css/main.min.css",
    "~/assets/css/reset.css",
    "~/assets/css/root.css",
  ],
  // https://nuxt.com/docs/api/configuration/nuxt-config
  nitro: {
    devProxy: {
      "/api": {
        // target: "http://10.4.32.45:3000",
        target: process.env.NUXT_PUBLIC_API_BASE,
        changeOrigin: true,
      },
    },
  },
  // compatibilityDate: "2024-09-13",
});
