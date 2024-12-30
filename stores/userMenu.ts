import { defineStore } from "pinia";

export const useMenu = defineStore("menu", () => {
  const navBg = ref(false);

  return {
    navBg,
  };
});
