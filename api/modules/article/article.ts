import { fetch } from "~/utils/http";
import type { pagination, likeStatus, setCount } from "../../type-interface";

export default {
  setCount: (params: setCount) => {
    return fetch(`/api/redis/count`, {
      method: "POST",
      body: params,
    });
  },
  getLikeList: (ip: string) => {
    return fetch(`/api/redis/getLikeList`, {
      method: "POST",
      body: { ip },
    });
  },
  setLikeStatus: (params: likeStatus) => {
    return fetch(`/api/redis/setLikeStatus`, {
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
