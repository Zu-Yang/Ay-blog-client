<template>
  <div class="page-container">
    <FullBanner></FullBanner>
    <!-- <HalfBanner></HalfBanner> -->
    <CardList></CardList>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "首页",
  middleware: [
    async (to, from) => {
      const { getArticleList, getBanner } = usePage();
      const { getIP } = useLocal();
      try {
        const pageId = Number(to.params.id);
        await getIP();
        await getArticleList(pageId);
        // await getBanner({ bucketName: "banner-images", prefix: "halfscreen" });
        return true;
      } catch (err) {
        console.error(err);
        return abortNavigation(err as string);
      }
    },
  ],
});
/* menu start */
const { navBg } = toRefs(useMenu());
navBg.value = false;
useMenuBg(); // 通过滚动条控制menu背景颜色
/* menu end */
</script>

<style lang="scss" scoped></style>
