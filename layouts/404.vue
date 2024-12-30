<template>
  <div class="layout-wrap">
    <NuxtPage class="layput-404" />
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
.layout-wrap {
  min-width: 1024px;
}

.layput-404 {
  width: 1024px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
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