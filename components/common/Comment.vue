<template>
  <div class="comment-wrap">
    <n-drawer
      :width="480"
      style="background-color: transparent"
      v-model:show="showDrawer"
      @update:show="(newShow:boolean) => emit('change', newShow)"
      id="comment-container"
      placement="right"
      display-directive="show"
      :trap-focus="true"
      :block-scroll="true"
      :close-on-esc="true"
      :auto-focus="true"
      :content-style="{
        backgroundColor: 'var(--comment-bg-color)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }"
    >
      <n-drawer-content closable>
        <template #header>
          <div style="text-align: center">{{ totalNum }}条评论</div>
        </template>
        <template #footer>
          <n-tabs
            :class="['emoji-teb', { 'hide-emoji': showEmoji === false }]"
            type="line"
            :default-value="0"
            :pane-style="{
              overflow: 'auto',
              scrollbarWidth: 'thin',
            }"
          >
            <n-tab-pane
              v-for="(category, index) in emojiList"
              :name="index"
              :tab="category.categoryName"
              :key="index"
            >
              <div class="emoji-container">
                <div
                  class="emoji"
                  v-for="(item, index) in category.emojiList"
                  :key="index"
                  @click="insertTextAtCursor($event)"
                >
                  <i
                    :title="item.name"
                    v-html="item.htmlCode[0]"
                    :data-htmlCode="item.htmlCode"
                  ></i>
                </div>
              </div>
            </n-tab-pane>
          </n-tabs>
          <div :class="['form-wrap', { 'hide-form': showForm === false }]">
            <n-form
              size="small"
              ref="formRef1"
              :model="paramsForm"
              :rules="rules1"
              :show-feedback="true"
              :show-label="false"
            >
              <n-form-item path="user.name">
                <n-input
                  v-model:value="paramsForm.user.name"
                  :minlength="2"
                  :maxlength="12"
                  placeholder="昵称*"
                />
              </n-form-item>
              <n-form-item path="user.email">
                <n-input v-model:value="paramsForm.user.email" placeholder="邮箱*" />
              </n-form-item>
              <n-form-item path="user.jumpUrl">
                <n-input
                  v-model:value="paramsForm.user.jumpUrl"
                  placeholder="网址(非必填)"
                />
              </n-form-item>
              <div style="display: flex; justify-content: flex-end">
                <n-button round type="primary" size="small" @click="setLocal">
                  保存
                </n-button>
              </div>
            </n-form>
          </div>
          <div
            :class="['edit-container', { show: showEmoji === true || showForm === true }]"
            id="edit-container"
          >
            <div class="edit">
              <textarea
                v-model="paramsForm.comment"
                id="editable"
                ref="textareaRef"
                name="comment"
                rows="2"
                :placeholder="placeholder"
                @input="changeTextarea"
              ></textarea>
            </div>
            <div class="control">
              <div class="left">
                <n-button
                  :class="[{ 'btn-emoji': showEmoji === true }]"
                  attr-type="button"
                  text
                  :round="true"
                  :focusable="false"
                  @click="toggleEmoji"
                >
                  <SvgIcon name="emoji" size="24"></SvgIcon>
                </n-button>
                <n-button
                  :class="['btn-ml', { 'btn-form': showForm === true }]"
                  text
                  attr-type="button"
                  :round="true"
                  :focusable="false"
                  @click="toggleForm"
                >
                  <SvgIcon name="set" size="24"></SvgIcon>
                </n-button>
              </div>
              <div class="right">
                <n-button
                  class="btn-ml"
                  :disabled="disabledDel"
                  attr-type="button"
                  text
                  :round="true"
                  :focusable="false"
                  @click="cancelHandle"
                >
                  <SvgIcon name="delete" size="24"></SvgIcon>
                </n-button>
                <n-button
                  class="btn-ml"
                  attr-type="button"
                  text
                  :round="true"
                  :focusable="false"
                  @click="handleComment"
                  :disabled="disabledSend"
                >
                  <SvgIcon name="send" size="24"></SvgIcon>
                </n-button>
              </div>
            </div>
          </div>
        </template>
        <div class="drawer-content" id="drawer-content">
          <n-infinite-scroll
            :scrollbar-props="{
              trigger: 'none',
            }"
            v-if="commentList.length"
            :distance="10"
            @load="handleLoad"
          >
            <div v-for="(item, index) in commentList" :key="index" class="item">
              <n-thing content-indented>
                <template #avatar>
                  <SvgIcon name="avatar" size="35"></SvgIcon>
                </template>
                <template #header>
                  <a class="nick_name" :href="item.jump_url" target="_blank">
                    {{ item.visitor_info.nick_name || item.nick_name }}
                  </a>
                </template>
                <template #header-extra v-if="localIP == item.user_ip">
                  <span class="self">
                    <SvgIcon name="mark" size="20"></SvgIcon>
                  </span>
                </template>
                <template #description>
                  <n-time
                    :time="Date.now()"
                    :to="new Date(item.created_at)"
                    type="relative"
                  />
                  · {{ item.visitor_info.province }}
                  <!-- · {{ item.visitor_info.city }} -->
                </template>
                <div class="html-content" v-html="item.content"></div>
                <template #footer>
                  <div class="reply-btn">
                    <n-button
                      text
                      icon-placement="right"
                      :focusable="false"
                      @click="handleReply(item)"
                    >
                      <template #icon>
                        <SvgIcon name="reply" size="18"></SvgIcon>
                      </template>
                      回复
                    </n-button>
                  </div>
                  <n-collapse-transition :show="item.open == 1">
                    <n-thing content-indented v-for="reply in item.replys">
                      <template #avatar>
                        <SvgIcon name="avatar" size="35"></SvgIcon>
                      </template>
                      <template #header>
                        <div class="reply-title">
                          <a class="nick_name" :href="reply.jump_url" target="_blank">
                            {{ reply.visitor_info.nick_name || reply.nick_name }}
                          </a>
                          <SvgIcon
                            name="arrow-drop-right-fill"
                            size="12"
                            color="var(--color1)"
                          ></SvgIcon>
                          <a
                            class="reply_name"
                            :href="reply.reply_info.user_jump_url"
                            target="_blank"
                          >
                            {{ reply.reply_info.nick_name }}
                          </a>
                        </div>
                      </template>
                      <template
                        #header-extra
                        v-if="localIP == reply.visitor_info.user_ip"
                      >
                        <span class="self">
                          <SvgIcon name="mark" size="20"></SvgIcon
                        ></span>
                      </template>
                      <template #description>
                        <n-time
                          :time="Date.now()"
                          :to="new Date(reply.created_at)"
                          type="relative"
                        />
                        · {{ reply.visitor_info.province }}
                        <!-- · {{ reply.visitor_info.city }} -->
                      </template>
                      <div v-html="reply.content"></div>
                      <template #footer>
                        <n-button
                          text
                          icon-placement="right"
                          :focusable="false"
                          @click="handleReply(reply)"
                        >
                          <template #icon>
                            <SvgIcon name="reply" size="18"></SvgIcon>
                          </template>
                          回复
                        </n-button>
                      </template>
                    </n-thing>
                  </n-collapse-transition>
                </template>
                <template #action v-if="item.replys">
                  <n-button
                    text
                    v-if="item.replys.length && item.open == 0"
                    :focusable="false"
                    icon-placement="right"
                    @click="item.open = 1"
                  >
                    展开{{ item.replys.length }}条回复
                    <template #icon>
                      <SvgIcon name="arrow-down" size="18"></SvgIcon>
                    </template>
                  </n-button>
                  <n-button
                    text
                    v-if="item.replys.length && item.open == 1"
                    :focusable="false"
                    icon-placement="right"
                    @click="item.open = 0"
                  >
                    收起回复
                    <template #icon>
                      <SvgIcon name="arrow-up" size="18"></SvgIcon>
                    </template>
                  </n-button>
                  <a href=""></a>
                </template>
              </n-thing>
            </div>
            <div v-if="loading2" class="bottom-text">加载中...</div>
            <div v-if="noMore" class="bottom-text">没有更多评论</div>
          </n-infinite-scroll>
          <n-empty v-else class="empty" description="快来发表你的评论吧~">
            <template #extra> </template>
          </n-empty>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { emojiData } from "~/assets/js/emoji";
