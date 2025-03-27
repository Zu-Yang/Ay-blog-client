// app.config.ts 文件用于公开可在构建时确定的公共变量。 与 runtimeConfig 选项相反，这些不能使用环境变量覆盖。
// 使用: const appConfig = useAppConfig() 暴露给应用程序。

export default defineAppConfig({
  navH: 55,
  bp: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }
})