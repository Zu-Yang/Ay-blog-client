import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";

const aplayer = (option: any): void => new APlayer(option)

// 注册一个全局插件
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('APlayer', aplayer)
})