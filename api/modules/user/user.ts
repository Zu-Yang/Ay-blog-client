import { fetch } from "~/utils/http";
import type { addArticle } from "../../type-interface";

export default {
  list: () => {
    return fetch("/api/user/list", { method: "GET" });
  },
  add: (params: addArticle) => {
    return fetch("/api/user/add", { method: "POST", body: params });
  },
};
