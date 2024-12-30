<template>
  <div>
    <n-result status="404" title="" description="">
      <template #icon>
        <svg-icon name="404error2" size="500"></svg-icon>
      </template>
      <template #footer>
        <n-space justify="center">
          <nuxt-link to="/">
            <n-button ghost round>🏠HOME</n-button>
          </nuxt-link>
          <n-button @click="$router.back()" ghost round>🔙BACK</n-button>
        </n-space>
      </template>
    </n-result>
  </div>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router"; // 添加这行代码
const $route = useRoute(); // 修改这行代码
const $router = useRouter(); // 修改这行代码

definePageMeta({
  title: "404",
});
</script>
