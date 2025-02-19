import { fetch } from "~/utils/http";

export default {
  /* 官网：https://github.com/cheatsnake/emojihub */
  getEmojiList: () => {
    return fetch("https://emojihub.yurace.pro/api/all", { method: "GET" });
  },
};
