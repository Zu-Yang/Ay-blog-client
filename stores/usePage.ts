import { defineStore } from "pinia";
const $http = useHttp();

export const usePage = defineStore("page", () => {
  const pagination = reactive({
    curPage: 0, // 当前页数
    limit: 6, // 每页数量
    count: 0, // 总页数
    total: 0, // 总数据量
    dataList: [] as any[], // 详细数据
  });
  const category = ref<any[]>([])
  const fullBannerUrl = ref(""); // 全屏图
  const halfBannerUrl = ref(""); // 半屏图
  const sortType = ref<string>("new");
  const topType = ref<string>("top");
  const articleTopList = ref<any[]>([]);

  const getArticleList = async (params: { page: number, orderBy: string }) => {
    try {
      const res = await $http.article.getArticles({
        page: params.page,
        orderBy: params.orderBy,
        limit: pagination.limit,
      });
      if (res.code == 200) {
        if (!articleTopList.value.length) {
          articleTopList.value = res.data.filter((item: any) => item.article_top == 1)
        }
        const params = {
          curPage: Number(res.page),
          count: Number(res.count),
          total: Number(res.total),
          dataList: res.data,
        };
        Object.assign(pagination, params);
      }
    } catch (error) { }
  };
  const getCategory = async () => {
    try {
      if (category.value.length === 0) {
        await $http.article.getCategory().then((res: any) => {
          if (res.code == 200) {
            category.value = res.data
          }
        }).catch((err: any) => {
          throw new Error(err);
        });
      }
    } catch (error) {

    }
  }
  /* 默认全屏图 prefix:"", 半屏图 prefix:"halfBanner" */
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
    sortType,
    topType,
    articleTopList,
    pagination,
    category,
    fullBannerUrl,
    halfBannerUrl,
    getArticleList,
    getBanner,
    getCategory,
  };
});
