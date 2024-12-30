<template>
  <div class="drawer-wrap" id="drawer">
    <n-button v-show="!active" class="btn-show" text ghost round @click="active = true">
      <SvgIcon name="angle-double-right" size="24"></SvgIcon>
    </n-button>
    <n-drawer
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
        <div class="video-drawer">
          <video
            :ref="videoPlayer"
            :src="`${url + '&vIndex=' + vIndex}`"
            width="100%"
            preload="auto"
            controls
            autoplay
            @ended="vIndex++"
            @loadedmetadata=""
            poster="https://s1.locimg.com/2024/11/08/04cf282fb0c37.jpg"
          ></video>
          <n-button
            class="btn-next"
            text
            ghost
            round
            :focusable="false"
            @click="vIndex++"
          >
            <SvgIcon name="video-next" size="30"></SvgIcon>
          </n-button>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const active = ref<boolean>(false);
const videoPlayer = ref(undefined); // 引用视频元素
const vIndex = ref<number>(0);
const url = ref<string>("https://api.yujn.cn/api/zzxjj.php?type=video");
</script>

<style lang="scss">
.video-drawer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .n-button {
    margin-top: 20px;
    transition: var(--transition);

    &:hover {
      transform: scale(1.1);
    }
  }
}

.btn-show {
  z-index: 101;
  position: fixed;
  top: 50%;
  left: 0px;
  transform: translateY(-50%);
}

.btn-hide {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translate(100%, -50%) rotate(180deg);
}

.n-drawer-body-content-wrapper {
  padding: 0 !important;
}
</style>
