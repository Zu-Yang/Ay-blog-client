import { fetch } from "~/utils/http";
import type { pagination, readCount } from "../../type-interface";

export default {
  readCount: (params: readCount) => {
    return fetch(`/api/redis/readCount`, {
      method: "POST",
      body: params,
    });
  },
  getArticles: (params: pagination) => {
    return fetch(
      `/api/article/list?page=${params.page}&limit=${params.limit}`,
      {
        method: "GET",
      }
    );
  },
  addArticles: (params: any) => {
    return fetch("/api/article/addArticles", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },
  getDetail: (id: number) => {
    return fetch("/api/article/detail", {
      method: "GET",
      query: { id },
    });
  },
  getCategory: () => {
    return fetch("/api/category/getCategory", {
      method: "GET",
    });
  },
};
