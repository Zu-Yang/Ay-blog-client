import { defineStore } from "pinia";
import { getLocationIp } from "@/utils/local";

const $http = useHttp();

export const useLocal = defineStore("local", () => {
  /**
   * 获取定位信息
   */
  const getLocal = async () => {
    try {
      return new Promise<{ province: string; city: string; district: string; timestamp: number; }>((resolve, reject) => {
        getLocationIp(async (ip_addr) => {
          const res = await $http.local.getLocal({ ip: ip_addr });
          if (res.code !== 200) {
            throw new Error('获取定位信息API请求失败');
          }
          const { province, city, district } = res.data.content.address_detail;
          resolve({
            province,
            city,
            district,
            timestamp: Date.now()
          });
        });
      })
    } catch (error) {
      console.error('获取地理信息失败:', error);
      throw error;
    }
  };
  return {
    getLocal,
  };
});
