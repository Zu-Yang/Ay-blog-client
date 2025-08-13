import { defineStore } from "pinia";
import { darkTheme, commonDark, type GlobalTheme, type GlobalThemeOverrides } from "naive-ui";
import { generate } from '@ant-design/colors'

export const useTheme = defineStore("theme", () => {
  const themeOverrides = ref<GlobalThemeOverrides>({});
  const themeMode = ref<GlobalTheme | null>(null); // null为亮色，darkTheme为暗色
  const themeConfig = reactive({
    dark: false,
    color: "#2196F3",
  });

  const setHtmlProperty = (params: { color: string, dark: boolean }) => {
    const { color, dark } = params
    themeMode.value = dark ? darkTheme : null
    const html = document.getElementsByTagName("html")[0] as HTMLElement;
    html.style.setProperty("--theme-color", color); // 使用 setProperty 方法设置css自定义属性
    if (dark) {
      html.className = "dark sr";
    } else {
      html.className = "light sr";
    }
  };

  const setThemeOverrides = (params: { color: string, dark: boolean }) => {
    const { color, dark } = params
    const generateColors = dark
      ? generate(color, {
        theme: 'dark',
        backgroundColor: commonDark.bodyColor
      })
      : generate(color)

    const commonColors = {
      primaryColor: generateColors[5],
      primaryColorHover: generateColors[4],
      primaryColorSuppl: generateColors[4],
      primaryColorPressed: generateColors[6]
    }

    themeOverrides.value.common = commonColors;
  };

  const getThemeConfig = () => {
    const themeConfig = JSON.parse(
      localStorage.getItem("THEME_INFO") as string
    );
    if (themeConfig) {
      Object.assign(themeConfig, themeConfig);
      return themeConfig;
    }
    return themeConfig;
  };

  const setThemeConfig = (params: { color: string, dark: boolean } | null) => {
    // 使用解构赋值从params或themeConfig中提取color和dark属性
    // 如果params为null或undefined，则使用themeConfig作为默认值
    // 这样可以避免空值错误，并确保总是能获取到有效的主题配置
    const { color, dark } = params ?? themeConfig;

    // 合并主题配置
    Object.assign(themeConfig, { color, dark });

    // 设置HTML属性
    setHtmlProperty({ color, dark });

    // 设置主题覆盖
    setThemeOverrides({ color, dark });

    // 持久化存储主题配置
    try {
      localStorage.setItem("THEME_INFO", JSON.stringify({ color, dark }));
    } catch (error) {
      console.error("Failed to save theme config to localStorage:", error);
    }
  };

  return {
    themeConfig,
    themeMode,
    themeOverrides,
    getThemeConfig,
    setThemeConfig,
  };
});
