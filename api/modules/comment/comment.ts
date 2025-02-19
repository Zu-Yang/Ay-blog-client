import { fetch } from "~/utils/http";
import type { commentList, comment } from "../../type-interface";

export default {
  list: (params: commentList) => {
    return fetch("/api/comment/list", { method: "GET", query: params });
  },
  add: (params: comment) => {
    return fetch("/api/comment/add", { method: "POST", body: params });
  },
};
