<template>
  <div class="relative h-[50vh] overflow-hidden" id="banner">
    <n-image
      object-fit="cover"
      preview-disabled
      fallback-src="https://img.imgdd.com/f210f3.219114e2-69fe-43f6-9d28-ef21deb64ad6.jpg"
      :img-props="{ style: 'width:110%; max-width:110%; height:100%' }"
      :src="halfBannerUrl"
    >
      <template #placeholder>
        <div class="size-full flex items-center justify-center">loading</div>
      </template>
    </n-image>
  </div>
</template>

<script setup lang="ts">
const { halfBannerUrl } = toRefs(usePage());

onMounted(async () => {
  useBanner("#banner");
});
</script>
