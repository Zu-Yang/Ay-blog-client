<template>
  <div v-if="data.total" class="card-wrap">
    <n-grid cols="3" x-gap="10" y-gap="10" responsive="screen" item-responsive>
      <n-grid-item
        class="scroll-animation"
        v-for="(data, index) in data.dataList"
        :key="index"
      >
        <n-list hoverable clickable bordered>
          <template #default>
            <n-image-group>
              <Swipe :items="data.article_cover" :title="data.article_title"></Swipe>
            </n-image-group>
          </template>
          <template #footer>
            <nuxt-link :to="`/detail/${data.article_id}`">
              <n-thing>
                <template #header> {{ data.article_title }} </template>
                <template #default> {{ data.article_summary }} </template>
                <template #footer>
                  <div class="time">
                    <n-tag
                      :bordered="false"
                      size="small"
                      :color="{
                        textColor: 'var(--color2)',
                        color: 'transparent',
                        borderColor: 'transparent',
                      }"
                    >
                      <template #icon>
                        <SvgIcon name="time" size="14" />
                      </template>
                      <n-time
                        :time="Number(data.article_create_time)"
                        format="yyyy-MM-dd"
                      />
                    </n-tag>
                  </div>
                </template>
              </n-thing>
            </nuxt-link>
          </template>
        </n-list>
      </n-grid-item>
    </n-grid>
    <n-pagination
      v-if="data.count"
      v-model:page="data.curPage"
      :page-count="data.count"
      :on-update:page="(page: number) => $router.push(`/page/${page}`)"
    >
    </n-pagination>
  </div>
  <div v-else>
    <n-result status="404" title="" description="">
      <template #icon>
        <svg-icon name="empty" size="400"></svg-icon>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const { data } = usePage();
</script>

<style scoped>
.card-wrap {
  width: 1024px;
  margin: 0 auto;
}

:deep(.n-list) {
  overflow: hidden;
  border-radius: 15px;
  .swiper-wrap {
    width: 100%;
    height: 200px;
    .n-image {
      transition: var(--transition);
      /* filter: brightness(0.7); */
    }
  }
  .swiper-button-prev {
    transform: translateX(-100%) scale(0.5);
  }

  .swiper-button-next {
    transform: translateX(100%) scale(0.5);
  }

  &:hover {
    box-shadow: 0 0 10px 0 var(--n-color-hover);
    background-color: var(--n-border-color-popover);
    transition: var(--transition);

    .swiper-slide-active .n-image {
      transform: scale(1.1);
    }

    .swiper-button-prev,
    .swiper-button-next {
      transform: translateX(0%) scale(1);
    }
  }

  .n-list__footer a {
    text-decoration: none;
  }
}

