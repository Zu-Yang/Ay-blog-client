/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "app/*.{html,js,vue}", // 单文件路径
    "./components/**/*.{html,js,vue}",
    "./pages/**/*.{html,js,vue}",
    "./layouts/*.{html,js,vue}",
  ], // 定义需要扫描的模板文件路径
  theme: {
    extend: {}, // 自定义扩展
  },
  corePlugins: {
    // 启用line-clamp插件
    lineClamp: true,
  },
};
