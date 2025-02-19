<template>
  <article class="article-detail-wrap">
    <n-el class="container scroll-animation">
      <div class="title">
        <h2>{{ articleInfo.article_title }}</h2>
      </div>
      <div class="info">
        <span>
          <SvgIcon name="time" size="16" />
          <n-time :time="new Date(articleInfo.article_create_time)" type="date" />
        </span>
        <span>
          <RouterLink class="category" :to="`/category/${articleInfo.category_id}`">
            <SvgIcon name="link" size="16" />
            {{ articleInfo.category.category_name }}
          </RouterLink>
        </span>
        <!-- <span>
          <SvgIcon name="browse" size="14" />
          {{ readCount || articleInfo.article_read_count }}
        </span> -->
      </div>
      <div class="summary">
        <div class="title">
          <SvgIcon name="ginger-cat" size="30" />
          <span> 摘要 </span>
        </div>
        <p>
          {{ articleInfo.article_summary }}
        </p>
      </div>
      <div class="articl-body">
        <div class="anchor-wrap">
          <ul id="anchor-container" class="anchor-list"></ul>
        </div>
        <div class="article-content" v-html="contentHtml"></div>
        <div class="sidebar">
          <div class="item thumb" @click="likeHandle">
            <n-tooltip trigger="hover" placement="left">
              <template #trigger>
                <div class="content">
                  <SvgIcon
                    name="thumb2"
                    size="34"
                    :color="likeStatus ? 'var(--theme-color)' : ''"
                  ></SvgIcon>
                  <span>
                    {{ likeCount || articleInfo.article_like_count }}
                  </span>
                </div>
              </template>
              <span>{{ likeStatus ? "つ♡⊂" : "点赞つ♡⊂" }} </span>
            </n-tooltip>
          </div>
          <div class="item browse">
            <n-tooltip trigger="hover" placement="left">
              <template #trigger>
                <div class="content">
                  <SvgIcon name="browse" size="34" />
                  <span>
                    {{ readCount || articleInfo.article_read_count }}
                  </span>
                </div>
              </template>
              <span> 阅读つ♡⊂ </span>
            </n-tooltip>
          </div>
          <div class="item comment" @click="commentShow = true">
            <n-tooltip trigger="hover" placement="left">
              <template #trigger>
                <div class="content">
                  <SvgIcon name="comment" size="34" />
                  <span> </span>
                </div>
              </template>
              <span> 评论つ♡⊂ </span>
            </n-tooltip>
          </div>
        </div>
      </div>
    </n-el>
    <Comment
      :show="commentShow"
      :articleId="parseInt($route.params.id)"
      @change="(show) => (commentShow = show)"
    ></Comment>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from "vue";
import { v4 as uuid4 } from "uuid";

/* composables S */
const $route = useRoute();
const $http = useHttp();
const { message } = useDiscreteApi();
/* composables E */

/* 数据声明 S */
const { navBg } = toRefs(useMenu());
const { getIP } = useLocal();
const { articleInfo, articleCount, visitorInfo } = useDetail();

const navHeight = ref<number>(0);
const likeStatus = ref<boolean>(false);
const commentShow = ref<boolean>(false);
const readCount = ref<number>(articleCount.readCount);
const likeCount = ref<number>(articleCount.likeCount);
const offset = <any[]>[];
const anchorList = <string[]>[];
const headerIds = <string[]>[];

const contentHtml = articleInfo.article_content.replace(
  /<(h[1-5])([^>]*)>(.*?)<\/(h[1-5])>/g,
  (match: string, tagName: string, attrs: string, title: string) => {
    const id = uuid4().replace(/[^a-zA-Z]/g, ""); // 生成纯英文id, selector不能以数字开头
    headerIds.push(id);
    anchorList.push(`<li id="${id}" type="${tagName}" >${title}</li>`);
    return `<${tagName} id="${id}" type="${tagName}">${title}</${tagName}>`; // 添加 id 属性
  }
);
/* 数据声明 E */

/* 应用程序 S */

