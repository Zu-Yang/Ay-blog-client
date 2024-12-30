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
      try {
        await getCategory();
        return true;
      } catch (err) {
        return abortNavigation(err as string);
      }
    },
  ],
});
</script>
