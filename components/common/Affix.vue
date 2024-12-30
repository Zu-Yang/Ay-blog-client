<template>
  <div class="affix" ref="affix">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  offsetTop: {
    type: Number,
    default: 0,
  },
  target: {
    type: Function,
    default: () => window,
  },
  change: {
    type: Function,
    default: null,
  },
});

const affix = ref();
const affixed = ref(false);
const affixOffsetTop = ref();

const handleScroll = (e: any) => {
  // 获取body偏移量
  const targetTop = e.target.scrollTop || e.target.body.getBoundingClientRect().top;
  // 正则去掉负号
  const scrollTop = Number(targetTop.toString().replace("-", ""));

  if (scrollTop >= affixOffsetTop.value) {
    affix.value.classList = "affix affixed";
    affix.value.style.position = "fixed";
    affix.value.style.top = props.offsetTop + "px";
    affix.value.style.zIndex = 10;
    if (!affixed.value) {
      affixed.value = true;
      props.change && props.change(affixed.value);
    }
  } else {
    affix.value.classList = "affix";
    affix.value.style.position = "";
    affix.value.style.top = "";
    affix.value.style.zIndex = "";
    if (affixed.value) {
      affixed.value = false;
      props.change && props.change(affixed.value);
    }
  }
};

onMounted(() => {
  affixOffsetTop.value = affix.value.offsetTop; // 在组件挂载时计算一次

  props.target().addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  props.target().removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss">
.affix {
  position: relative;
}
</style>
