<template>
  <div class="page-container">
    <FullBanner></FullBanner>
    <CardList></CardList>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "首页",
  middleware: [
    async (to, from) => {
      const { getArticleList, getBanner } = usePage();
      try {
        const page = Number(to.params.id); // 从路由参数中获取
        await getArticleList(page);
        await getBanner({ bucketName: "banner-images" });
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
