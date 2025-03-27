/**
 * 鼠标控制图片动效
 * @param className 图片所在的父级类名
 */

export const useBanner = (containerId: string) => {
  let target: HTMLElement;
  let targetImg: HTMLElement;
  let startX: number; // 开始x轴位置
  let moveX: number; // 移动x轴位置
  target = document.querySelector(containerId) as HTMLElement;
  targetImg = document.querySelector(containerId + " img") as HTMLElement;
  if (!target || !targetImg) {
    // console.error("指定的元素不存在，请检查容器ID和图片是否正确。");
    return;
  }
  targetImg.style.position = "absolute";
  targetImg.style.width = "110%";
  // targetImg.style.maxWidth = "110%";
  targetImg.style.height = "100%";
  targetImg.style.top = "0%";
  targetImg.style.left = "-5%";
  targetImg.style.objectFit = "cover";
  targetImg.style.pointerEvents = "none";

  target.addEventListener("mouseenter", (e: MouseEvent) => {
    startX = e.clientX;
    // targetImg.style.transition = "none";
    targetImg.style.transition = ".3s linear";
  });
  target.addEventListener("mousemove", (e: MouseEvent) => {
    moveX = e.clientX;
    const n = 0 - (moveX - startX) / -30;
    targetImg.style.transform = "translate(" + n + "px, 0px)";
  });
  target.addEventListener("mouseleave", (e: MouseEvent) => {
    targetImg.style.width = "110%";
    targetImg.style.transition = ".3s linear";
    targetImg.style.transform = "translate(0,0)";
  });
};
