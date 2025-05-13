<template>
  <div class="relative h-[50vh] overflow-hidden lg:h-[100vh]" id="banner">
    <n-image
      object-fit="cover"
      preview-disabled
      fallback-src="https://img.imgdd.com/f210f3.219114e2-69fe-43f6-9d28-ef21deb64ad6.jpg"
      :img-props="{ style: 'width:110%; max-width:110%; height:100%' }"
      :src="
        fullBannerUrl ||
        'https://img.imgdd.com/f210f3.219114e2-69fe-43f6-9d28-ef21deb64ad6.jpg'
      "
    >
      <template #placeholder>
        <div class="size-full flex items-center justify-center">loading</div>
      </template>
    </n-image>
  </div>
</template>

<script setup lang="ts">
const { fullBannerUrl } = toRefs(usePage());

onMounted(async () => {
  useBanner("#banner");
});
</script>

<style lang="scss" scoped></style>
