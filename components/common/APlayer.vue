<template>
  <div id="aplayer" class="aplayer"></div>
</template>
<script setup>
import { isMobile } from "@/utils/utils";
const { $APlayer } = useNuxtApp();
const $http = useHttp();

const aplayer = ref(null);
const audioList = ref([]);

const getMusicList = async () => {
  await $http.minio.getAudio({ bucketName: "blog-audio" }).then(res => {
    if (res.code === 200) {
      audioList.value = res.data;
    }
  });
};

onMounted(async () => {
  if (isMobile()) return;
  await getMusicList();
  aplayer.value = await $APlayer({
    container: document.getElementById("aplayer"),
    fixed: true,
    mini: true,
    autoplay: false,
    theme: "var(--theme-color)",
    loop: "all",
    order: "random",
    preload: "auto",
    volume: 0.7,
    mutex: true,
    listFolded: true, // 列表默认折叠
    listMaxHeight: "90px",
    lrcType: 3, // 3:歌词文件，2:HTML，1:字符串。参考：https://aplayer.js.org/#/zh-Hans/?id=%E6%AD%8C%E8%AF%8D
    audio: audioList.value,
    // audio: [
    //   {
    //     name: "跳楼机",
    //     artist: "LBI利比",
    //     url:
    //       "https://m701.music.126.net/20250402153748/db7f3da5785f66b9303e41da9128fd32/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/58134116941/6d6c/bb3f/6897/4ed130b22b010e87bf19ae65fe18eeb1.mp3",
    //     cover:
    //       "https://p4.music.126.net/cmoE8PsdK_Yn9VJ8ZVCGrw==/109951170507596121.jpg?param=300y300",
    //     lrc: `[00:00.00] 作词 : 姜洄 [00:01.00] 作曲 : 鹿柯的宁叔 [00:02.00] 制作人 : LBI利比/BackToBand赵楚峰 [00:03.00] 编曲 : 卡其漠 [00:04.00] 吉他 : 大牛 [00:05.00] 混音&母带 : LBI利比 [00:06.00] 和声 : LBI利比 [00:07.00] 制作公司 : 天马行空文化 [00:08.00] 策划/推广 : 大碗 [00:09.00] 监制 : 杰森 [00:10.00] 总监制 : 陈国威/许雯静 [00:11.00] 出品 : 索尼音乐 [00:18.84]风走了 只留下一条街的叶落 [00:23.34]你走了 只留下我双眼的红 [00:26.70]逼着自己早点睡 [00:28.86]能不能再做一个有你的美梦 [00:33.52] [00:33.87]我好像一束极光 [00:36.90]守在遥远的世界尽头 [00:40.74]看过了你的眼眸 [00:42.87]才知道孤独很难忍受 [00:47.02] [00:47.73]可笑吗 我删访问记录的时候有多慌张 [00:52.26] 她会看见吗 曾经只有我能看的模样 [00:55.92]从夜深人静 一直难过到天亮 [00:58.77]你反正不会再担心 我隐隐作疼的心脏 [01:03.26] [01:03.45]好像遇到我 你才对自由向往 [01:06.27]怎么为她 失去一切也无妨 [01:09.12]可能是我贱吧 [01:10.50]不爱我的非要上 [01:12.15]那么硬的南墙非要撞 [01:14.64]是不是内心希望 [01:16.32]头破血流就会让你想起 [01:19.41]最爱我的时光 [01:21.51] [01:21.75]baby我们的感情好像跳楼机 [01:25.56]让我突然地升空又急速落地 [01:29.28]你带给我一场疯狂 [01:31.14]劫后余生好难呼吸 [01:33.06]那天的天气难得放晴 [01:35.31]你说的话却把我困在雨季 [01:38.25] [01:38.43]其实你不是不爱了吧 [01:40.05]只是有些摩擦没处理 [01:41.85]怎么你闭口不语 [01:44.19]是不是我正好 [01:45.84]说中你的心 [01:47.49]就承认还是在意吧 [01:50.58]就骗骗我也可以 [01:54.73] [02:10.23]可笑吗 [02:12.00]你的出现是我不能规避的伤 [02:14.67]怎么能接受这荒唐 [02:16.59]可能是我贱吧 [02:18.03]不爱我的非要上 [02:19.65]那么硬的南墙非要撞 [02:22.14]是不是内心希望 [02:23.82]头破血流就会让你想起 [02:26.91]最爱我的时光 [02:29.26] [02:29.28]baby我们的感情好像跳楼机 [02:33.06]让我突然地升空又急速落地 [02:36.78]你带给我一场疯狂 [02:38.64]劫后余生好难呼吸 [02:40.56]那天的天气难得放晴 [02:42.84]你说的话却把我困在雨季 [02:45.84] [02:45.93]其实你不是不爱了吧 [02:47.58]只是有些摩擦没处理 [02:49.35]怎么你闭口不语 [02:51.69]是不是我正好 [02:53.34]说中你的心 [02:54.99]就承认还是在意吧 [02:58.11]哪怕骗骗我也可以 [03:02.48]`,
    //   },
  });
});
onUnmounted(() => {
  aplayer.value?.destroy();
});
</script>

<style lang="scss">
.aplayer {
  color: #333;
  background: transparent;
  backdrop-filter: blur(16px);
}

.dark .aplayer {
  color: #ccc;
}

.aplayer .aplayer-list {
  border: none !important;
}

.aplayer .aplayer-list ol li {
  border-top: none;
}

.aplayer .aplayer-list ol li.aplayer-list-light {
  background-color: rgba(207, 207, 207, 0.5);
}

.dark .aplayer .aplayer-list ol li.aplayer-list-light {
  background-color: rgba(51, 51, 51, 0.5);
}

.aplayer .aplayer-list ol li:hover {
  background-color: rgba(207, 207, 207, 0.3);
}

.dark .aplayer .aplayer-list ol li:hover {
  background-color: rgba(51, 51, 51, 0.3);
}

.aplayer .aplayer-body {
  background: transparent !important;
}

.aplayer .aplayer-info {
  border-top: none !important;
}

.aplayer .aplayer-miniswitcher {
  background: transparent !important;
  backdrop-filter: blur(16px);
}

.dark .aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon:hover path {
  fill: #fff;
}

.aplayer .aplayer-miniswitcher .aplayer-icon:hover path {
  fill: #fff;
}

.aplayer .aplayer-lrc p {
  color: var(--theme-color);
}

.aplayer .aplayer-lrc p.aplayer-lrc-current {
  font-weight: bold;
}

.aplayer.aplayer-fixed .aplayer-lrc {
  width: 100vw;
  text-shadow: none;
}
</style>