import { v4 } from "uuid";
import type { FormInst, FormItemRule } from "naive-ui";
const { message } = useDiscreteApi();
const { getIP } = useLocal();
const { ip } = await getIP();
const $http = useHttp();
const emit = defineEmits(["change"]);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  articleId: {
    type: Number,
    default: null,
  },
});

const parentId = ref("");
const replyIp = ref("");
const prefix = ref("");
const placeholder = ref("想说点什么...");
const formRef1 = ref<FormInst | null>(null);
const formRef2 = ref<FormInst | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const localIP = ref(ip);
// const emojiList = ref(emojiData);
const emojiList = ref<any[]>([]);
const emojiCategory = ref([]);
const commentList = ref<any>([]);
const pageNum = ref(1);
const limitNum = ref(10);
const totalNum = ref(0);
const loading2 = ref(false);
const showDrawer = ref(props.show);
const disabledSend = ref(true);
const disabledDel = ref(true);
const isReply = ref(false);
const showEmoji = ref(false);
const showForm = ref(false);

const noMore = computed(() => {
  const curNum = pageNum.value * limitNum.value;
  if (curNum >= totalNum.value) {
    return true;
  } else {
    return false;
  }
});

const paramsForm = ref({
  user: {
    name: "", // 用户
    email: "", // 123456@qq.com
    jumpUrl: "", // http://baidu.com
  },
  comment: "",
});

