<template>
  <div class="flex items-center justify-end">
    <div class="flex items-center mr-4">
      <span>主题切换：</span>
      <n-switch v-model:value="dark" :rail-style="railStyle" @update:value="changeSwitch">
        <template #unchecked>浅色</template>
        <template #checked>暗黑</template>
      </n-switch>
    </div>
    <div class="flex items-center">
      <span>主题颜色：</span>
      <n-color-picker
        class="w-[22px] h-[22px]"
        size="small"
        :modes="['hex']"
        placement="left"
        :show-alpha="false"
        v-model:value="color"
        :default-value="color"
        @complete="handleComplete"
      >
        <template #label="color: string">
          <!-- <div>
            {{ color }}
          </div> -->
        </template>
      </n-color-picker>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, toRefs } from "vue";
import type { CSSProperties } from "vue";

const { getThemeConfig, setThemeConfig } = useTheme();
const { themeConfig } = toRefs(useTheme());

const dark = ref(themeConfig.value.dark);
const color = ref(themeConfig.value.color);

const changeSwitch = (value: boolean) => {};

const handleComplete = (value: string) => {};

watch(
  [color, dark],
  () => {
    setThemeConfig({ dark: dark.value, color: color.value });
  },
  { immediate: true }
);
watch(
  () => themeConfig,
  (newVal) => {
    color.value = themeConfig.value.color;
    dark.value = themeConfig.value.dark;
  },
  { immediate: true, deep: true }
);

onBeforeMount(() => {
  const themeConfig = getThemeConfig();
  color.value = themeConfig.color; // 主题色
  dark.value = themeConfig.dark; // 深|浅主题
});

// 修改n-switch轨道样式的函数
const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#000000";
    focused && (style.boxShadow = "0 0 1px 1px #000000");
  } else {
    style.background = "#efefef";
    focused && (style.boxShadow = "0 0 1px 1px #ffffff");
  }
  return style;
};
</script>

<style lang="scss" scoped></style>
