import { fetch } from "~/utils/http";

export default {
  getIP() {
    return fetch("/api/local/getIP", { methods: "GET" });
  },
};
