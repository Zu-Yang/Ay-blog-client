<template>
  <div class="layout-wrap">
    <Menu :navBg="navBg"></Menu>
    <NuxtPage />
    <AppFooter />
    <Drawer />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue"; // 确保引入 onMounted

const menu = useMenu();
const { navBg } = toRefs(menu); // 使用 toRefs 保持响应性
</script>

<style lang="scss">
.layout-wrap {
  min-width: 1024px;
  transition: var(--transition);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translate(0px, -25px);
}

.slide-enter-to {
  opacity: 1;
  transform: translate(0px, 0px);
}

.slide-leave-from {
  opacity: 1;
  transform: translate(0px, 0px);
}

.slide-leave-to {
  opacity: 0;
  transform: translate(0px, 25px);
}
</style>