const rules1 = ref({
  user: {
    name: {
      required: true,
      trigger: ["input", "blur"],
      validator(rule: FormItemRule, value: string) {
        const nicknameRegex = /^[\u4e00-\u9fa5\w]{2,12}$/;
        if (!value) {
          return new Error("请输入昵称");
        } else if (!nicknameRegex.test(value)) {
          return new Error("只允许汉字、字母、数字和下划线，长度2-12个字符组成");
        }
        return true;
      },
    },
    email: {
      required: true,
      trigger: ["input", "blur"],
      validator(rule: FormItemRule, value: string) {
        const emaileRegex = /^([A-z0-9]{6,18})+@[A-z0-9]+\.([A-z]{2,3})$/;
        if (!value) {
          return new Error("请输入邮箱");
        } else if (!emaileRegex.test(value)) {
          return new Error("只允许英文字母、数字、下划线、英文句号、以及中划线组成");
        }
        return true;
      },
    },
    jumpUrl: {
      required: false,
      trigger: ["input", "blur"],
      validator(rule: FormItemRule, value: string) {
        const urlRegex = /^(https:\/\/|http:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})(:[0-9]{1,5})?(\/[\w\.]*)*\/?(\?[a-zA-Z0-9=&_.-]*)?(#[\w]*)?$/;
        if (value && !urlRegex.test(value)) {
          return new Error("网址格式不正确，网址协议必填");
        }
        return true;
      },
    },
  },
});

const handleValidate1 = () => {
  return new Promise(async (resolve, reject) => {
    await formRef1.value?.validate((errors) => {
      if (errors) {
        message.error("请填写正确信息");
        showForm.value = true;
        return reject(false);
      }
    });
    showForm.value = false;
    return resolve(true);
  });
};
const handleValidate2 = () => {
  return new Promise(async (resolve, reject) => {
    await formRef2.value?.validate((errors) => {
      if (errors) {
        message.error("请输入评论内容");
        reject(false);
      }
    });
    resolve(true);
  });
};

const insertTextAtCursor = ($event: Event) => {
  const tar = $event.target as HTMLElement;
  const text = tar.innerText;
  const textarea = textareaRef.value as HTMLTextAreaElement;
  const startPos = textarea?.selectionStart as number;
  const endPos = textarea?.selectionEnd as number;
  const beforeText = textarea?.value.substring(0, startPos);
  const afterText = textarea?.value.substring(endPos, textarea?.value.length);

  // 插入内容
  textarea.value = beforeText + text + afterText;

  // 将光标移动到插入内容的后面
  textarea.selectionStart = startPos + text.length;
  textarea.selectionEnd = startPos + text.length;
  textarea.focus();
};
const setLocal = async () => {
  await handleValidate1();
  localStorage.setItem("COMMENT_USERINFO", JSON.stringify(paramsForm.value.user));
  showForm.value = false;
};
const getLocal = async () => {
  const COMMENT_USERINFO = localStorage.getItem("COMMENT_USERINFO");
  if (COMMENT_USERINFO) {
    const data = JSON.parse(COMMENT_USERINFO);
    Object.assign(paramsForm.value.user, data);
  }
};

const toggleForm = () => {
  showForm.value = !showForm.value;
  showEmoji.value = false;
};
const toggleEmoji = () => {
  showEmoji.value = !showEmoji.value;
  showForm.value = false;
};

const changeTextarea = () => {
  console.log("changeTextarea");
};

const cancelHandle = () => {
  isReply.value = false;
  disabledDel.value = true;
  disabledSend.value = true;
  placeholder.value = "想说点什么...";
  prefix.value = "";
  paramsForm.value.comment = "";
  replyIp.value = "";
  parentId.value = "";
  formRef2.value?.restoreValidation();
};

