<script setup lang="ts">
const props = defineProps({
  error: { type: Object, default: {} },
});
// console.log(props.error);

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div>
    <NuxtLayout>
      <p>
        {{ props.error.url }}
      </p>
      <p>
        {{ props.error.statusCode }}
      </p>
      <p>
        {{ props.error.statusMessage }}
      </p>
      <p>
        {{ props.error.message }}
      </p>
      <p>
        {{ props.error.description }}
      </p>
      <nuxt-link to="/">
        <n-button ghost round @click="handleError">🏠HOME</n-button>
      </nuxt-link>
    </NuxtLayout>
  </div>
</template>
