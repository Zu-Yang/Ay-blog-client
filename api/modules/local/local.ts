import { fetch } from "~/utils/http";

export default {
  getLocal(params: { ip: string }) {
    return fetch("/api/local/getLocal", { methods: "GET", params });
  },
};