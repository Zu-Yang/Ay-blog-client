import { defineStore } from "pinia";
const $http = useHttp();


export const useVisitor = defineStore("visitor", () => {
  const visitorInfo = reactive({
    likeList: [] as { article_id: number, status: boolean }[]
  });

  const getVisitorInfo = async () => {
    if (visitorInfo.likeList.length == 0) {
      const res = await $http.article.getLikeList();
      if (res.code == 200) {
        Object.assign(visitorInfo, { likeList: res.data })
      }
    }
  };

  return {
    visitorInfo,
    getVisitorInfo,
  };
});
