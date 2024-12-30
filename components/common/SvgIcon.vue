<template>
  <svg :class="svgClass" :style="{ color, fontSize: size + 'px' }">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name}`
  }
  return "svg-icon"
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
  outline: none;
}
</style>