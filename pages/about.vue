<template>
  <div class="about-page">
    <HalfBanner></HalfBanner>
  </div>
</template>

<script lang="ts" setup>
const { navBg } = toRefs(useMenu());

definePageMeta({
  title: "关于我",
  middleware: [
    async (to, from) => {
      const { getBanner } = usePage();
      const { $nprogress } = useNuxtApp();
      try {
        $nprogress.start();
        /* 默认全屏图prefix:"", 半屏图prefix:"halfBanner" */
        await getBanner({ bucketName: "banner-images", prefix: "halfscreen" });
        $nprogress.done();
        return true;
      } catch (err) {
        console.error(err);
        $nprogress.done();
        return abortNavigation(err as string);
      }
    },
  ],
});

/* menu start */
onMounted(() => {
  navBg.value = false;
  useMenuBg(); // 类似mixin用法
});
/* menu end */
</script>

<style lang="scss">
.about-page {
  height: 1500px;
}
</style>
