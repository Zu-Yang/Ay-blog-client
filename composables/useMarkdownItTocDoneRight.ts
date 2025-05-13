import markdownItAnchor from "markdown-it-anchor";
import markdownItTocDoneRight from "markdown-it-toc-done-right";
import MarkdownIt from "markdown-it";

// 创建markdown-it实例
const markdownIt = new MarkdownIt({
  html: false,
  xhtmlOut: true,
  typographer: true
});

export const useMarkdownItTocDoneRight = () => {
  // 配置markdown-it插件
  markdownIt
    .use(markdownItAnchor, {
      permalink: true,
      permalinkSymbol: "#"
    })
    .use(markdownItTocDoneRight, {
      // level: [2],
      containerClass: "tdesign-toc_container",
      listClass: "tdesign-toc_list",
      itemClass: "tdesign-toc_list_item",
      linkClass: "tdesign-toc_list_item_a",
      listType: "ul"
    });

  // 渲染markdown内容
  const markdownContent = `
    # markdown-it rulezz!

    ## 23234234 markdown-it-toc-done-right rulezz even more!
    
    ## susdhfashfishfiashiahf

    ## with markdown-it-toc-done-right rulezz even more!
  `;

  const result = markdownIt.render(markdownContent.trim());

  // 更新DOM
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  rootElement.innerHTML = result;

  // 处理目录点击高亮
  const tocContainer = document.querySelector(".tdesign-toc_container");
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>(".tdesign-toc_list_item_a");

  if (!tocContainer || !tocLinks.length) return;

  // 默认激活第一个链接
  tocLinks[0].classList.add("actived");

  // 点击事件处理
  tocContainer.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "A") {
      tocLinks.forEach(link => link.classList.remove("actived"));
      target.classList.add("actived");
    }
  });
}