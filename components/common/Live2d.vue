<template>
  <div class="pio-container left">
    <div class="pio-action"></div>
    <canvas id="pio" width="200" height="200"></canvas>
  </div>
</template>
<script setup>
/* 文档：https://docs.paul.ren/pio/#/ */

const { getThemeConfig, setThemeConfig } = useTheme();
const { themeConfig } = toRefs(useTheme());

const theme = reactive({
  dark: themeConfig.value.dark,
  color: themeConfig.value.color,
});
console.log(theme);
onMounted(() => {
  new Paul_Pio({
    /* 
      mode:
        static	静态：只保留看板娘自身和文字提示，适合所有模型
        fixed	固定：固定看板娘的位置，增加功能按钮，适合所有模型
        draggable	可移动：看板娘的位置可以被用户更改，也保留了功能按钮，不适合半身模型
    */
    mode: "fixed", // 展现模式：不同的模式有不同的交互效果
    hidden: true, // 是否在手机上隐藏看板娘
    tips: true, // 时间小贴士：小贴士启用后将替换welcome信息
    // 配置交互提示扩展内容
    content: {
      link: "https://paugram.com/coding/add-poster-girl-with-plugin.html~",
      welcome: [
        "欢迎来到我的小窝！",
        "今天天气不错，一起来玩吧！",
        "博主每天都有些折腾记录，欢迎前往他的小窝阅读~",
      ],
      custom: [
        { selector: "#live2d-comment", text: "欢迎参与文章评论，别发小广告噢~" },
        { selector: "#live2d-read", text: "常回来看看还能更高噢~" },
        { selector: "#live2d-like", text: "觉得还不错就给个小♥♥吧~" },
        { selector: "", type: "read" },
        { selector: "a", type: "link" },
      ],
    },
    // 需要加载的模型，支持多条
    model: [
      "/live2d/models/pio/model.json",
      "/live2d/models/Ava/Ava.model3.json",
      "/live2d/models/Diana/Diana.model3.json",
    ],
    // 填写后将支持切换夜间模式
    night: function () {
      theme.dark = !theme.dark;
      setThemeConfig(theme);
      return theme.dark;
    },
  });
});
</script>
