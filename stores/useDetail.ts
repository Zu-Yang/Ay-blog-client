import { defineStore } from "pinia";
const $http = useHttp();

export const useDetail = defineStore("detail", () => {
  const articleInfo = reactive<any>({});
  const articleCount = reactive<any>({
    commentCount: 0,
    readCount: 0,
    likeCount: 0,
    likeStatus: false,
  });
  const likeList = reactive<{ article_id: number, status: boolean }[]>([])

  /** 获取文章信息 */
  const getDetailInfo = async (article_id: number) => {
    const res = await $http.article.getDetail(article_id);
    if (res.code == 200) {
      Object.assign(articleInfo, res.data);
    }
  }
  /** 游客对文章点赞/阅读/评论统计 */
  const getArticleCount = async ({ article_id, user_email }: { article_id: number, user_email: string }) => {
    const res = await $http.article.getCount({ article_id, user_email })
    if (res.code == 200) {
      Object.assign(articleCount, {
        readCount: res.data.readCount,
        likeCount: res.data.likeCount,
        likeStatus: res.data.likeStatus,
      });
    }
  }

  return {
    articleInfo,
    articleCount,
    likeList,
    getDetailInfo,
    getArticleCount,
  };
});
