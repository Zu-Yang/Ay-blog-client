import { defineStore } from "pinia";
const $http = useHttp();

export const useLocal = defineStore("local", () => {
  const ip = ref<string>("");

  const getIP = async () => {
    try {
      const res = await $http.local.getIP();
      if (res.code == 200) {
        ip.value = res.data.ip;
      }
      return ip;
    } catch (error) {
      console.error(error);
    }
  };
  return {
    ip,
    getIP,
  };
});
