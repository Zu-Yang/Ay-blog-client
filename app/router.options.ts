export default {
  scrollBehavior(to: any, from: any, savedPosition: any) {
    // 如果有保存的位置，则返回保存的位置
    if (savedPosition) {
      return savedPosition;
    } else {
      // 否则返回当前滚动位置
      return { x: 0, y: 0 };
    }
  },
};
