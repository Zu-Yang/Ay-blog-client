<template>
  <div class="editor">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
    <Editor
      style="
        height: calc(100vh - 80px);
        border-top: 1px solid var(--w-e-toolbar-border-color);
        scrollbar-width: thin;
      "
      v-model="html"
      :defaultConfig="editorConfig"
      @onCreated="(editor) => (editorRef = editor)"
      @onChange="editorChange"
    />
    <!-- 标题目录 -->
    <ul id="anchor-container"></ul>
  </div>
</template>
<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { ref, shallowRef, onMounted, onBeforeUnmount } from "vue";
import {
  SlateNode,
  SlateElement,
  SlateText,
  SlateTransforms,
  SlateEditor,
} from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { v4 as uuid4 } from "uuid";

const $message = useDiscreteApi().message;
const $http = useHttp();
const $config = useRuntimeConfig();

const $emit = defineEmits(["getHtml", "getEditorImages"]);

const html = ref(
  "<h1>标题</h1><h2>标题A</h2><p>文本</p><p>文本</p><p>文本</p><h3>标题A1</h3><p>文本</p><p>文本</p><p>文本</p><h3>标题A2</h3><p>文本</p><p>文本</p><p>文本</p><h2>标题B</h2><p>文本</p><p>文本</p><p>文本</p><h3>标题B1</h3><p>文本</p><p>文本</p><p>文本</p><h3>标题B2</h3><p>文本</p><p>文本</p><p>文本</p>"
);
const offsetArr = ref([]);
const historyImage = [];
const baseURL = $config.public.baseURL;
const imageBaseURL = $config.public.imageBaseURL + "/article-images/";
const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const toolbarConfig = {};
const editorConfig = {
  placeholder: "请输入内容...",
  autoFocus: true,
  MENU_CONF: {},
};

const editorChange = async (editor) => {
  if (!editor.isEmpty()) {
    await deleteImage();
    const htmlContent = editor.getHtml();
    const offsetArrTemp = [];
    const headers = editor.getElemsByTypePrefix("header");
    headers.forEach((item) => {
      const id = "#" + item.id;
      const elem = document.querySelector(id);
      const top = elem.offsetTop;
      offsetArrTemp.push({ id, top });
      offsetArr.value = offsetArrTemp;
    });
    const content_title = headers
      .map((header) => {
        const text = SlateNode.string(header);
        const { id, type } = header;
        return `<li id="${id}" type="${type}">${text}</li>`;
      })
      .join("");
    $emit("getHtml", { html: htmlContent });
    headerContainer.value.innerHTML = content_title;
  }
};
/* 图片上传配置 S */
// 上传图片的配置
editorConfig.MENU_CONF["uploadImage"] = {
  allowedFileTypes: ["image/*"],
  // 自定义上传。tips：不使用 wangEditor 自带的上传功能，多少张图就会调用多少次 customUpload
  customUpload: async (file, insertFn) => {
    if (!file || (!(file instanceof File) && !(file instanceof Blob))) {
      console.error("不是有效的File或者Blob文件对象");
      return;
    }
    const res = await $http.minio.uploadImage(file);
    if (res.code == 200 && res.data.images.length > 0) {
      const url = res.data.images[0];
      insertFn(url, file.name);
      historyImage.push({
        id: uuid4().substring(0, 8),
        name: file.name,
        type: file.type,
        url: url,
        file,
        status: "finished",
        source: "editor",
      }); // 写入历史记录
      $emit("getEditorImages"); // 同步更新封面图
      $message.success(`${file.name} upload success`);
    } else {
      $message.success("上传错误");
    }
  },
};

// 删除图片
const deleteImage = async () => {
  const currentImage = editorRef.value.getElemsByType("image").map((item) => item.src); // 返回当前的url
  const recordImage = historyImage.map((item) => item.url); // 返回记录的url
  if (recordImage.length > currentImage.length) {
    const urlArr = recordImage.filter((item) => !currentImage.includes(item)); //
    const nameArr = [];
    if (urlArr.length > 0) {
      // 获取url中的图片名称
      urlArr.forEach((item, idx) => {
        const match = item.match(/\/([^\/?]+)(\?.*)?$/);
        const name = match ? match[1] : "";
        nameArr.push(name);
      });
    }

    // 清理被删掉的图片
    if (nameArr.length > 0) {
      await $http.minio
        .deleteImage(nameArr)
        .then((res) => {
          if (res.code == 200) {
            for (let index = 0; index < historyImage.length; index++) {
              const item = historyImage[index].url;
              if (urlArr.includes(item)) {
                historyImage.splice(index, 1); // 删除图片记录
                break;
              }
            }
            $emit("getEditorImages"); // 同步更新封面图
            $message.success(res.msg);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
};
/* 图片上传配置 E */

/* 视频上传配置 S */
editorConfig.MENU_CONF["uploadVideo"] = {
  // 自定义上传
  async customUpload(file, insertFn) {
    $message.success("ban on use", "error");
    return;
    // insertFn(url, poster);
  },
  // 自定义插入视频
  customInsert(res, insertFn) {
    $message.success("ban on use", "error");
    return;
    // insertFn(url, poster);
  },
};
/* 视频上传配置 E */

const headerContainer = ref(null);
onMounted(() => {
  // 标题 DOM 容器
  headerContainer.value = document.getElementById("anchor-container");
  headerContainer.value.addEventListener("mousedown", (event) => {
    if (event.target.tagName !== "LI") return;
    event.preventDefault();
    const id = event.target.id;
    editorRef.value.scrollToElem(id); // 滚动到标题
  });
  nextTick(() => {
    const wangEditor = document.querySelector(".w-e-scroll");
    wangEditor.style.scrollbarWidth = "thin"; // 滚动条宽度
    wangEditor.addEventListener("scroll", (event) => {
      const scrollTop = event.target.scrollTop;
      offsetArr.value.forEach((item, index) => {
        if (scrollTop >= item.top - 1) {
          const ele = document.querySelector("#anchor-container " + item.id);
          ele.style.color = "var(--theme-color)";
        } else {
          const ele = document.querySelector("#anchor-container " + item.id);
          ele.style.color = "";
        }
      });
    });
  });
});

onUnmounted(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy(); // 组件销毁时，也及时销毁编辑器
});
/* 暴露变量 S */
defineExpose({ historyImage });
/* 暴露变量 E */
</script>

<style lang="scss">
.editor {
  max-width: 700px;
  height: 100%;
  position: relative;
}
#anchor-container {
  list-style-type: none;
  padding-left: 20px;
  box-sizing: border-box;
  width: 200px;
  position: absolute;
  top: 80px;
  right: -200px;
  z-index: 110;
}

#anchor-container li {
  margin: 10px 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: var(--transition);
}

#anchor-container li:hover {
  text-decoration: underline;
}

#anchor-container li[type="header1"] {
  font-size: 18px;
  font-weight: bold;
}

#anchor-container li[type="header2"] {
  font-size: 16px;
  padding-left: 15px;
}

#anchor-container li[type="header3"] {
  font-size: 14px;
  padding-left: 30px;
}

#anchor-container li[type="header4"] {
  font-size: 12px;
  padding-left: 45px;
}

#anchor-container li[type="header5"] {
  font-size: 12px;
  padding-left: 60px;
}
</style>
