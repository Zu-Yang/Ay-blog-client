import { computed } from "vue";
import { createDiscreteApi, darkTheme, lightTheme } from "naive-ui";
import type { ConfigProviderProps } from "naive-ui";

export default () => {
  const { getThemeConfig } = useTheme();

  const theme = getThemeConfig();

  const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: theme.dark ? darkTheme : lightTheme,
  }));

  const { message, notification, dialog, loadingBar, modal } =
    createDiscreteApi(
      ["message", "dialog", "notification", "loadingBar", "modal"],
      { configProviderProps: configProviderPropsRef }
    );

  const $msg = { message, notification, dialog, loadingBar, modal };

  return $msg;
};
