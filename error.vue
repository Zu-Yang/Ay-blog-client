<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-5xl mb-4 text-red-700">{{ error.statusCode }}</h1>
      <div>{{ error.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const handleError = () => {
  if (props.error.statusCode === 404) {
    window.location.href = "/";
  } else {
    window.location.href = "/";
  }
};
</script>
