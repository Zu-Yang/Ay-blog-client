<template>
  <header class="head-wrap" id="header">
    <div class="head-nav">
      <!-- <Menu :navBg="navBg"></Menu> -->
    </div>
 
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

// msg=(美女，爱情，风景，清新，动漫，明星，萌宠，游戏，汽车，时尚，日历，影视，军事，体育，萌娃，格言)
// 主页地址:https://api.suyanw.cn/
// 自适应接口:https://api.suyanw.cn/api/comic/api.php?msg=动漫
// 平板接口:https://api.suyanw.cn/api/picture.php?msg=动漫
// 电脑端接口:https://api.suyanw.cn/api/comic
// 手机端接口:https://api.suyanw.cn/api/comic2


</script>

<style scoped lang="scss">
.head-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
