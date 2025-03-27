<template>
  <article
    class="max-w-3xl mx-auto pt-[100px] px-4 lg:px-0 transition-transform duration-300"
    :class="{ 'scale-98': showComment }"
  >
    <div class="text-3xl text-center mb-6 line-clamp-2">
      <h2>{{ articleInfo.article_title }}</h2>
    </div>
    <div class="flex justify-center mb-6">
      <span class="flex items-center mr-4">
        <SvgIcon class="mr-1" name="time" size="16" />
        <n-time :time="new Date(articleInfo.article_create_time)" type="date" />
      </span>
      <span class="flex items-center">
        <SvgIcon class="mr-1" name="link" size="16" />
        <RouterLink class="category" :to="`/category/${articleInfo.category_id}`">
          {{ articleInfo.category.category_name }}
        </RouterLink>
      </span>
    </div>
    <!-- 顶栏 -->
    <div
      class="lg:hidden bottom-20 flex items-center justify-items-center justify-center mb-6"
    >
      <div
        class="flex items-center justify-items-center cursor-pointer mr-4 select-none"
        @click="showComment = true"
      >
        <SvgIcon
          class="mr-1 transition-all hover:scale-105 active:scale-95"
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
          class="mr-1 transition-all hover:scale-105 active:scale-95"
          name="thumb2"
          size="20"
          :color="likeStatus ? 'var(--theme-color)' : ''"
        ></SvgIcon>
        <span class="text-center">
          {{ likeCount }}
        </span>
      </div>
      <div class="flex items-center justify-items-center cursor-pointer select-none">
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
    <div class="border-1 border-(--color2) rounded-2xl mb-6 p-4">
      <div class="mb-2">
        <SvgIcon name="ginger-cat" size="30" />
        <span> 摘要 </span>
      </div>
      <p class="line-clamp-4">
        {{ articleInfo.article_summary }}
      </p>
    </div>
    <div class="relative">
      <!-- 侧边标题 -->
      <div class="max-lg:hidden inline-block sticky top-[50px] left-full">
        <div class="absolute pl-5">
          <ul id="anchor-container" class=""></ul>
        </div>
      </div>
      <!-- 主题内容 -->
      <div id="article-content" v-html="contentHtml"></div>
      <!-- 侧边按钮 -->
      <div class="max-lg:hidden inline-block sticky bottom-0">
        <div class="absolute bottom-10 -translate-x-full pr-5">
          <div
            id="live2d-like"
            class="flex items-center justify-items-center flex-col cursor-pointer mb-2 select-none"
            @click="likeHandle"
          >
            <SvgIcon
              class="transition-all hover:scale-105 active:scale-95"
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
              class="transition-all hover:scale-105 active:scale-95"
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
              class="transition-all hover:scale-105 active:scale-95"
              name="comment"
              size="30"
            />
            <div>
              {{ commentCount }}
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { v4 as uuid4 } from "uuid";

const appConfig = useAppConfig();

/* composables S */
const $route = useRoute();
const $http = useHttp();
const { message } = useDiscreteApi();
/* composables E */

/* 数据声明 S */
const { navBg } = toRefs(useMenu());
const { getIP } = useLocal();
const { articleInfo, articleCount, visitorInfo } = useDetail();

const showComment = ref<boolean>(false);
const readCount = ref<number>(articleCount.readCount);
const likeCount = ref<number>(articleCount.likeCount);
const likeStatus = ref<boolean>(articleCount.likeStatus);
const commentCount = ref<number>(articleCount.commentCount);
const offset = ref<any[]>([]);
const anchorList = ref<string[]>([]);
const headerIds = ref<string[]>([]);

const contentHtml = articleInfo.article_content.replace(
  /<(h[1-5])([^>]*)>(.*?)<\/(h[1-5])>/g,
  (match: string, tagName: string, attrs: string, title: string) => {
    const id = uuid4().replace(/[^a-zA-Z]/g, ""); // 生成纯英文id, selector不能以数字开头
    headerIds.value.push(id);
    anchorList.value.push(`<li id="${id}" type="${tagName}" >${title}</li>`);
    return `<${tagName} id="${id}" type="${tagName}">${title}</${tagName}>`; // 添加 id 属性
  }
);
/* 数据声明 E */

