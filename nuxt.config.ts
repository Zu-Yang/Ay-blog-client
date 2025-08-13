import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import tailwindcss from '@tailwindcss/vite'

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
      link: [{ rel: "icon", type: "image/x-icon", href: "public/favicon.ico" }],
      script: [
        { src: '/live2d/static/l2d.js' },
        { src: '/live2d/static/pio.js' }
      ],
      htmlAttrs: {},
      bodyAttrs: {},
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
    // app: {
    //   baseURL: process.env.NUXT_PUBLIC_API_BASE, // nestjs api地址
    // },
  },

  imports: {
    // Auto-import pinia stores defined in `~/stores`
    dirs: ["~/stores", "~/composables"],
  },

  ssr: false,
  plugins: [],

  modules: [
    "@formkit/auto-animate/nuxt",
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
    host: "http://10.4.32.45/",
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
      tailwindcss(),
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
  devtools: { enabled: false }, // 禁用开发工具

  css: [
    "~/assets/css/root.css",
    "~/assets/css/tailwind.css",
    "~/assets/css/reset.min.css",
    "~/public/live2d/static/pio.css",
  ],

  // https://nuxt.com/docs/api/configuration/nuxt-config
  // compatibilityDate: "2024-09-13",
  nitro: {
    output: {
      dir: "./dist", // 打包路径
      publicDir: "./dist/public", // 静态资源打包路径
      serverDir: "./dist/server", // 服务打包路径
    },
    // 预渲染
    prerender: {
      crawlLinks: true,
      routes: ["/page/1"],
    },
    devProxy: {
      "/api": {
        // target: "http://10.4.32.45:3000",
        target: process.env.NUXT_PUBLIC_API_BASE,
        changeOrigin: true,
      },
    },
  },
  compatibilityDate: "2024-12-30",
});