<template>
  <article
    class="relative max-w-3xl min-h-dvh mx-auto pt-(--nav-height) px-4 lg:px-0 transition-transform"
    :class="{ 'scale-98 ': showComment }"
  >
    <!-- 侧边按钮 -->
    <div class="max-lg:hidden sticky top-230 bottom-0">
      <div class="absolute bottom-0 -translate-x-full pr-5">
        <div
          id="live2d-like"
          class="flex items-center justify-items-center flex-col cursor-pointer mb-2 select-none"
          @click="likeHandle"
        >
          <SvgIcon
            class="transition-all hover:scale-105 active:scale-95 hover:text-(--theme-color)"
            name="thumb2"
            size="34"
            :color="likeStatus ? 'var(--theme-color)' : ''"
          ></SvgIcon>
          <div>
            {{ likeCount }}
          </div>
        </div>
        <div
          id="live2d-read"
          class="flex items-center justify-items-center flex-col cursor-pointer mb-2 select-none"
        >
          <SvgIcon
            class="transition-all hover:scale-105 active:scale-95 hover:text-(--theme-color)"
            name="browse"
            size="34"
          />
          <div>
            {{ readCount }}
          </div>
        </div>
        <div
          id="live2d-comment"
          class="flex items-center justify-items-center flex-col cursor-pointer mb-2 select-none"
          @click="showComment = true"
        >
          <SvgIcon
            class="transition-all hover:scale-105 active:scale-95 hover:text-(--theme-color)"
            name="comment"
            size="30"
          />
          <div>
            {{ commentCount }}
          </div>
        </div>
      </div>
    </div>
    <!-- 侧边目录 -->
    <div class="max-lg:hidden sticky top-0">
      <MdCatalog
        class="w-[200px] absolute top-(--nav-height) right-0 translate-x-full pl-5"
        :editorId="editorId"
        :theme="theme"
        :scrollElement="scrollElement"
        :scrollElementOffsetTop="0"
      />
    </div>
    <!-- 主题内容 -->
    <div class="w-full pt-10">
      <!-- 标题 -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-center line-clamp-1">
          {{ articleInfo.article_title }}
        </h2>
      </div>
      <!-- 时间&分类 -->
      <div class="flex justify-center mb-6">
        <span class="flex items-center mr-4">
          <SvgIcon class="mr-1" name="time" size="16" />
          <n-time
            :time="new Date(articleInfo.article_create_time)"
            type="date"
          />
        </span>
        <span class="flex items-center">
          <SvgIcon class="mr-1" name="link" size="16" />
          <RouterLink
            class="category"
            :to="`/category/${articleInfo.category_id}`"
          >
            {{ articleInfo.category.category_name }}
          </RouterLink>
        </span>
      </div>
      <!-- 移动端顶栏 -->
      <div
        class="lg:hidden bottom-20 flex items-center justify-items-center justify-center mb-6"
      >
        <div
          class="flex items-center justify-items-center cursor-pointer mr-4 select-none"
          @click="showComment = true"
        >
          <SvgIcon
            class="mr-1 transition-all hover:scale-105 active:scale-95 hover:text-(--theme-color)"
            name="comment"
            size="16"
          />
          <span>
            {{ commentCount }}
          </span>
        </div>
        <div
          class="flex items-center justify-items-center cursor-pointer mr-4 select-none"
          @click="likeHandle"
        >
          <SvgIcon
            class="mr-1 transition-all hover:scale-105 active:scale-95 hover:text-(--theme-color)"
            name="thumb2"
            size="20"
            :color="likeStatus ? 'var(--theme-color)' : ''"
          ></SvgIcon>
          <span class="text-center">
            {{ likeCount }}
          </span>
        </div>
        <div
          class="flex items-center justify-items-center cursor-pointer select-none hover:text-(--theme-color)"
        >
          <SvgIcon
            class="mr-1 transition-all hover:scale-105 active:scale-95"
            name="browse"
            size="20"
          />
          <span>
            {{ readCount }}
          </span>
        </div>
      </div>
      <!-- 摘要 -->
      <div class="rounded-xl mb-6 p-4 bg-white shadow-xl dark:bg-black">
        <div class="mb-2">
          <SvgIcon name="ginger-cat" size="30" />
          <span> 摘要 </span>
        </div>
        <p class="line-clamp-4">
          {{ articleInfo.article_summary }}
        </p>
      </div>
      <MdPreview
        class="rounded-xl mb-6 p-4 bg-white shadow-xl dark:bg-black"
        v-model="articleInfo.article_content"
        :editorId="editorId"
        :theme="theme"
      />
    </div>
    <!-- 评论组件 -->
    <Comment
      :show="showComment"
      :articleId="parseInt($route.params.id as string)"
      @commentCount="(count) => (commentCount = count)"
      @change="(show) => (showComment = show)"
    ></Comment>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from "vue";
