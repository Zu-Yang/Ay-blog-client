import { config } from 'md-editor-v3';
import { foldGutter } from '@codemirror/language';
import { lineNumbers } from '@codemirror/view';
// import { basicSetup } from 'codemirror';
// import uslug from 'uslug';
// import slugify from 'slugify';
import Mark from 'markdown-it-mark';
import Anchor from 'markdown-it-anchor';
import LinkAttr from 'markdown-it-link-attributes';
import MarkdownItAttrs from 'markdown-it-attrs';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';

export default defineNuxtPlugin((nuxtApp) => {
  config({
    markdownItConfig(mdit) {
      mdit.use(MarkdownItAttrs, {
        leftDelimiter: '{', // 左分隔符
        rightDelimiter: '}', // 右分隔符
        allowedAttributes: [], // 空数组=允许所有属性, 注意(此版本不建议 # 标题 {#customId}) 自定义元素id属性, 会被原生 mdHeadingId 方法覆盖导致无法正确跳转锚点
      });
      mdit.use(Anchor, {
        permalink: true, // 是否在标题旁加入永久链接
        // permalink: Anchor.permalink.headerLink({ safariReaderFix: true }), // 标题作为锚点链接
        // permalinkSymbol: '#', // 永久链接的符号
        // permalinkBefore: false, // 锚点是否在标题前
        permalinkSpace: false, // 锚点与标题之间是否需要空格, 温馨提示：true 会导致标题自带一个空格与锚点链接不匹配
        slugify: (s: string) => {
          // return uslug(s); // uslug 优化a链接锚点格式,无法处理标题id
          // return slugify(s); // slugify 优化锚点格式,无法处理标题id
          return s;
        },
        // 自定义传递给 slugify 函数的标题
        // getTokensText(tokens: any) {
        //   const text = tokens
        //     .filter((token: any) => !['html_inline', 'image'].includes(token.type))
        //     .map((t: any) => t.content)
        //     .join('')
        //   // console.log(tokens);

        //   return text
        // },
      });
      mdit.use(LinkAttr, {
        matcher(href: string) {
          return !href.startsWith('#'); // 不匹配href属性#开头的锚点链接，示例：<a class="header-anchor" href="#md-editor-v3">#</a>
        },
        attrs: {
          target: '_blank'
        }
      });
      mdit.use(Mark, {});
      mdit.use(markdownItTocDoneRight, {
        containerClass: 'toc',//生成的容器的类名，这样最后返回来的字符串是 <nav class="toc"><nav/>
        containerId: 'toc',//生成的容器的ID，这样最后返回来的字符串是 <nav id="toc"><nav/>
        listType: 'ul',//导航列表使用ul还是ol
        listClass: 'listClass',//li标签的样式名
        linkClass: 'linkClass',//a标签的样式名
        callback: function (html: string, ast: string) {
        }
      });
    },
    markdownItPlugins(plugins, { editorId }) {
      return [
        ...plugins.map((item) => {

          if (item.type === 'taskList') {
            return {
              ...item,
              options: {
                ...item.options,
                enabled: false, // 可切换状态的任务列表
                // 如果只是想对某个编辑器开启这个功能
                // enabled: editorId === 'myId'
              }
            };
          }
          return item;
        }),
      ];
    },
  });
})
