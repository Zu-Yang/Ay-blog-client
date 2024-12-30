<template>
  <n-flex>
    <n-float-button
      style="z-index: 10"
      type="primary"
      menu-trigger="click"
      right="50"
      bottom="40"
    >
      <svg-icon name="set" color="" size="24"></svg-icon>
      <template #menu>
        <!-- <n-float-button shape="square" type="primary">
          <template #trigger>
            <svg-icon name="theme" color="" size="26"></svg-icon>
          </template>
        </n-float-button> -->
        <n-float-button shape="square" type="primary">
          <n-popover trigger="click" placement="left" style="margin-right: 15px">
            <!-- #trigger触发弹出信息的组件或元素 -->
            <template #trigger>
              <svg-icon name="theme" color="" size="26"></svg-icon>
            </template>
            <template v-slot:header> 主题 </template>
            <template v-slot:default>
              <n-config-provider :theme-overrides="themeOverrides">
                <n-card>
                  <n-row>
                    <n-col :span="24">
                      <span>primary Color：</span>
                      <n-color-picker
                        :default-value="primaryColor"
                        :modes="['hex']"
                        placement="left"
                        :show-alpha="false"
                        @complete="handleComplete"
                      >
                        <template #label="color: string">
                          <!-- 触发器的内容 -->
                          {{ color }}
                        </template>
                      </n-color-picker>
                    </n-col>
                  </n-row>
                  <!-- <n-divider />
                  <n-space>
                    <n-button>Default</n-button>
                    <n-button type="primary">Primary</n-button>
                    <n-button strong secondary type="primary">Primary</n-button>
                    <n-button tertiary type="primary">Primary</n-button>
                    <n-button quaternary type="primary">Primary</n-button>
                    <n-button type="primary" ghost>Primary</n-button>
                  </n-space>
                  <n-divider />
                  <div v-for="(color, index) in generateColors" :key="index" :style="{ color }">
                    {{ color }}
                  </div> -->
                </n-card>
              </n-config-provider>
            </template>
            <template v-slot:footer>
              <n-space justify="space-between" align="center">
                <n-switch
                  v-model:value="dark"
                  :rail-style="railStyle"
                  @update:value="changeSwitch"
                >
                  <template #unchecked></template>
                  <template #checked-icon>
                    <svg-icon name="night"></svg-icon>
                  </template>
                  <template #unchecked-icon>
                    <svg-icon name="day"></svg-icon>
                  </template>
                  <template #checked></template>
                </n-switch>
              </n-space>
            </template>
          </n-popover>
        </n-float-button>
      </template>
    </n-float-button>
  </n-flex>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, toRefs } from "vue"
import type { CSSProperties } from 'vue'
import { darkTheme, commonDark, type GlobalTheme, type GlobalThemeOverrides } from 'naive-ui'
import { generate } from '@ant-design/colors'

const emit = defineEmits(['changeTheme', 'changeThemeMode'])

const { getThemeConfig, setThemeConfig, } = useTheme();
const themeInfo = getThemeConfig()

// 定义深浅主题
const dark = ref(themeInfo.dark || false);
// 定义一个主色
const primaryColor = ref(themeInfo.color || '')

// 主题，null为亮色，darkTheme为暗色
const theme = ref<GlobalTheme | null>(null)
// theme-overrides
const themeOverrides = ref<GlobalThemeOverrides>({})
// generate生成的颜色
const generateColors = ref<string[]>([])

// 是否是暗黑模式
const changeSwitch = (value: boolean) => {
  theme.value = value ? darkTheme : null
}

// 颜色完成改变后的回调（在鼠标移动时候不会调用）
const handleComplete = (value: string) => {
  primaryColor.value = value
}

// 设置theme-overrides
const setThemeOverrides = () => {
  generateColors.value = theme.value
    ? generate(primaryColor.value, {
      // 指定生成暗色系还是默认色系
      theme: 'dark',
      // 指定背景色,用于暗色主题下的颜色生成
      backgroundColor: commonDark.bodyColor
    })
    : generate(primaryColor.value)
  const commonColors = {
    primaryColor: generateColors.value[5],
    primaryColorHover: generateColors.value[4],
    primaryColorSuppl: generateColors.value[4],
    primaryColorPressed: generateColors.value[6]
  }
  themeOverrides.value.common = commonColors
}

watch([primaryColor, dark], () => {
  setThemeOverrides()
  emit('changeThemeMode', dark.value)
  emit('changeTheme', themeOverrides.value.common) // 修改主题
  setThemeConfig({ dark: dark.value, color: primaryColor.value })
  useSelection(primaryColor.value); // 设置页面选中样式
}, { immediate: true })

onBeforeMount(() => {
  primaryColor.value = themeInfo.color  // 主题色
  dark.value = themeInfo.dark  // 深|浅主题
  setThemeOverrides() // 生成themeOverrides.value.common
  emit('changeTheme', themeOverrides.value.common) // 修改主题色
  emit('changeThemeMode', dark.value) // 修改深|浅主题
})

// 修改n-switch轨道样式的函数
const railStyle = ({ focused, checked }: {
  focused: boolean
  checked: boolean
}) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#000000'
    // focused && (style.boxShadow = '0 0 1px 1px #ffffff')
  }
  else {
    // style.background = '#efefef'
    // focused && (style.boxShadow = '0 0 1px 1px #000000')
  }
  return style
}
</script>
