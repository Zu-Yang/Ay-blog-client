<template>
  <nav
    :class="[
      'h-(--navH) flex items-center justify-center fixed top-0 left-0 right-0 w-full z-[1001] transition-all shadow-[0_0px_15px_var(--bg-nav-color)] backdrop-filter-[blur(16px)]',
      {
        'bg-[var(--bg-nav-color)]': props.navBg,
        '-translate-y-full': isHidden,
      },
    ]"
    :style="{
      '--navH': appConfig.navH + 'px',
    }"
  >
    <div
      :class="[
        'text-sm mx-4 relative line-clamp-1 text-nowrap group',
        { 'text-[var(--theme-color)]': activeKey === item.name },
      ]"
      v-for="(item, index) in navOption"
      :key="index"
      @click="activeKey = item.name"
    >
      <nuxt-link class="inline-block py-2" :to="`${item.path}`">{{
        item.title
      }}</nuxt-link>
      <span
        class="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--theme-color)] transition-all duration-300 opacity-0 scale-x-0 origin-center group-hover:opacity-100 group-hover:scale-x-100"
        :class="{ 'opacity-100 scale-x-100': activeKey === item.name }"
      ></span>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { RouterLink, useRouter, useRoute } from "vue-router";

const appConfig = useAppConfig();
const $route = useRoute();
const props = defineProps({
  navBg: {
    type: Boolean,
    defalt: false,
  },
});

const activeKey = ref<string>("page-id");
const isHidden = ref(false);
let lastScrollTop = 0;

// 监听滚动事件
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// 处理滚动逻辑
const handleScroll = () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  // 向下滚动时隐藏导航栏，向上滚动时显示导航栏
  if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
    isHidden.value = true;
  } else {
    isHidden.value = false;
  }
  lastScrollTop = currentScrollTop;
};

const navOption = [
  {
    path: "/",
    name: "page-id",
    title: "🏠首页",
  },
  {
    path: "/article/editor",
    name: "article-editor",
    title: "💤写文章",
  },
  {
    path: "/about",
    name: "about",
    title: "💤关于",
  },
  // {
  //   path: "/result-404",
  //   name: "result-404",
  //   title: "👽404",
  // },
];

watch(
  () => $route.path,
  () => {
    activeKey.value = $route.name as string;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
