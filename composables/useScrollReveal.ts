import ScrollReveal from "scrollReveal";

export default (target: any) =>
  ScrollReveal().reveal(target, {
    mobile: true, // 设置是否在移动设备上触发动画。
    reset: false, // 页面滚动后重置动画
    origin: "bottom", // 定义元素动画的起始位置。可选值有 'top', 'right', 'bottom', 'left'。
    easing: "ease-out", // 定义动画的速度曲线。常用的值有 'ease', 'ease-in', 'ease-out', 'ease-in-out'。
    distance: "50px", // 设置元素在动画过程中移动的距离。
    translate: "50px", // 元素平移的距离
    interval: 100, // 元素间隔100毫秒
    opacity: 1, // 设置元素动画开始时的不透明度。
    // scale: 1, // 设置元素的缩放比例，例如 { x: 0.5, y: 0.5 }。
    // rotate: 0, // 设置元素的旋转角度。可以是一个数字，也可以是一个包含 x, y, z 属性的对象，例如 { x: 45, y: 0, z: 0 }。
    // delay: 0, // 设置动画触发前的延迟时间。
    // duration: 500, // 设置动画的持续时间。
    // useDelay: 0, // 为每个动画添加随机延迟，以增加动画的多样性。
    // viewFactor: 0.2, // 视口因子  角系数
  });
