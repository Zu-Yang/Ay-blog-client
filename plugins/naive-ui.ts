// @ts-ignore
import { setup } from "@css-render/vue3-ssr";
// @ts-ignore
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    // 解决刷新样式错乱的问题
    const { collect } = setup(nuxtApp.vueApp);
    if (nuxtApp.ssrContext) {
      const originalRenderMeta = nuxtApp.ssrContext.renderMeta as any;
      nuxtApp.ssrContext.head.hooks.hook("tags:resolve", (ctx) => {
        // 插入样式在 meta 之后
        const lastMetaIndex = ctx.tags.map((x) => x.tag).lastIndexOf("meta");
        const styleTags = collect()
          .split("</style>")
          .filter(Boolean)
          .map((x: any) => {
            const id = x.match(/cssr-id="(.+?)"/)?.[1];
            const style = (x.match(/>(.*)/s)?.[1] || "").trim();
            return {
              tag: "style",
              props: { "cssr-id": id },
              innerHTML: style,
            };
          });
        ctx.tags.splice(lastMetaIndex + 1, 0, ...(styleTags as any));
      });

      nuxtApp.ssrContext.renderMeta = async () => {
        const originalMeta = (await originalRenderMeta?.()) || {};
        return {
          ...originalMeta,
          headTags: (originalMeta.headTags || "") + collect(),
        };
      };
    }
  }
});