definePageMeta({
  middleware: [
    async (to, from) => {
      const { getDetail } = useDetail();
      try {
        const id = parseInt(to.params.id as string);
        await getDetail(id);
        return true;
      } catch (error) {
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
      article_id: parseInt(id),
      status: !likeStatus.value,
    });
    likeStatus.value = !likeStatus.value;
    likeCount.value = res.data.likeCount;
    likeStatus.value && message.success("点赞成功");
    !likeStatus.value && message.success("取消点赞");
  }
};

const setLikeStatus = async () => {
  const id = $route.params.id;
  visitorInfo.likeList.forEach((item: any) => {
    if (item.id == id) likeStatus.value = item.status;
  });
};

const scrollHandle = (event: Event) => {
  event.preventDefault();
  const scrollTop = window.scrollY + navHeight.value;

  offset.forEach((item, index) => {
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
  headerIds.forEach((id) => {
    const el = document.querySelector(`.article-content #${id}`) as HTMLElement;
    if (el) {
      const top = Math.floor(el.getBoundingClientRect().top + window.scrollY); // 计算目标元素的绝对位置
      offset.push({ id, top });
    }
  });

  window.addEventListener("scroll", scrollHandle);
};

const mousedownHandle = (event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName !== "LI") return;
  event.preventDefault();
  const id = `#${(event.target as HTMLElement).id}`;
  const el = document.querySelector(".article-content " + id) as HTMLElement;
  if (el) {
    const top = Math.floor(el.getBoundingClientRect().top + window.scrollY); // 计算目标元素的绝对位置

    window.scrollTo({
      top: top - navHeight.value,
      behavior: "smooth", // 设置平滑滚动
    });
  }
};

const setAnchor = () => {
  const anchorContainer = document.getElementById("anchor-container") as HTMLElement;

  if (!anchorList.length) {
    anchorContainer.remove();
    return;
  }

  anchorContainer.innerHTML = anchorList.join("");
  anchorContainer.addEventListener("mousedown", mousedownHandle);
};

const changeImage = () => {
  const articleContent = document.querySelector(".article-content") as HTMLElement;
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
  useScrollReveal(".article-content .img-area");
};
/* 应用程序 E */

/* 生命周期 S */
onMounted(async () => {
  useScrollReveal(".scroll-animation");
  setAnchor();
  changeImage();
  setLikeStatus(); // 点赞状态
  useHead({
    title: articleInfo.article_title || "文章详情",
  });
  navBg.value = true; // 设置menu背景
  navHeight.value = document.querySelector(".layout-wrap .nav")?.clientHeight as number;
  setTimeout(() => {
    scroll();
  }, 1000);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollHandle);
  window.removeEventListener("mousedown", mousedownHandle);
});
/* 生命周期 E */
</script>

<style lang="scss">
.article-detail-wrap {
  .container {
    width: 768px;
    margin: 100px auto 0;
    .title {
      text-align: center;
      font-size: 24px;
    }
    .info {
      margin-top: 25px;
      text-align: center;
      display: flex;
      justify-content: center;
      span {
        margin: 0 10px;
        display: flex;
        align-items: center;
        .svg-icon {
          margin-right: 5px;
        }
        .category {
          display: inline-block;
          color: var(--text-color-2);
        }
      }
    }
    .summary {
      margin: 50px auto 0px;
      padding: 20px;
      border: 1px solid var(--border-color);
      box-shadow: var(--box-shadow-1);
      border-radius: var(--border-radius);

      .title {
        margin-bottom: 10px;
        text-align: left;
        font-weight: bold;
        font-size: 18px;

        span {
          font-weight: bold;
        }
      }
    }
    .articl-body {
      position: relative;
      top: 50px;
      .anchor-wrap {
        display: inline-block;
        position: sticky;
        top: 50px;
        left: 100%;
        transform: translateX(100%);
        padding-left: 40px;
      }
      .sidebar {
        position: sticky;
        bottom: 80px;
        left: 0%;
        transform: translateX(-100%);
        padding-right: 40px;
        display: inline-block;
        z-index: 101;
        .item {
          cursor: pointer;
          margin-bottom: 10px;
          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .svg-icon {
            transition: var(--transition);
            &:hover {
              transform: scale(1.05);
            }
            &:active {
              transform: scale(0.95);
            }
          }
        }
      }
      .anchor-list {
        position: absolute;
      }

      .anchor-list li {
        margin: 10px 0;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .anchor-list li:hover {
        text-decoration: underline;
      }

      .anchor-list li[type="h1"] {
        font-size: 18px;
        font-weight: bold;
      }

      .anchor-list li[type="h2"] {
        font-size: 16px;
        padding-left: 15px;
      }

      .anchor-list li[type="h3"] {
        font-size: 14px;
        padding-left: 30px;
      }

      .anchor-list li[type="h4"] {
        font-size: 12px;
        padding-left: 45px;
      }

      .anchor-list li[type="h5"] {
        font-size: 12px;
        padding-left: 60px;
      }
    }
  }
}
</style>
