import { defineStore } from "pinia";
import NProgress from "nprogress";
// import "nprogress/nprogress.css";
const $http = useHttp();


export const useDetail = defineStore("detail", () => {
  const articleInfo = reactive<any>({});
  const articleCount = reactive<any>({
    readCount: 0,
    likeCount: 0
  });
  const visitorInfo = reactive({
    likeList: [] as { article_id: number, status: boolean }[]
  });

  const getDetail = async (article_id: number) => {
    const { getIP } = useLocal();
    try {
      NProgress.start();
      const ip_info = await getIP();
      const ip = ip_info?.ip;
      const requestList = [
        $http.article.getDetail(article_id),
        $http.article.getLikeList(ip),
        $http.article.setCount({ article_id, ip })
      ];
      const res = await Promise.all(requestList)

      if (res[0].code == 200) {
        Object.assign(articleInfo, res[0].data);
      }
      if (res[1].code == 200) {
        Object.assign(visitorInfo, { likeList: res[1].data })
      }
      if (res[2].code == 200) {
        Object.assign(articleCount, res[2].data)
      }

      NProgress.done();
    } catch (error) {
      NProgress.done();
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
