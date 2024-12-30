// 选中样式跟随主题色变化
export default (color: string) => {
  const html = document.getElementsByTagName("html")[0] as HTMLElement;
  
  html.style.setProperty("--theme-color", color); // 使用 setProperty 方法设置css自定义属性
};
