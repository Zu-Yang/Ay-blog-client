import { defineStore } from "pinia";
const $http = useHttp();

export const usePage = defineStore("page", () => {
  const data = {
    curPage: 0, // 当前页数
    limit: 9, // 每页数量
    count: 0, // 总页数
    total: 0, // 总数据量
    dataList: [] as any, // 详细数据
  };
  const fullBannerUrl = ref(""); // 全屏图
  const halfBannerUrl = ref(""); // 半屏图

  const getArticleList = async (page: number) => {
    try {
      if (data.curPage !== page) {
        const res = await $http.article.getArticles({
          page,
          limit: data.limit,
        });
        if (res.code == 200) {
          const params = {
            curPage: Number(res.page),
            count: Number(res.count),
            total: Number(res.total),
            dataList: res.data,
          };
          Object.assign(data, params);
        }
      }
    } catch (error) {}
  };
  const getBanner = async (data: { bucketName: string; prefix?: string }) => {
    try {
      if (!data.prefix && !fullBannerUrl.value) {
        const res = await $http.minio.getRandomBanner(data);
        if (res.code == 200) fullBannerUrl.value = res.data.image;
      }

      if (data.prefix && !halfBannerUrl.value) {
        const res = await $http.minio.getRandomBanner(data);
        if (res.code == 200) halfBannerUrl.value = res.data.image;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return {
    data,
    fullBannerUrl,
    halfBannerUrl,
    getArticleList,
    getBanner,
  };
});
