<template>
  <nav
    :class="[
      'h-(--nav-height) fixed top-0 left-0 right-0 w-full z-[1001] transition-all duration-300 overflow-hidden  shadow-lg',
      {
        'bg-white/30 dark:bg-black/30': props.navBg,
        '-translate-y-full': isHidden,
      },
    ]"
  >
    <!-- iOS风格毛玻璃效果 -->
    <div class="absolute inset-0 backdrop-blur-xl"></div>

    <!-- 导航内容容器 -->
    <div
      class="relative max-w-5xl mx-auto px-4 h-full flex items-center justify-between"
    >
      <!-- 左侧Logo/博客名 -->
      <div class="flex items-center">
        <nuxt-link to="/" class="relative group perspective-1000">
          <div
            class="relative transform-style-3d hover:rotate-y-12 transition-transform duration-500"
          >
            <!-- 霓虹灯发光效果 -->
            <span
              class="absolute inset-0 bg-gradient-to-r from-transparent to-(--theme-color)/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></span>
            <!-- 主标题文字 -->
            <span class="relative inline-block">
              <!-- 文字悬浮时的上升动画 -->
              <span
                class="inline-block transform group-hover:-translate-y-1 transition-transform duration-300"
              >
                <span
                  class="bg-clip-text text-transparent bg-gradient-to-r from-transparent to-(--theme-color)/100 text-2xl md:text-2xl sm:text-xl font-bold typewriter-text"
                >
                  A'
                </span>
              </span>
              <span
                class="inline-block transform group-hover:-translate-y-1 transition-transform duration-300 delay-100 text-2xl md:text-2xl sm:text-xl font-bold typewriter-text"
              >
                yang
              </span>
            </span>
            <!-- 底部装饰线条 -->
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent to-(--theme-color)/100 group-hover:w-full transition-all duration-500"
            ></span>
          </div>
        </nuxt-link>
      </div>

      <!-- 右侧导航菜单 - PC端 -->
      <div class="hidden md:flex space-x-6">
        <div v-for="(item, index) in navOption" :key="index" class="relative">
          <nuxt-link :to="item.path" class="relative group perspective-1000">
            <div
              class="relative transform-style-3d hover:rotate-y-12 transition-transform duration-500"
            >
              <!-- 霓虹灯发光效果 -->
              <span
                class="absolute inset-0 bg-gradient-to-r from-transparent to-(--theme-color)/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></span>
              <!-- 导航文字 -->
              <span
                class="relative flex items-center px-4 py-1 text-base whitespace-nowrap"
              >
                <span
                  class="inline-block transform group-hover:-translate-y-1 transition-transform duration-300"
                  :class="{ 'text-(--theme-color)': activeKey === item.name }"
                >
                  {{ item.title }}
                </span>
              </span>
            </div>
          </nuxt-link>
        </div>
      </div>

      <!-- 移动端菜单按钮 -->
      <div class="md:hidden">
        <button
          @click="toggleMenu"
          class="relative p-2 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <div class="relative w-6 h-5 flex flex-col justify-between">
            <!-- iOS风格汉堡菜单线条 -->
            <span
              class="w-full h-0.5 bg-(--theme-color)/100 rounded-full transform transition-all duration-300"
              :class="{ 'rotate-45 translate-y-2': isMenuOpen }"
            ></span>
            <span
              class="w-full h-0.5 bg-(--theme-color)/70 rounded-full transition-all duration-300"
              :class="{ 'opacity-0': isMenuOpen }"
            ></span>
            <span
              class="w-full h-0.5 bg-(--theme-color)/40 rounded-full transform transition-all duration-300"
              :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"
            ></span>
          </div>
          <!-- 按钮激活态的高光效果 -->
          <!-- <div
            class="absolute inset-0 rounded-lg bg-gray-100 dark:bg-white/5 opacity-0 transition-opacity duration-200"
            :class="{ 'opacity-100': isMenuOpen }"
          ></div> -->
        </button>
      </div>

      <!-- WAP端导航菜单 -->
      <!-- 移动端菜单遮罩层 -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        leave-active-class="transition duration-300 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="isMenuOpen"
          class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
          @click="closeMenu"
        >
          <!-- 移动端菜单内容区 -->
          <Transition
            enter-active-class="transform transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]"
            leave-active-class="transform transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]"
            enter-from-class="translate-x-full opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="translate-x-full opacity-0"
          >
            <div
              v-show="isMenuOpen"
              class="absolute right-0 top-0 h-full w-72 bg-white/50 dark:bg-black/50 backdrop-blur-lg shadow-xl"
              @click.stop
            >
              <div class="p-6 space-y-4">
                <nuxt-link
                  v-for="(item, index) in navOption"
                  :key="index"
                  :to="item.path"
                  class="block py-3 px-4 rounded-xl transition-all duration-300 ease-out"
                  :class="[
                    activeKey === item.name
                      ? 'text-(--theme-color) bg-(--theme-color)/20'
                      : 'hover:bg-(--theme-color)/10 hover:translate-x-1 hover:opacity-90',
                  ]"
                  @click="closeMenu"
                >
                  {{ item.title }}
                </nuxt-link>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
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
    default: false,
  },
});

const activeKey = ref<string>("page-id");
const isHidden = ref(false);
const isMenuOpen = ref(false);
let lastScrollTop = 0;

const navOption = [
  {
    path: "/",
    name: "page-id",
    title: "🏠首页",
  },
  // {
  //   path: "/article/editor",
  //   name: "article-editor",
  //   title: "💤写文章",
  // },
  {
    path: "/about",
    name: "about",
    title: "💤关于",
  },
];

// 切换菜单显示状态
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value == true) {
    document.body.style.overflow = "hidden";
  }
};

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false;
  if (isMenuOpen.value == false) {
    document.body.style.overflow = "auto";
  }
};

// 监听滚动事件
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// 处理滚动逻辑，添加平滑过渡
const handleScroll = () => {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
    isHidden.value = true;
  } else {
    isHidden.value = false;
  }
  lastScrollTop = currentScrollTop;
};

watch(
  () => $route.path,
  () => {
    activeKey.value = $route.name as string;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