:deep(.n-thing-main) {
  .n-thing-header {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    /* transition: var(--transition); */
    /* text-shadow: 1px 1px rgba(153, 92, 0, 0.5), 2px 2px rgba(156, 94, 0, 0.505),
        3px 3px rgba(159, 96, 0, 0.51), 4px 4px rgba(162, 97, 0, 0.515),
        5px 5px rgba(164, 99, 0, 0.52), 6px 6px rgba(167, 100, 0, 0.525),
        7px 7px rgba(169, 102, 0, 0.53), 8px 8px rgba(172, 103, 0, 0.535),
        9px 9px rgba(174, 105, 0, 0.54), 10px 10px rgba(176, 106, 0, 0.545),
        11px 11px rgba(179, 107, 0, 0.55), 12px 12px rgba(181, 109, 0, 0.555),
        13px 13px rgba(183, 110, 0, 0.56), 14px 14px rgba(185, 111, 0, 0.565),
        15px 15px rgba(186, 112, 0, 0.57), 16px 16px rgba(188, 113, 0, 0.575),
        17px 17px rgba(190, 114, 0, 0.58), 18px 18px rgba(192, 115, 0, 0.585),
        19px 19px rgba(194, 116, 0, 0.59), 20px 20px rgba(195, 117, 0, 0.595),
        21px 21px rgba(197, 118, 0, 0.6), 22px 22px rgba(198, 119, 0, 0.605),
        23px 23px rgba(200, 120, 0, 0.61), 24px 24px rgba(201, 121, 0, 0.615),
        25px 25px rgba(203, 122, 0, 0.62), 26px 26px rgba(204, 123, 0, 0.625),
        27px 27px rgba(205, 123, 0, 0.63), 28px 28px rgba(207, 124, 0, 0.635),
        29px 29px rgba(208, 125, 0, 0.64), 30px 30px rgba(209, 126, 0, 0.645),
        31px 31px rgba(210, 126, 0, 0.65), 32px 32px rgba(212, 127, 0, 0.655),
        33px 33px rgba(213, 128, 0, 0.66), 34px 34px rgba(214, 128, 0, 0.665),
        35px 35px rgba(215, 129, 0, 0.67), 36px 36px rgba(216, 130, 0, 0.675),
        37px 37px rgba(217, 130, 0, 0.68), 38px 38px rgba(218, 131, 0, 0.685),
        39px 39px rgba(219, 132, 0, 0.69), 40px 40px rgba(220, 132, 0, 0.695),
        41px 41px rgba(221, 133, 0, 0.7), 42px 42px rgba(222, 133, 0, 0.705),
        43px 43px rgba(223, 134, 0, 0.71), 44px 44px rgba(224, 134, 0, 0.715),
        45px 45px rgba(225, 135, 0, 0.72), 46px 46px rgba(225, 135, 0, 0.725),
        47px 47px rgba(226, 136, 0, 0.73), 48px 48px rgba(227, 136, 0, 0.735),
        49px 49px rgba(228, 137, 0, 0.74), 50px 50px rgba(229, 137, 0, 0.745),
        51px 51px rgba(230, 138, 0, 0.75), 52px 52px rgba(230, 138, 0, 0.755),
        53px 53px rgba(231, 139, 0, 0.76), 54px 54px rgba(232, 139, 0, 0.765),
        55px 55px rgba(232, 140, 0, 0.77), 56px 56px rgba(233, 140, 0, 0.775),
        57px 57px rgba(234, 140, 0, 0.78), 58px 58px rgba(235, 141, 0, 0.785),
        59px 59px rgba(235, 141, 0, 0.79), 60px 60px rgba(236, 142, 0, 0.795),
        61px 61px rgba(236, 142, 0, 0.8), 62px 62px rgba(237, 142, 0, 0.805),
        63px 63px rgba(238, 143, 0, 0.81), 64px 64px rgba(238, 143, 0, 0.815),
        65px 65px rgba(239, 143, 0, 0.82), 66px 66px rgba(239, 144, 0, 0.825),
        67px 67px rgba(240, 144, 0, 0.83), 68px 68px rgba(241, 144, 0, 0.835),
        69px 69px rgba(241, 145, 0, 0.84), 70px 70px rgba(242, 145, 0, 0.845),
        71px 71px rgba(242, 145, 0, 0.85), 72px 72px rgba(243, 146, 0, 0.855),
        73px 73px rgba(243, 146, 0, 0.86), 74px 74px rgba(244, 146, 0, 0.865),
        75px 75px rgba(244, 147, 0, 0.87), 76px 76px rgba(245, 147, 0, 0.875),
        77px 77px rgba(245, 147, 0, 0.88), 78px 78px rgba(246, 147, 0, 0.885),
        79px 79px rgba(246, 148, 0, 0.89), 80px 80px rgba(247, 148, 0, 0.895),
        81px 81px rgba(247, 148, 0, 0.9), 82px 82px rgba(248, 149, 0, 0.905),
        83px 83px rgba(248, 149, 0, 0.91), 84px 84px rgba(248, 149, 0, 0.915),
        85px 85px rgba(249, 149, 0, 0.92), 86px 86px rgba(249, 150, 0, 0.925),
        87px 87px rgba(250, 150, 0, 0.93), 88px 88px rgba(250, 150, 0, 0.935),
        89px 89px rgba(251, 150, 0, 0.94), 90px 90px rgba(251, 151, 0, 0.945),
        91px 91px rgba(251, 151, 0, 0.95), 92px 92px rgba(252, 151, 0, 0.955),
        93px 93px rgba(252, 151, 0, 0.96), 94px 94px rgba(253, 152, 0, 0.965),
        95px 95px rgba(253, 152, 0, 0.97), 96px 96px rgba(253, 152, 0, 0.975),
        97px 97px rgba(254, 152, 0, 0.98), 98px 98px rgba(254, 152, 0, 0.985),
        99px 99px rgba(254, 153, 0, 0.99), 100px 100px rgba(255, 153, 0, 0.995); */
    .n-thing-header__title {
      font-weight: bold;
      transition: none;
    }
  }

  .n-thing-main__content {
    color: var(--color1);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    transition: color 0.3s var(--n-bezier);
  }

  .n-thing-main__footer {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    .time {
      text-align: right;
    }
  }
}
.n-pagination {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
