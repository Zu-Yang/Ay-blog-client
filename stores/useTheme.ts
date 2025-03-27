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
      localStorage.getItem("Ayang-blog-theme") as string
    );
    if (themeConfig) {
      Object.assign(themeConfig, themeConfig);
      return themeConfig;
    }
    return themeConfig;
  };

  const setThemeConfig = (params: { color: string, dark: boolean }) => {
    Object.assign(themeConfig, params);
    setHtmlProperty(params)
    setThemeOverrides(params)
    localStorage.setItem("Ayang-blog-theme", JSON.stringify(params));
  };

  return {
    themeConfig,
    themeMode,
    themeOverrides,
    getThemeConfig,
    setThemeConfig,
  };
});
