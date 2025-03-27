<template>
  <div id="drawer">
    <button
      v-show="!active"
      class="fixed top-1/2 left-4 -translate-x-1/2 z-10 cursor-pointer"
      @click="active = true"
    >
      <SvgIcon name="angle-double-right" size="24"></SvgIcon>
    </button>
    <n-drawer
      class="bg-transparent backdrop-blur-lg"
      v-model:show="active"
      :max-width="450"
      :min-width="200"
      resizable
      display-directive="show"
      placement="left"
      :block-scroll="false"
      :show-mask="true"
      :mask-closable="false"
      @after-enter="() => videoPlayer?.play()"
      @after-leave="() => videoPlayer?.pause()"
    >
      <n-drawer-content>
        <div class="w-full h-full flex items-center justify-center flex-col">
          <video
            ref="videoPlayer"
            :src="`${url + '&vIndex=' + vIndex}`"
            width="100%"
            preload="auto"
            controls
            autoplay
            @ended="vIndex++"
            @loadedmetadata=""
            poster="https://s1.locimg.com/2024/11/08/04cf282fb0c37.jpg"
          ></video>
          <button
            class="hover:scale-105 active:scale-95 transition-all mt-4 hover:text-(--theme-color)"
            @click="vIndex++"
          >
            <SvgIcon name="video-next" size="30"></SvgIcon>
          </button>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const active = ref<boolean>(false);
const videoPlayer = ref<HTMLVideoElement | undefined>(undefined); // 引用视频元素
const vIndex = ref<number>(0);
const url = ref<string>("https://api.yujn.cn/api/zzxjj.php?type=video");
</script>

<style lang="scss" scoped></style>
