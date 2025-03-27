<template>
  <div>
    <ArticleForm />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  title: "随笔",
  middleware: [
    async (to, from) => {
      const { getCategory } = useArticle();
      const { $nprogress } = useNuxtApp();
      try {
        $nprogress.start();
        await getCategory();
        $nprogress.done();
        return true;
      } catch (err) {
        $nprogress.done();
        return abortNavigation(err as string);
      }
    },
  ],
});
</script>
