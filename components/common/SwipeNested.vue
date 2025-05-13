<template>
  <div class="swiper-nested">
    <Swiper
      class="swiper swiper-h h-48"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :loop="option.loop"
      :speed="option.speed"
      :effect="option.effect"
      :modules="[Scrollbar]"
      :autoplay="option.autoplay"
      :slides-per-view="slidesPerView"
      :space-between="option.spaceBetween"
      :resistanceRatio="option.resistanceRatio"
      :watch-overflow="option.watchOverflow"
      :watch-slides-progress="option.watchSlidesProgress"
      :allowTouchMove="true"
      :scrollbar="{
        hide: true,
        draggable: true,
      }"
    >
      <SwiperSlide
        class="rounded-2xl shadow-xl overflow-hidden"
        v-for="(item, idx) in items"
        :key="item.article_id"
      >
        <n-popover
          :raw="false"
          :overlap="false"
          :show-arrow="false"
          :duration="20"
          :delay="20"
          trigger="hover"
          placement="top"
          display-directive="show"
          class="rounded-2xl! line-clamp-1"
        >
          <template #trigger>
            <nuxt-link
              class="color-(--n-text-color) text-decoration-none block w-full h-full"
              :to="`/detail/${item.article_id}`"
              :title="item.article_title"
            >
              <n-image
                class="w-full h-full hover:scale-105 duration-300 transition-transform ease-in-out"
                v-if="item.article_cover.length != 0"
                :src="item.article_cover[0]"
                lazy
                preview-disabled
                object-fit="cover"
                :img-props="{ style: 'width:100%; height:100%;' }"
              >
                <template #placeholder>
                  <n-skeleton width="100%" height="100%" />
                </template>
              </n-image>
              <div v-else class="title" :to="`/detail/${item.article_id}`">
                {{ item.article_title }}
              </div>
            </nuxt-link>
          </template>
          <span>
            {{ item.article_title }}
          </span>
        </n-popover>
      </SwiperSlide>
      <!-- <div
        v-if="items.length > slidesPerView"
        class="swiper-button-prev"
        @click="slidePrev"
      >
        <SvgIcon name="arrow-left"></SvgIcon>
      </div>
      <div
        v-if="items.length > slidesPerView"
        class="swiper-button-next"
        @click="slideNext"
      >
        <SvgIcon name="arrow-right"></SvgIcon>
      </div> -->
    </Swiper>
  </div>
</template>

<script setup>
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Scrollbar, Pagination, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useWindowSize } from "@vueuse/core";

const appConfig = useAppConfig();
const { width, height } = useWindowSize();

const props = defineProps({
  items: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
});

const screenWidth = ref(width);
const slidesPerView = ref(3);
const mySwiper = ref(null);

const option = reactive({
  loop: false,
  slidesPerView: "auto",
  modules: [Pagination, Mousewheel],
  autoplay: false,
  watchOverflow: true,
  watchSlidesProgress: true,
  resistanceRatio: 0.5,
  spaceBetween: 16,
  effect: "slide",
  speed: 500,
  pagination: {
    type: "progressbar",
    hideOnClick: false,
    progressbarOpposite: false, // 与swiper滑动方向相反
  },
});

const slidePrev = () => {
  mySwiper.value.slidePrev();
};

const slideNext = () => {
  mySwiper.value.slideNext();
};

const onSwiper = swiper => {
  mySwiper.value = swiper;
};

const onSlideChange = () => {};

watch(
  () => screenWidth.value,
  newVal => {
    // 根据屏幕宽度设置显示的幻灯片数量
    const breakpoints = [
      { width: appConfig.bp.sm, slides: 1.1 },
      { width: appConfig.bp.lg, slides: 2.1 },
      { width: appConfig.bp.xl, slides: 3.1 },
    ];

    // 找到第一个符合条件的断点
    const matchedBreakpoint = breakpoints.find(bp => newVal <= bp.width);

    // 设置显示的幻灯片数量
    slidesPerView.value = matchedBreakpoint ? matchedBreakpoint.slides : 3.1;

    // 重新加载Swiper
    // mySwiper.value && mySwiper.value.update();
  },
  {
    immediate: true,
  }
);

onUnmounted(() => {
  mySwiper.value.destroy();
});
</script>

<style lang="scss" scoped>
.swiper-button-prev,
.swiper-button-next {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  background-color: var(--button-color);
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
:deep(.swiper-pagination-bullet-active) {
  background: var(--theme-color);
}
:deep(.swiper-pagination-progressbar-fill) {
  background: var(--theme-color);
}
:deep(.swiper-scrollbar) {
  bottom: 0;
  height: 2px;
  .swiper-scrollbar-drag {
    background: var(--theme-color);
  }
}
</style>
