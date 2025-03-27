import mediumZoom from "medium-zoom";

export default (el: any) => {
  mediumZoom(el, {
    scrollOffset: 0,
    // background: "var(--bg-color)",
  });
};
