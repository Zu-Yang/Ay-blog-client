<template>
  <div class="">
    <div class="max-lg:w-full max-lg:px-4 max-md:px-0 flex max-w-256 m-auto">
      <n-form
        class="pr-4 w-[256px] md:block hidden sticky top-4 z-10 h-max"
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <n-form-item>
          <n-popconfirm
            positive-text="确认"
            negative-text="取消"
            @positive-click="submit"
            @negative-click=""
          >
            <template #icon>
              <SvgIcon name="article" color="var(--theme-color)"></SvgIcon>
            </template>
            <template #trigger>
              <n-button attr-type="submit" type="primary" block circle> 发布 </n-button>
            </template>
            确认发布
          </n-popconfirm>
        </n-form-item>
        <n-form-item label="封面图" path="">
          <n-upload
            accept="image/*"
            list-type="image-card"
            :default-upload="true"
            multiple
            :max="5"
            v-model:file-list="form.coverFileList"
            :custom-request="customRequest"
            @remove="handleRemove"
          />
        </n-form-item>
        <n-form-item label="标题" path="title">
          <n-input v-model:value="form.title" type="text" placeholder="标题" />
        </n-form-item>
        <n-form-item label="分类" path="categoryId">
          <n-select v-model:value="form.categoryId" :options="categoryArr" clearable />
        </n-form-item>
        <n-form-item label="是否置顶" path="top">
          <n-select
            v-model:value="form.top"
            :options="[
              { label: '置顶', value: 1 },
              { label: '非置顶', value: 0 },
            ]"
          />
        </n-form-item>
        <n-form-item label="摘要" path="summary">
          <n-input v-model:value="form.summary" type="textarea" :rows="10" />
        </n-form-item>
      </n-form>

      <WangEditor
        ref="wangEditorRef"
        @getHtml="getHtml"
        @getEditorImages="getEditorImages"
      />
    </div>

    <div class="md:hidden block">
      <n-button
        class="fixed left-1/2 bottom-4 -translate-x-1/2 z-10"
        strong
        secondary
        round
        @click="drawerShow = true"
      >
        打开配置
      </n-button>
      <n-drawer
        v-model:show="drawerShow"
        placement="bottom"
        height="73vh"
        style="background-color: transparent"
        :content-style="{
          backgroundColor: 'var(--comment-bg-color)',
          backdropFilter: 'blur(8px)',
          overflow: 'hidden',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }"
      >
        <n-drawer-content
          closable
          title="配置选项"
          :body-content-style="{
            scrollbarWidth: 'thin',
          }"
        >
          <n-form ref="formRef" :model="form" :rules="rules">
            <n-form-item label="标题" path="title">
              <n-input v-model:value="form.title" type="text" placeholder="标题" />
            </n-form-item>
            <n-form-item label="摘要" path="summary">
              <n-input v-model:value="form.summary" type="textarea" :rows="5" />
            </n-form-item>
            <n-form-item label="分类" path="categoryId">
              <n-select
                v-model:value="form.categoryId"
                :options="categoryArr"
                clearable
              />
            </n-form-item>
            <n-form-item label="是否置顶" path="top">
              <n-select
                v-model:value="form.top"
                :options="[
                  { label: '置顶', value: 1 },
                  { label: '非置顶', value: 0 },
                ]"
              />
            </n-form-item>
            <n-form-item label="封面图" path="">
              <n-upload
                accept="image/*"
                list-type="image-card"
                :default-upload="true"
                multiple
                :max="5"
                v-model:file-list="form.coverFileList"
                :custom-request="customRequest"
                @remove="handleRemove"
              />
            </n-form-item>
            <n-form-item>
              <n-popconfirm
                positive-text="确认"
                negative-text="取消"
                @positive-click="submit"
                @negative-click=""
              >
                <template #icon>
                  <SvgIcon name="article" color="var(--theme-color)"></SvgIcon>
                </template>
                <template #trigger>
                  <n-button attr-type="submit" type="primary" block circle>
                    发布
                  </n-button>
                </template>
                确认发布
              </n-popconfirm>
            </n-form-item>
          </n-form>
        </n-drawer-content>
      </n-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type {
  FormInst,
  UploadFileInfo,
  UploadInst,
  UploadCustomRequestOptions,
} from "naive-ui";
import { useWindowSize } from "@vueuse/core";

const appConfig = useAppConfig();
const { width, height } = useWindowSize();

const $config = useRuntimeConfig();
const baseURL = $config.public.baseURL;
const $http = useHttp();
const $message = useDiscreteApi().message;
const { categoryInfo } = useArticle();

