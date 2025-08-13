<template>
  <div class="m-auto mx-auto max-w-256 px-4 pt-6">
    <div v-if="articleTopPageList.length" class="mb-10">
      <div class="flex mb-6">
        <div :class="[
          'mr-2 px-4 py-1 rounded-2xl cursor-pointer bg-(--button-bg) shadow-[0px_5px_15px_-3px_var(--button-bg)]) transition-all active:scale-95',
          {
            'hover:bg-(--button-hover-bg) shadow-(--button-hover-bg)':
              topType !== item.type,
            'bg-(--theme-color) shadow-[0px_5px_15px_-3px_var(--theme-color)]':
              topType === item.type,
          },
        ]" v-for="item in topOption" :key="item.type">
          {{ item.title }}
        </div>
      </div>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" v-auto-animate="{ duration: 500 }">
        <!-- 需要将 v-auto-animate 移到n-grid-item的父容器，并确保n-grid-item每个项的key是唯一的，比如使用数据ID而非索引。 -->
        <div id="scroll-animation" v-for="(data, index) in articleTopPageList" :key="data.article_id">
          <div
            class="rounded-2xl shadow-xl overflow-hidden border-none bg-white dark:bg-black dark:hover:bg-[#222] hover:bg-[#eee] transition-colors cursor-pointer group relative">
            <!-- 置顶标识 -->
            <div v-if="data.article_top"
              class="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10 select-none pointer-events-none drop-shadow-xl">
              <div
                class="absolute top-1/5 -right-3/5 w-[120px] transform rotate-45 bg-[var(--theme-color)]/70 text-white text-xs text-center py-1">
                置顶
              </div>
            </div>
            <div class="w-full h-[200px]">
              <Swipe :items="data.article_cover" :title="data.article_title"></Swipe>
            </div>
            <nuxt-link :to="`/detail/${data.article_id}`" :title="data.article_title" class="block p-4 h-[152px]">
              <div class="h-full relative">
                <!-- 标题部分 -->
                <div class="line-clamp-1 overflow-hidden text-ellipsis font-bold text-base mb-2">
                  <span class="truncate">{{ data.article_title }}</span>
                </div>
                <!-- 摘要部分 -->
                <div
                  class="text-[var(--color1)] line-clamp-3 transition-[color_0.3s_var(--n-bezier)] text-sm leading-5 mb-2">
                  {{ data.article_summary }}
                </div>
                <!-- 时间部分 -->
                <div class="flex justify-end items-center space-x-1 text-[var(--color2)] absolute bottom-0 right-0">
                  <SvgIcon name="time" size="14" class="shrink-0" />
                  <n-time :time="new Date(data.article_create_time)" format="yyyy-MM-dd" class="text-sm" />
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-6">
        <div v-if="articleTopPageList.length <= articleTopList.length && articleTopPageList.length > 3" :class="[
          'px-4 py-1 mr-2 rounded-2xl cursor-pointer border-1 transition-transform active:scale-95 opacity-60 hover:opacity-100 hover:border-(--theme-color) hover:text-(--theme-color)',
        ]" @click="handleMore">
          显示更多
        </div>
        <div v-if="articleTopPageList.length > articleTopList.length && articleTopPageList.length > 3" :class="[
          'px-4 py-1 rounded-2xl cursor-pointer border-1 transition-transform active:scale-95 opacity-60 hover:opacity-100 hover:border-(--theme-color) hover:text-(--theme-color)',
        ]" @click="handleRetract">
          收起
        </div>
      </div>
    </div>
    <div class="mb-10">
      <div class="flex mb-6">
        <div :class="[
          'mr-2 px-4 py-1 rounded-2xl cursor-pointer bg-(--button-bg)  shadow-[0px_5px_15px_-3px_var(--button-bg)] transition-all active:scale-95',
          {
            'hover:bg-(--button-hover-bg)': sortType !== item.type,
            'bg-(--theme-color) shadow-[0px_5px_15px_-3px_var(--theme-color)]':
              sortType === item.type,
          },
        ]" v-for="item in sortList" :key="item.type" @click="handleSort(item.type)">
          {{ item.title }}
        </div>
      </div>
      <div v-if="pagination.total" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        v-auto-animate="{ duration: 500 }">
        <!-- 需要将 v-auto-animate 移到n-grid-item的父容器，并确保n-grid-item每个项的key是唯一的，比如使用数据ID而非索引。 -->
        <div id="scroll-animation" v-for="(data, index) in articleList" :key="data.article_id">
          <div
            class="rounded-2xl shadow-xl overflow-hidden border-none bg-white dark:bg-black dark:hover:bg-[#222] hover:bg-[#eee] transition-all cursor-pointer group">
            <div class="w-full h-[200px]">
              <Swipe :items="data.article_cover" :title="data.article_title"></Swipe>
            </div>
            <nuxt-link :to="`/detail/${data.article_id}`" :title="data.article_title" class="block p-4 h-[152px]">
              <div class="h-full relative">
                <!-- 标题部分 -->
                <div class="line-clamp-1 overflow-hidden text-ellipsis font-bold text-base mb-2">
                  <span class="truncate">{{ data.article_title }}</span>
                </div>
                <!-- 摘要部分 -->
                <div
                  class="text-[var(--color1)] line-clamp-3 transition-[color_0.3s_var(--n-bezier)] text-sm leading-5 mb-2">
                  {{ data.article_summary }}
                </div>
                <!-- 时间部分 -->
                <div class="flex justify-end items-center space-x-1 text-[var(--color2)] absolute bottom-0 right-0">
                  <SvgIcon name="time" size="14" class="shrink-0" />
                  <n-time :time="new Date(data.article_create_time)" format="yyyy-MM-dd" class="text-sm" />
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-else>
        <n-result status="404" title="" description="">
          <template #icon>
            <svg-icon name="empty" size="400"></svg-icon>
          </template>
        </n-result>
      </div>
      <n-pagination v-if="pagination.count" v-model:page="pagination.curPage" :page-count="pagination.count"
        :on-update:page="(page: number) => $router.push(`/page/${page}`)" class="flex justify-center mt-12">
      </n-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const $router = useRouter();