import { MdCatalog, MdPreview } from "md-editor-v3";


/* composables S */
const $route = useRoute();
const $http = useHttp();
const { message } = useDiscreteApi();
/* composables E */

/* 数据声明 S */
const { navBg } = toRefs(useMenu());
const { themeConfig } = toRefs(useTheme());
const { getIP } = useLocal();
const { articleInfo, articleCount, visitorInfo } = useDetail();

const showComment = ref<boolean>(false);
const readCount = ref<number>(articleCount.readCount);
const likeCount = ref<number>(articleCount.likeCount);
const likeStatus = ref<boolean>(articleCount.likeStatus);
const commentCount = ref<number>(articleCount.commentCount);
const editorId = "preview-only";
const scrollElement = document.documentElement;
/* 数据声明 E */

/* 数据获取 S */
definePageMeta({
  middleware: [
    async (to, from) => {
      const { getDetail } = useDetail();
      const { $nprogress } = useNuxtApp();
      try {
        $nprogress.start();
        const id = parseInt(to.params.id as string);
        await getDetail(id);
        $nprogress.done();
        return true;
      } catch (error) {
        $nprogress.done();
        console.error(error);
      }
    },
  ],
});
/* 数据获取 E */

/* 应用程序 S */
/**
 * markdown主题切换
 */
const theme = computed(() => {
  return themeConfig.value.dark ? "dark" : "light";
});

/**
 * 点赞
 * @returns
 */
const likeHandle = async () => {
  const id = parseInt($route.params.id as string);
  const { country, short_name, province, city, area, isp, net, ip } =
    await getIP();
  const res = await $http.article.setLikeStatus({
    country,
    short_name,
    province,
    city,
    area,
    isp,
    net,
    ip,
    article_id: id,
    status: !likeStatus.value,
  });

  if (res.code == 200) {
    visitorInfo.likeList.push({
      article_id: id,
      status: !likeStatus.value,
    });
    likeStatus.value = !likeStatus.value;
    switch (likeStatus.value) {
      case true:
        likeCount.value += 1;
        console.log(likeCount.value); // 打印likeCount.value，以检查其值是否正确
        message.success("点赞成功");
        break;
      case false:
        likeCount.value -= 1;
        console.log(likeCount.value); // 打印likeCount.value，以检查其值是否正确
        message.success("取消点赞");
        break;

      default:
        break;
    }
  }
};
/* 应用程序 E */

/* 生命周期 S */
onMounted(async () => {
  navBg.value = true; // 设置menu背景
  useHead({
    title: articleInfo.article_title || "文章详情",
  });
});
onBeforeUnmount(() => {});
/* 生命周期 E */
</script>

<style lang="scss">
// // 旧写法
// @import "../../assets/css/md-reset.scss";

// 新写法
@use "@/assets/css/md-reset.scss";
@import "md-editor-v3/lib/preview.css";
</style>