const handleReply = async (comment: any) => {
  await handleValidate1();

  isReply.value = true;
  disabledDel.value = false;
  disabledSend.value = true;
  paramsForm.value.comment = "";
  placeholder.value = `回复@${comment.visitor_info.nick_name}`;
  replyIp.value = comment.user_ip;
  parentId.value = comment.comment_id;
  prefix.value = `@${comment.visitor_info.nick_name}`;
  textareaRef.value?.focus();
  formRef2.value?.restoreValidation();
};
const handleComment = async () => {
  await handleValidate1();
  // await handleValidate2();
  disabledSend.value = true;
  const { user, comment } = paramsForm.value;
  const biz_id = props.articleId;
  const biz_type = "article";
  const params = {
    nick_name: user.name.trim(),
    user_email: user.email,
    jump_url: user.jumpUrl,
    user_avatar: null,
    user_ip: localIP.value,
    biz_type: biz_type,
    biz_id: biz_id,
    comment_id: v4(),
    reply_ip: replyIp.value,
    parent_id: parentId.value,
    content: comment,
    deleted: 0,
    approved: 1,
    open: 0,
  };
  return;
  const res = await $http.comment.add(params);
  if (res.code == 200) {
    if (replyIp.value && parentId.value) {
      commentList.value.reduce((accValue: any, curValue: any, curIndex: number) => {
        if (curValue.comment_id == parentId.value) {
          commentList.value[curIndex].replys.push(res.data);
        }
      }, []);
    } else {
      commentList.value.push(res.data);
    }
    message.success("评论成功");
    cancelHandle();
  } else {
    message.warning(res.message);
    disabledSend.value = false;
  }
};
const handleLoad = async () => {
  if (loading2.value || noMore.value) return;
  loading2.value = true;
  pageNum.value += 1;
  const params = {
    biz_id: props.articleId,
    biz_type: "article",
    page: pageNum.value,
    limit: limitNum.value,
  };
  await $http.comment
    .list(params)
    .then((result: any) => {
      console.log(result);
      if (result.code == 200) {
        commentList.value.push(...result.data);
        loading2.value = false;
      }
    })
    .catch((err: any) => {});
};

const getCommentList = async () => {
  const params = {
    biz_id: props.articleId,
    biz_type: "article",
    page: pageNum.value,
    limit: limitNum.value,
  };
  await $http.comment
    .list(params)
    .then((result: any) => {
      console.log(result);
      if (result.code == 200) {
        commentList.value.push(...result.data);
        totalNum.value = result.total;
      }
    })
    .catch((err: any) => {});
};
// 过滤 Emoji
const filterEmoji = (emojis: any) => {
  const emojiData = [] as any[];
  const categorys = [] as any;
  const filterEmojis = [
    "\u0026#127995;",
    "\u0026#127996;",
    "\u0026#127997;",
    "\u0026#127998;",
    "\u0026#127999;",
  ];
  const filterCategorys = ["flags"];
  emojis.forEach((emoji: any) => {
    const category = emoji.category;
    if (emoji.htmlCode.length > 1) return; // 排除重复&多余表情
    if (filterCategorys.includes(category)) return; // 排除不想要的分类
    // if (filterEmojis.includes(emoji.htmlCode[0])) return; // 排除不需要的表情

    if (!categorys.includes(category)) {
      emojiData.push({
        categoryName: category,
        emojiList: [],
      });
      categorys.push(category);
    }
    emojiData.forEach((item: any) => {
      if (item.categoryName == category) {
        item.emojiList.push(emoji);
      }
    });
  });
  emojiList.value.push(...emojiData);
};
const getEmoji = async () => {
  await $http.emoji
    .getEmojiList()
    .then((result: any) => {
      filterEmoji(result);
    })
    .catch((err: any) => {});
};
function autoResizeTextarea() {
  if (textareaRef && textareaRef.value) {
    textareaRef.value.addEventListener("input", (e) => {
      const tar = e.target as HTMLElement;
      // 重置高度为 auto，以便计算正确的高度
      tar.style.height = "auto";
      // 设置最大滚动高度
      tar.style.maxHeight = "150px";
      // 设置高度为滚动高度（内容高度）
      tar.style.height = tar.scrollHeight + "px";

      if (tar.scrollHeight > 150) {
        // 例如最大高度为 200px
        tar.style.overflowY = "auto"; // 超过最大高度时显示滚动条
      } else {
        tar.style.overflowY = "hidden"; // 否则隐藏滚动条
      }
    });
  }
}

watch(
  () => props.show,
  (newValue) => {
    showDrawer.value = newValue;
  }
);
watch(
  () => paramsForm.value.comment,
  (newValue) => {
    if (newValue.trim().length > 0) {
      disabledSend.value = false;
      disabledDel.value = false;
    } else {
      disabledSend.value = true;
      if (isReply.value) {
        disabledDel.value = false;
      } else {
        disabledDel.value = true;
      }
    }
  },
  {
    immediate: true,
  }
);

