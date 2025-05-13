<script setup>
import "swiper/css"; // Base Swiper styles
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
import { ref, reactive, onUnmounted, defineProps } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { NImage, NSkeleton } from 'naive-ui'; // Add this import
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [], // 修复数组默认值的写法
  },
  title: {
    type: String,
    default: "",
  },
});

const option = reactive({
  loop: false,
  scrollbar: {
    hide: true, // 不触发时隐藏scrollbar
  },
  speed: 500,
  slidesPerView: 1,
  modules: [Scrollbar],
  autoplay: false,
  watchOverflow: true,
  watchSlidesProgress: true,
  effect: "slide",
});

const mySwiper = ref(null);

const slidePrev = () => {
  mySwiper.value?.slidePrev();
};

const slideNext = () => {
  mySwiper.value?.slideNext();
};

/** swiper加载完毕 */
const onSwiper = (swiper) => {
  mySwiper.value = swiper;
};
/** swiper切换 */
const onSlideChange = () => { };

onUnmounted(() => {
  mySwiper.value?.destroy();
});
</script>

<template>
  <div class="swiper-wrap">
    <Swiper @swiper="onSwiper" @slideChange="onSlideChange" v-bind="option">
      <template v-if="items.length">
        <SwiperSlide v-for="(item, idx) in items" :key="idx">
          <n-image :src="item" lazy preview-disabled object-fit="cover"
            :img-props="{ style: 'width:100%; height:100%' }">
            <template #placeholder>
              <n-skeleton width="100%" height="100%" />
            </template>
          </n-image>
        </SwiperSlide>
      </template>
      <SwiperSlide v-else>
        <div class="title">
          {{ title }}
        </div>
      </SwiperSlide>
      <template v-if="items.length > 1">
        <div class="swiper-button-prev" @click="slidePrev">
          <SvgIcon name="arrow-left" />
        </div>
        <div class="swiper-button-next" @click="slideNext">
          <SvgIcon name="arrow-right" />
        </div>
      </template>
    </Swiper>
  </div>
</template>

<style lang="scss" scoped>
.swiper-wrap {
  width: 100%;
  height: 100%;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-wrapper {
  min-width: 100%;
  width: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;

  .n-image {
    width: 100%;
    height: 100%;
  }

  .title {
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 5;
    padding: 10px 20px;
  }
}

.swiper-button-prev,
.swiper-button-next {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  background-color: var(--button-color);
  /* transform: translateY(-50%); */
  cursor: pointer;
  z-index: 10;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  user-select: none;
  -webkit-user-select: none;
  transition: var(--transition);
}

.swiper-button-prev {
  left: 0;
}

.swiper-button-next {
  right: 0;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: var(--button-color-hover);
}

.swiper-button-prev:after,
.swiper-button-next:after {
  content: "";
}

.swiper-button-prev:active,
.swiper-button-next:active {
  transform: scale(0.95);
}
</style>
