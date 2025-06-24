import { defineStore } from "pinia";
const $http = useHttp();
import { getIP } from "@/utils/local";

export const useDetail = defineStore("detail", () => {
  const articleInfo = reactive<any>({});
  const articleCount = reactive<any>({
    commentCount: 0,
    readCount: 0,
    likeCount: 0,
    likeStatus: false,
  });
  const visitorInfo = reactive({
    likeList: [] as { article_id: number, status: boolean }[]
  });

  const getDetail = async (article_id: number) => {
    try {
      getIP(async (ip) => {
        const requestList = [
          $http.article.getDetail(article_id),
          $http.article.getCount({ article_id, ip })
        ];
        const res = await Promise.all(requestList)

        if (res[0].code == 200) {
          Object.assign(articleInfo, res[0].data);
        }
        if (res[1].code == 200) {
          Object.assign(articleCount, {
            commentCount: res[0].data.article_comment_count,
            readCount: res[1].data.readCount,
            likeCount: res[1].data.likeCount,
            likeStatus: res[1].data.likeStatus,
          })
        }
      });

    } catch (error) {
      console.error(error);
    }
  };
  return {
    articleInfo,
    articleCount,
    visitorInfo,
    getDetail,
  };
});
