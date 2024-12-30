<template>
  <div :class="['nav', { 'nav-bg': props.navBg }]">
    <n-space justify="center">
      <n-menu
        mode="horizontal"
        :value="menuKey"
        :options="menuOptions"
        :on-update:value="(key: string, item: MenuOption) => menuKey = key"
      />
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import type { MenuOption } from "naive-ui";
import { RouterLink, useRouter, useRoute } from "vue-router";
const $route = useRoute();
const props = defineProps({
  navBg: {
    type: Boolean,
    defalt: false,
  },
});
const menuKey = ref<string>("page-id");
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "index",
            params: {},
          },
        },
        { default: () => "🏠首页" }
      ),
    key: "page-id",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "article-editor",
            params: {},
          },
        },
        { default: () => "💤写文章" }
      ),
    key: "article-editor",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "about",
            params: {},
          },
        },
        { default: () => "💤关于" }
      ),
    key: "about",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "result-404",
            params: {},
          },
        },
        { default: () => "👽404" }
      ),
    key: "result-404",
  },
];

watch(
  () => $route.path,
  () => {
    menuKey.value = $route.name as string;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  z-index: 10;
  transition: var(--transition);
  &.nav-bg {
    // box-shadow: var(--box-shadow-3);
    // background-color: var(--bg-nav-color);
    // /* 半透明背景 */
    // backdrop-filter: blur(4px);
    // /* 背景模糊 */
    // -webkit-backdrop-filter: blur(4px);

    background-image: radial-gradient(transparent 1px, var(--bg-color) 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
  }
}
:deep(.n-menu .n-menu-item) {
  height: 50px;
}

:deep(.n-menu .n-menu-item-content--selected) {
  border-bottom: 2px solid var(--n-item-text-color-active) !important;
}
</style>
