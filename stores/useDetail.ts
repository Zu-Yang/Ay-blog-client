import { defineStore } from "pinia";
const $http = useHttp();

export const useDetail = defineStore("detail", () => {
  const articleInfo = reactive<any>({});

  const getDetail = async (id: number | string) => {
    try {
      const res = await $http.article.getDetail(id);
      if (res.code == 200) {
        Object.assign(articleInfo, res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return {
    articleInfo,
    getDetail,
  };
});