onMounted(async () => {
  await getCommentList();
  await getLocal();
  // await getEmoji();
  filterEmoji(emojiData);
  autoResizeTextarea();
});
</script>

<style lang="scss" scoped>
:deep(.n-drawer-header) {
  border-bottom: none !important;
}
:deep(.n-drawer-body-content-wrapper) {
  padding: 0 !important;
  scrollbar-width: var(--scrollbar-width);
}
:deep(.n-drawer-footer) {
  border-top: none !important;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  position: relative;
}
.form-wrap {
  position: absolute;
  top: -192px;
  left: 24px;
  right: 24px;
  border-radius: 24px;
  padding: 12px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  transition: var(--transition);
  background: var(--comment-popup-bg-color);
  backdrop-filter: blur(10px);
  opacity: 1;
  visibility: visible;
  box-shadow: 0px 0px 20px 0px var(--comment-textarea-box-shadow);
  &.hide-form {
    opacity: 0;
    visibility: hidden;
    top: -150px;
  }
}
.emoji-teb {
  width: auto;
  height: 200px;
  border-radius: 24px;
  padding: 12px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  transition: var(--transition);
  background: var(--comment-popup-bg-color);
  backdrop-filter: blur(10px);
  opacity: 1;
  visibility: visible;
  position: absolute;
  left: 24px;
  right: 24px;
  top: -184px;
  box-shadow: 0px 0px 20px 0px var(--comment-textarea-box-shadow);
  &.hide-emoji {
    opacity: 0;
    visibility: hidden;
    top: -150px;
  }
  .emoji-container {
    display: grid;
    grid-template-columns: repeat(10, auto);
    grid-gap: 5px 0px;
    align-items: center;
    justify-items: center;
    justify-content: space-between;
    overflow: auto;
    height: 100%;
    scrollbar-width: thin;
  }
  .emoji i {
    display: inline-block;
    font-style: normal;
    font-size: 22px;
    cursor: pointer;
  }
}
.n-drawer {
  .n-drawer-footer {
    display: flex;
    flex-direction: column;
    .edit-container {
      width: 100%;
      background: var(--comment-textarea-bg-color);
      border-radius: 24px;
      padding: 12px;
      z-index: 1001;
      transition: var(--transition);
      box-shadow: 0px 0px 20px 0px var(--comment-textarea-box-shadow);
      &.show {
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
      }
      :deep(.n-drawer-container) {
        overflow: hidden;
      }
    }
    textarea {
      scrollbar-width: var(--scrollbar-width);
      display: block;
      width: 100%;
      background: transparent;
      border: none;
      color: var(--n-text-color);
      resize: none;
      caret-color: var(--theme-color); // 光标颜色
      overflow: hidden; // 默认隐藏滚动条
      &::-webkit-input-placeholder {
        color: var(--color1);
      }
      &:focus {
        outline: none;
        overflow: auto; // 聚焦时如果内容超出则显示滚动条
      }
    }
    .control {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left,
      .right {
        display: flex;
      }
      .btn-ml {
        margin-left: 5px;
      }
      .btn-form,
      .btn-emoji {
        color: var(--n-text-color-hover);
      }
    }
  }
}

.drawer-content {
  padding: 0px 24px;
  .item {
    margin: 20px 0;
  }
  :deep(.n-thing) {
    margin-top: 20px;
    .n-thing-header__title {
      font-size: 14px;
      .nick_name,
      .reply_name {
        color: var(--n-text-color);
        text-decoration: none;
        &:hover {
          color: var(--theme-color);
        }
      }
    }
    .n-thing-main__content {
      .collapse {
        margin-left: 12px;
        .n-button {
          font-size: 14px;
          color: var(--color1);
          &:hover {
            color: var(--theme-color);
          }
        }
      }
    }
    .n-thing-main__description {
      font-size: 14px;
      color: var(--color1);
    }
    .n-thing-main__footer,
    .n-thing-main__action {
      .n-button {
        font-size: 14px;
        color: var(--color1);
        &:hover {
          color: var(--theme-color);
        }
      }
    }
  }

  .reply-title {
    display: flex;
    align-items: center;
    .svg-icon {
      margin: 0 4px;
    }
  }
  // .self {
    // display: inline-block;
    // color: var(--theme-color);
    // height: 5px;
    // width: 5px;
    // background-color: var(--theme-color);
    // border-radius: 50%;
  // }
  .bottom-text {
    margin: 20px 0;
    text-align: center;
    color: var(--color1);
  }
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
