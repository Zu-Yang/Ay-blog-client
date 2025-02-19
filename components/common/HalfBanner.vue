<template>
  <div class="banner" id="banner">
    <n-image
      object-fit="cover"
      preview-disabled
      fallback-src="https://img.imgdd.com/f210f3.219114e2-69fe-43f6-9d28-ef21deb64ad6.jpg"
      :img-props="{ style: 'width:110%; height:100%' }"
      :src="halfBannerUrl"
    >
      <template #placeholder>
        <div
          style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color);
            background-color: var(--bg-color);
          "
        >
          <div>loading</div>
        </div>
      </template>
    </n-image>
  </div>
</template>

<script setup lang="ts">
const { halfBannerUrl } = toRefs(usePage());
const { getBanner } = usePage();

onMounted(async () => {
  await getBanner({ bucketName: "banner-images", prefix: "halfscreen" });
  useBanner("#banner");
});
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
  width: 100%;
  height: 50vh;
  overflow: hidden;
  .n-image {
    width: 100%;
    height: 100%;
  }
}
</style>
