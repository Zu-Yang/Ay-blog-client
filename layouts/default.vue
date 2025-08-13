<template>
  <div class="layout-default">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
    <Drawer class="sm:block hidden" />
    <Live2d />
    <VisitorForm />
    <!-- <APlayer /> -->
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
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
