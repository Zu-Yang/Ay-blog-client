<template>
  <n-config-provider
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="themeMode"
    :theme-overrides="themeOverrides"
    class="bg-grid"
  >
    <n-global-style />
    <n-loading-bar-provider>
      <NuxtLayout>
        <NuxtLoadingIndicator />
        <NuxtPage keepalive />
      </NuxtLayout>
    </n-loading-bar-provider>
    <FlaotButton
      v-if="$route.meta.layout !== '404'"
      @changeTheme="getThemeOverrides"
      @changeThemeMode="getThemeMode"
    />
  </n-config-provider>
</template>
<script setup lang="ts">
/* import start*/
import { h } from 'vue'
import { ref, onMounted } from "vue"; // 确保引入 onMounted
import { darkTheme, zhCN, NAvatar, NImage, dateZhCN, type GlobalTheme, type GlobalThemeOverrides } from "naive-ui";
import { fetch } from '#build/imports';
/* import end */

/* composables start */
const { loadingBar, notification } = useDiscreteApi();
const $router = useRouter();
const $route = useRoute();
/* composables end */

/* theme start */
const themeOverrides = ref<GlobalThemeOverrides>({});
const themeMode = ref<GlobalTheme | null>(null); // null为亮色，darkTheme为暗色
const getThemeOverrides = (commonColors: object) => {
  themeOverrides.value.common = commonColors;
};
const getThemeMode = (value: boolean) => {
  themeMode.value = value ? darkTheme : null;
  const html = document.getElementsByTagName("html")[0] as HTMLElement;
  if (value) {
    html.className = "dark";
  } else {
    html.className = "light";
  }
};
/* theme end */

/* useHead S */
watch(() =>$route.meta.title,()=>{
  if(!$route.meta.title) return
  useHead({
    title: $route.meta.title || "Ayang Blog",
  });
},{
  immediate:true,
  deep:false
})
/* useHead E */
</script>

<style></style>