const categoryArr = ref<object[]>([
  ...categoryInfo.map((item) => {
    return { value: String(item.category_id), label: item.category_name };
  }),
]);
const formRef = ref<FormInst | null>(null);
const wangEditorRef = ref();
const drawerShow = ref(false);
const form = reactive({
  // updateUserId: 1,
  // userId: 1,
  // likeCount: 0,
  // commentCount: 0,
  // readCount: 0,
  top: 0,
  tagId: 1,
  title: "Technology, Environment, Culture",
  summary:
    "在未来，人工智能将显著改变我们的生活方式，提升生产力和效率。与此同时，环境保护成为全球关注的焦点，个人应从小事做起，积极参与环保行动。此外，文化交流促进了不同民族之间的理解与合作，通过艺术和文学的互动，丰富了人们的生活，推动了全球化进程。尊重和欣赏多元文化是实现和平与发展的关键。",
  html: "",
  categoryId: null, // 不能是数字否则规则验证会出错
  coverFileList: [],
});
const rules = ref({
  title: {
    required: true,
    message: "请输入标题",
    trigger: ["blur", "input"],
  },
  summary: {
    required: true,
    message: "请输入文章摘要",
    trigger: ["blur", "input"],
  },
  categoryId: {
    required: true,
    message: "请选择分类",
    trigger: "change",
  },
  coverFileList: {
    required: true,
    message: "请上传封面图",
    trigger: "change",
  },
});

watch(
  () => width.value,
  (newVal) => {
    if (newVal > appConfig.bp.md) {
      drawerShow.value = false;
    }
  },
  { immediate: true }
);

// 提交文章数据
const submit = (e: MouseEvent) => {
  e.preventDefault();
  console.log(form);
  formRef.value?.validate(async (err: any) => {
    if (!err) {
      const cover = form.coverFileList.map((item: any) => item.url);
      const params = {
        tag_id: form.tagId,
        category_id: Number(form.categoryId),
        article_top: form.top,
        // article_update_user_id: form.updateUserId,
        // article_user_id: form.userId,
        // article_like_count: form.likeCount,
        // article_comment_count: form.commentCount,
        // article_read_count: form.readCount,
        article_title: form.title,
        article_summary: form.summary,
        article_cover: cover,
        article_content: form.html,
      };
      const res = await $http.article.addArticles(params);
      if (res.code == 200) {
        $message.success("文章发布成功");
      } else {
        $message.error("发布失败");
      }
    } else {
      console.error(err);
      $message.error("Invalid");
    }
  });
};

/* 文章封面图相关 S */
// 获取标编辑器内容
const getHtml = (data: { html: string }) => {
  form.html = data.html;
};
// 获取编辑器图片
const getEditorImages = () => {
  // 过滤重复的图片,代码顺序不能变
  const uploadImageList = form.coverFileList.filter((item: any) => item.batchId);

  const editorImageList = wangEditorRef.value.historyImage;

  form.coverFileList = [].concat(...uploadImageList, ...editorImageList);
};
// 自定义上传
const customRequest = async ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  try {
    const res = await $http.minio.uploadImage(file.file);
    if (res.code == 200) {
      const { images } = res.data;
      images.forEach((url: string) => {
        file.url = url; // 将返回的url赋值给file
        onFinish();
      });
    }
  } catch (error) {
    onError();
    console.error(error);
  }
};
// 删除封面图
const handleRemove = async (options: {
  file: UploadFileInfo;
  fileList: Array<UploadFileInfo>;
  index: number;
}) => {
  const { index } = options;
  const { url, id, status } = options.file;
  // 判断是否来源编辑器
  const isSourceEditor = wangEditorRef.value.historyImage.some(
    (item: any) => item.id == id
  );

  if (isSourceEditor) {
    // 来源编辑器的图片就删除痕迹不删除后台图片
    return true;
  } else {
    if (status == "finished") {
      // 自定义上传完成的删除后台图片与痕迹
      const match = url?.match(/\/([^\/?]+)(\?.*)?$/); // 获取url的图片名称
      const name = match ? match[1] : "";
      await $http.minio
        .deleteImage([name])
        .then((res: any) => {
          if (res.code == 200) {
            $message.success(res.msg);
            return true;
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    } else if (status == "pending") {
      return true;
    }
  }
};
/* 文章封面图相关 E */
</script>

<style lang="scss" scoped>
:deep(.n-upload-file-list) {
  display: flex;
  flex-wrap: wrap;

  .n-upload-file {
    width: 100%;

    img {
      object-fit: cover !important;
    }
  }

  .n-upload-trigger {
    width: 100%;
  }
}
</style>
