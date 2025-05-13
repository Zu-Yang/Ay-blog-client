<template>
  <div class="overflow-hidden">
    <FullBanner></FullBanner>
    <CardList></CardList>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "首页",
  middleware: [
    async (to, from) => {
      const { getArticleList, getBanner, getCategory, request, sortType } = usePage();
      const { getIP } = useLocal();
      const { $nprogress } = useNuxtApp();
      try {
        $nprogress.start();
        const pageId = Number(to.params.id);
        await getIP();
        await request({ page: pageId, orderBy: sortType });
        // await getArticleList({ page: pageId, orderBy: sortType }); // 默认最新排序
        // await getCategory();
        // await getBanner({ bucketName: "banner-images" });
        // await getAudio();
        $nprogress.done();
        return true;
      } catch (err) {
        $nprogress.done();
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
