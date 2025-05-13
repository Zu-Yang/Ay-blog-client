/* 判断移动设备 */
export const isMobile = () => {
  // 获取用户代理字符串并转为小写
  const ua = window.navigator.userAgent.toLowerCase();
  
  // 检查是否包含移动设备相关关键词
  const hasMobileKeywords = 
    ua.includes('mobile') || 
    ua.includes('android') || 
    ua.includes('ios');

  // 检查屏幕宽度和移动设备标识
  return window.innerWidth < 500 || hasMobileKeywords;
}
