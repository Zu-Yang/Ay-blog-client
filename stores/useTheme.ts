import { defineStore } from "pinia";
export const useTheme = defineStore("theme", () => {
  const theme = reactive({
    dark: false,
    color: "#2196F3",
  });

  // 获取本地主题配置
  const getThemeConfig = () => {
    const themeInfo = JSON.parse(
      localStorage.getItem("Ayang-blog-theme") as string
    );
    if (themeInfo) {
      Object.assign(theme, themeInfo);
      return theme;
    }
    return theme;
  };

  // 储存主题配置
  const setThemeConfig = (params: any) => {
    Object.assign(theme, params);
    localStorage.setItem("Ayang-blog-theme", JSON.stringify(params));
  };

  return {
    theme,
    getThemeConfig,
    setThemeConfig,
  };
});
