import { defineStore } from "pinia";
const $http = useHttp();

export const useLocal = defineStore("local", () => {
  const getIP = async () => {
    try {
      const str = localStorage.getItem('IP_INFO');

      const nowTimeStamp = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000; // 一天的时间戳

      let shouldFetch = true;
      if (str) {
        const { timeStamp } = JSON.parse(str);
        shouldFetch = nowTimeStamp > timeStamp + oneDay;
      }

      if (shouldFetch) {
        const res = await $http.local.getIpInfo();

        if (res.code == 200) {
          const { country, short_name, province, city, area, isp, net, ip } = res.data;
          const data = { country, short_name, province, city, area, isp, net, ip, timeStamp: nowTimeStamp };
          localStorage.setItem('IP_INFO', JSON.stringify(data));

          return res.data;
        }
      } else {
        return JSON.parse(str as string);
      }
    } catch (error) {
      console.error('Error fetching IP information:', error);
      throw error;
    }
  };
  return {
    getIP,
  };
});
