import { fetch } from "~/utils/http";

export default {
  getIpInfo() {
    return fetch("/api/local/getUserIp", { methods: "GET" });
  },
};