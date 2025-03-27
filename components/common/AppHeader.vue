<template>
  <header>
    <Menu :navBg="navBg"></Menu>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const { navBg } = toRefs(useMenu());
</script>

<style scoped lang="scss"></style>
