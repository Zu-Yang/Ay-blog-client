<template>
  <footer class="footer-wrap">
    <div class="footer-banner" id="footer-banner">
      <img
        src="https://img.imgdd.com/f210f3.3f4cbbc3-f0a0-4022-9a45-6168ba1ae9b1.png"
        alt=""
      />
    </div>
    <div class="footer-text">
      <div>{{ text }}</div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const $http = useHttp();
const text = ref<string>("");
onMounted(() => {
  useBanner("#footer-banner");
});
onUnmounted(() => {});
</script>

<style scoped lang="scss">
.footer-banner {
  width: 100%;
  height: 377px;
  position: relative;

  &::before {
    position: absolute;
    display: block;
    content: "";
    width: 100%;
    top: 300px;
    pointer-events: none;
    border-top: 1px solid var(--border-top-color);
    transition: var(--transition);
  }

  img {
    max-width: 1024px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    margin: 0px auto;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
}

.footer-text {
  width: 1024px;
  margin: 0 auto;
  text-align: center;
  transition: none;
}
</style>
