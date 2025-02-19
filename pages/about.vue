<template>
  <div class="about-page">
    <HalfBanner></HalfBanner>
    <div></div>
  </div>
</template>

<script lang="ts" setup>
const { navBg } = toRefs(useMenu());

definePageMeta({
  title: "关于我",
  middleware: [
    async (to, from) => {
      const { getBanner } = usePage();
      try {
        await getBanner({ bucketName: "banner-images", prefix: "halfscreen" });
        return true;
      } catch (err) {
        console.error(err);
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