/* 应用程序 S */

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

const likeHandle = async () => {
  const id = parseInt($route.params.id as string);
  const { country, short_name, province, city, area, isp, net, ip } = await getIP();
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

const scrollHandle = (event: Event) => {
  event.preventDefault();
  const scrollTop = window.scrollY + appConfig.navH;

  offset.value.forEach((item, index) => {
    if (scrollTop >= item.top - 1) {
      const ele = document.querySelector(`#anchor-container #${item.id}`) as HTMLElement;
      ele.style.color = "var(--theme-color)";
    } else {
      const ele = document.querySelector(`#anchor-container #${item.id}`) as HTMLElement;
      ele.style.color = "";
    }
  });
};

const scroll = () => {
  headerIds.value.forEach((id) => {
    const el = document.querySelector(`#article-content #${id}`) as HTMLElement;
    if (el) {
      const top = Math.floor(el.getBoundingClientRect().top + window.scrollY); // 计算目标元素的绝对位置
      offset.value.push({ id, top });
    }
  });

  window.addEventListener("scroll", scrollHandle);
};

const mousedownHandle = (event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName !== "LI") return;
  event.preventDefault();
  const id = `#${(event.target as HTMLElement).id}`;
  const el = document.querySelector("#article-content " + id) as HTMLElement;
  if (el) {
    const top = Math.floor(el.getBoundingClientRect().top + window.scrollY); // 计算目标元素的绝对位置

    window.scrollTo({
      top: top - appConfig.navH,
      behavior: "smooth", // 设置平滑滚动
    });
  }
};

const setAnchor = () => {
  const anchorContainer = document.getElementById("anchor-container") as HTMLElement;

  if (!anchorList.value.length) {
    anchorContainer.remove();
    return;
  }

  anchorContainer.innerHTML = anchorList.value.join("");
  anchorContainer.addEventListener("mousedown", mousedownHandle);
};

const changeImage = () => {
  const articleContent = document.querySelector("#article-content") as HTMLElement;
  if (!articleContent) return;

  const imgEls = articleContent.querySelectorAll("img");
  useMediumZoom(imgEls);

  // 因mediumZoom与scrollReveal不能同时作用于同一元素,否则scrollReveal会失效,故此给img包裹一层div,scrollReveal作用于此div即可
  imgEls.forEach((item: HTMLElement) => {
    const divEl = document.createElement("div");
    divEl.className = "img-area";
    item.parentNode?.insertBefore(divEl, item); // 修改此行，将div包裹在img外面
    divEl.appendChild(item); // 将img添加到div中
  });
  useScrollReveal("#article-content .img-area");
};
/* 应用程序 E */

/* 生命周期 S */
onMounted(async () => {
  navBg.value = true; // 设置menu背景
  setAnchor();
  changeImage();
  scroll();
  useHead({
    title: articleInfo.article_title || "文章详情",
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollHandle);
  window.removeEventListener("mousedown", mousedownHandle);
});
/* 生命周期 E */
</script>

<style lang="scss" scoped>
:deep(#article-content) {
  h1,
  h2,
  h3,
  h4,
  h5 {
    margin-bottom: 25px;
  }
  h1 {
    font-size: 30px;
  }
  h2 {
    font-size: 26px;
  }
  h3 {
    font-size: 22px;
  }
  h4 {
    font-size: 20px;
  }
  h5 {
    font-size: 18px;
  }
  p {
    line-height: 2;
    margin: 0 auto 15px;
  }
  img {
    max-width: 100%;
  }
}

:deep(#anchor-container) {
  li {
    margin-bottom: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: var(--transition);
  }

  li:hover {
    text-decoration: underline;
  }

  li[type="h1"] {
    font-size: 18px;
    font-weight: bold;
  }

  li[type="h2"] {
    font-size: 16px;
    padding-left: 15px;
  }

  li[type="h3"] {
    font-size: 14px;
    padding-left: 30px;
  }

  li[type="h4"] {
    font-size: 12px;
    padding-left: 45px;
  }

  li[type="h5"] {
    font-size: 12px;
    padding-left: 60px;
  }
}
</style>
