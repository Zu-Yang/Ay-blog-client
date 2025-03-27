export const useMenuBg = () => {
  const appConfig = useAppConfig()
  const { navBg } = toRefs(useMenu());
  const height = ref<number>(0);
  const scrollHandle = (e: Event) => {
    const scrollY = window.scrollY; // 获取垂直滚动偏移量
    if (scrollY >= height.value - appConfig.navH) {
      navBg.value = true;
    } else {
      navBg.value = false;
    }
  };
  onMounted(() => {
    const headerEle = document.querySelector("#banner") as HTMLElement;
    height.value = headerEle?.clientHeight || headerEle?.offsetHeight;
    window.addEventListener("scroll", scrollHandle);
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", scrollHandle);
  });
};
