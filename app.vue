<template>
  <n-config-provider inline-theme-disabled :locale="zhCN" :date-locale="dateZhCN" :theme="themeMode"
    :theme-overrides="themeOverrides" class="bg-grid">
    <n-message-provider>
      <n-global-style />
      <NuxtLayout>
        <NuxtLoadingIndicator />
        <NuxtPage keepalive />
      </NuxtLayout>
      <!-- <n-back-top /> -->
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
/* import start*/
import { zhCN, dateZhCN } from "naive-ui";
/* import end */

/* composables start */
const { getThemeConfig, setThemeConfig } = useTheme();
const { themeOverrides, themeMode } = toRefs(useTheme());
const $route = useRoute();
/* composables end */

/* theme start */
const initTheme = () => {
  const themeConfig = getThemeConfig();
  setThemeConfig(themeConfig);
};
initTheme();
/* theme end */

/* useHead S */
watch(
  () => $route.meta.title,
  () => {
    if (!$route.meta.title) return;
    useHead({
      title: $route.meta.title || "Ayang Blog",
    });
  },
  {
    immediate: true,
  }
);
/* useHead E */
</script>

<style></style>
