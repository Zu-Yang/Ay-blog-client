import { defineStore } from "pinia";
const $http = useHttp();

export const useArticle = defineStore("article", () => {
  let categoryInfo = [] as any[];

  const getCategory = async () => {
    if (categoryInfo.length == 0) {
      await $http.article
        .getCategory()
        .then((res: any) => {
          if (res.code == 200) {
            categoryInfo.push(...res.data);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  return {
    categoryInfo,
    getCategory,
  };
});
