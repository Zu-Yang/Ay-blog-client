<template>
  <footer class="overflow-hidden">
    <div
      id="footer-banner"
      class="relative hidden sm:block sm:h-[377px] before:absolute before:block before:w-full before:top-[301px] before:border-t before:border-[var(--border-top-color)] before:transition-all before:duration-300 before:pointer-events-none"
    >
      <img
        class="hidden sm:block max-w-[1024px] absolute top-0 left-0 right-0 mx-auto pointer-events-none select-none"
        src="https://img.imgdd.com/f210f3.3f4cbbc3-f0a0-4022-9a45-6168ba1ae9b1.png"
        alt=""
      />
    </div>
    <div class="max-w-256 mx-auto">
      <Theme></Theme>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const $http = useHttp();
onMounted(() => {
  useBanner("#footer-banner");
});
onUnmounted(() => {});
</script>

<style scoped lang="scss"></style>