const $usePage = usePage();
const { pagination, category, sortType, topType, articleTopList } = toRefs($usePage);

const pageNum = ref<number>(1); // 当前页码
const limitNum = ref<number>(3); // 每页显示的数量
const categoryId = ref<number>(1);
const articleList = ref<any[]>([]);
const sortList = ref([
  {
    title: "最新",
    type: "new",
    icon: "sort-new",
  },
  {
    title: "最热",
    type: "hot",
    icon: "sort-hot",
  },
  {
    title: "最多评论",
    type: "comment",
    icon: "sort-comment",
  },
  {
    title: "最多点赞",
    type: "like",
    icon: "sort-like",
  },
]);
const topOption = ref([
  {
    title: "置顶文章",
    type: "top",
    icon: "sort-top",
  },
]);

const articleTopPageList = computed(() => {
  return articleTopList.value.slice(0, pageNum.value * limitNum.value);
});

const handleMore = () => {
  if (pageNum.value * limitNum.value >= articleTopList.value.length) return;
  pageNum.value++;
};
const handleRetract = () => {
  if (pageNum.value == 1) return;
  pageNum.value = 1;
};

const handleCate = (cateId: number) => { };

const handleSort = async (type: string) => {
  console.log(pagination.value);
  if (sortType.value == type) return;
  await $usePage.getArticleList({
    page: pagination.value.curPage,
    orderBy: type,
  });
  sortType.value = type;
};

watch(
  () => pagination.value.dataList,
  () => {
    articleList.value = [...pagination.value.dataList];
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  useScrollReveal("#scroll-animation");
});
</script>
