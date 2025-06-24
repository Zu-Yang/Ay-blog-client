<template>
  <n-drawer v-model:show="showDrawer" @update:show="(newShow: boolean) => $emit('change', newShow)"
    id="comment-container" display-directive="show" :placement="placement" :width="480" :trap-focus="true"
    :block-scroll="true" :close-on-esc="true" :auto-focus="true" style="background-color: transparent; min-height: 74vh"
    :content-style="{
      backgroundColor: 'var(--comment-bg-color)',
      backdropFilter: 'blur(16px)',
      overflow: 'hidden',
      borderTopLeftRadius: '0',
      borderTopRightRadius: '0',
    }">
    <n-drawer-content closable :body-style="{}" :body-content-style="{
      height: '100%',
      overflow: 'hidden',
      padding: '16px 0px 0px 0px',
    }" :header-style="{
        borderBottom: 'none',
      }" :footer-style="{
        position: 'relative',
        borderTop: 'none',
        padding: '16px',
      }">
      <template #header>
        <div class="text-center">{{ totalNum }}条评论</div>
      </template>
      <template #footer>
        <!-- emoji -->
        <div :class="[
          ' absolute left-4 right-4 -top-[184px] h-[200px] w-auto rounded-[24px] rounded-b-none p-4 pt-2 transition-all bg-[var(--comment-popup-bg-color)] shadow-[0_0_20px_0_var(--comment-textarea-box-shadow)]',
          { 'opacity-0 invisible -top-[150px]': !showEmoji },
        ]">
          <n-tabs class="w-full h-full" type="line" trigger="hover" :default-value="0" :pane-style="{
            overflow: 'auto',
          }">
            <n-tab-pane v-for="(category, index) in emojiList" :name="index" :tab="category.categoryName" :key="index">
              <div
                class="grid grid-cols-10 gap-y-[5px] justify-between items-center justify-items-center overflow-auto h-full scrollbar-thin">
                <div class="transition-all border border-transparent hover:border-[var(--theme-color)]"
                  v-for="(item, index) in category.emojiList" :key="index" @click="insertEmoji($event)">
                  <i class="inline-block not-italic text-[22px] cursor-pointer transition-transform select-none active:scale-95"
                    :title="item.name" v-html="item.htmlCode[0]" :data-htmlCode="item.htmlCode"></i>
                </div>
              </div>
            </n-tab-pane>
          </n-tabs>
        </div>
        <!-- 表单 -->
        <div :class="[
          'absolute -top-[184px] left-4 right-4 h-[200px] rounded-[24px] rounded-b-none px-4 pt-4 transition-all bg-[var(--comment-popup-bg-color)] shadow-[0_0_20px_0_var(--comment-textarea-box-shadow)]',
          { 'opacity-0 invisible -top-[150px]': !showForm },
        ]">
          <n-form size="small" ref="formRef1" :model="paramsForm" :rules="formRules" :show-feedback="true"
            :show-label="false">
            <n-form-item path="user.name">
              <n-input v-model:value="paramsForm.user.name" :minlength="2" :maxlength="12" placeholder="昵称*" />
            </n-form-item>
            <n-form-item path="user.email">
              <n-input v-model:value="paramsForm.user.email" placeholder="邮箱*" />
            </n-form-item>
            <n-form-item path="user.jumpUrl">
              <n-input v-model:value="paramsForm.user.jumpUrl" placeholder="网址(非必填)" />
            </n-form-item>
            <div class="flex justify-end">
              <button
                class="rounded-full text-sm px-4 py-0 bg-[var(--theme-color)] transition-transform hover:scale-105 active:scale-95"
                @click="setLocal">
                保存
              </button>
            </div>
          </n-form>
        </div>
        <!-- 输入框 -->
        <div :class="[
          'w-full bg-[var(--comment-textarea-bg-color)] rounded-[24px] p-4 z-[1001] transition-all shadow-[0_0_20px_0_var(--comment-textarea-box-shadow)]',
          {
            'rounded-t-none': showEmoji || showForm,
          },
        ]" id="edit-container">
          <textarea v-model="paramsForm.comment" ref="textareaRef" name="comment" rows="2" maxlength="800"
            :placeholder="placeholder" @input="changeTextarea($event)"
            class="w-full bg-transparent border-none text-[var(--n-text-color)] resize-none caret-[var(--theme-color)] overflow-hidden placeholder:text-[var(--color1)] focus:outline-none focus:overflow-auto" />
          <div class="mt-3 flex justify-between items-center">
            <div class="flex">
              <button :class="[
                'bg-transparent border-none rounded-full cursor-pointer transition-transform  hover:scale-105 active:scale-95',
                { 'text-[var(--theme-color)]': showEmoji },
              ]" type="button" @click="toggleEmoji">
                <SvgIcon name="emoji" size="24"></SvgIcon>
              </button>
              <button :class="[
                'bg-transparent border-none rounded-full cursor-pointer transition-transform ml-[5px] hover:scale-105 active:scale-95',
                { 'text-[var(--theme-color)]': showForm },
              ]" type="button" @click="toggleForm">
                <SvgIcon name="set" size="24"></SvgIcon>
              </button>
            </div>
            <div class="flex">
              <button :class="[
                'bg-transparent border-none rounded-full transition-transform hover:scale-105 active:scale-95',
                {
                  'opacity-50 select-none cursor-not-allowed': disabledClear,
                  'cursor-pointer': !disabledClear,
                },
              ]" :disabled="disabledClear" type="button" @click="clearHandle">
                <SvgIcon name="delete" size="24"></SvgIcon>
              </button>
              <button :class="[
                'bg-transparent border-none rounded-full transition-transform ml-[5px] hover:scale-105 active:scale-95',
                {
                  'opacity-50 select-none cursor-not-allowed': disabledSend,
                  'cursor-pointer': !disabledSend,
                },
              ]" :disabled="disabledSend" type="button" @click="handleComment">
                <SvgIcon name="send" size="24"></SvgIcon>
              </button>
            </div>
          </div>
        </div>
      </template>
      <div class="h-full overflow-auto" id="drawer-content">
        <div v-if="commentList.length" ref="scrollContainer" class="px-4" @scroll="handleScroll"
          v-auto-animate="{ duration: 300 }">
          <div v-for="(item, index) in commentList" :key="item.comment_id" class="mb-5">
            <!-- 评论项 -->
            <div class="flex">
              <!-- 头像 -->
              <div class="mr-3 flex-shrink-0">
                <RandomAvatar :size="26" :token="item.nick_name" />
              </div>

              <!-- 评论内容 -->
              <div class="flex-1 min-w-0">
                <!-- 用户信息 -->
                <div class="flex items-center">
                  <a :class="[
                    'font-bold text-sm hover:text-[var(--theme-color)] hover:underline mb-2',
                    { 'text-[var(--theme-color)]': localIP == item.user_ip },
                  ]" :href="item.jump_url" target="_blank">
                    {{ item.visitor_info.nick_name || item.nick_name }}
                  </a>
                </div>

                <!-- 时间和地点 -->
                <div class="text-xs text-[var(--color2)] mb-2">
                  <n-time :time="Date.now()" :to="new Date(item.created_at)" type="relative" />
                  · {{ item.visitor_info.province }}
                </div>

                <!-- 评论内容 -->
                <div class="html-container relative">
                  <div class="v-html-content text-sm text-[var(--n-text-color)] whitespace-pre-wrap tracking-wider"
                    :class="{ truncated: !item.isExpanded && item.showExpand }" v-html="useDecodeEmoji(
                      item.decodedContent,
                      limitContentNum,
                      item.isExpanded
                    )
                      "></div>
                  <span v-if="item.showExpand"
                    class="inline-block text-xs text-[var(--color2)] cursor-pointer mt-3 hover:text-[var(--theme-color)] hover:underline"
                    @click="
                      ($event) => {
                        item.isExpanded = !item.isExpanded;
                        toggleReply($event, item.isExpanded);
                      }
                    ">
                    {{ item.isExpanded ? "收起" : "展开" }}
                    <span class="inline-flex items-center">
                      <SvgIcon v-if="!item.isExpanded" name="arrow-down" size="12"></SvgIcon>
                      <SvgIcon v-else name="arrow-up" size="12"></SvgIcon>
                    </span>
                  </span>
                </div>

                <div class="flex">
                  <!-- 回复按钮 -->
                  <div class="mt-2 mr-2">
                    <button
                      class="text-xs text-[var(--color2)] bg-transparent border-none flex items-center cursor-pointer hover:text-[var(--theme-color)]"
                      @click="
                        replyLavel == 1 && replyIndex == index
                          ? clearHandle()
                          : handleReply(item, 1, index)
                        ">
                      <span class="mr-1">
                        {{
                          replyLavel == 1 && replyIndex == index
                            ? "取消回复"
                            : "回复"
                        }}
                      </span>
                      <SvgIcon name="reply" size="12"></SvgIcon>
                    </button>
                  </div>

                  <!-- 展开/收起回复按钮 -->
                  <div v-if="item.replys && item.showOpenReply" class="mt-2">
                    <button
                      class="text-xs text-[var(--color2)] bg-transparent border-none flex items-center cursor-pointer hover:text-[var(--theme-color)]"
                      @click="item.isOpenReply = !item.isOpenReply">
                      <span class="mr-1">
                        {{
                          item.isOpenReply
                            ? "收起" + item.replys.length + "条回复"
                            : "展开" + item.replys.length + "条回复"
                        }}
                      </span>
                      <SvgIcon v-show="!item.isOpenReply" name="arrow-down" size="12"></SvgIcon>
                      <SvgIcon v-show="item.isOpenReply" name="arrow-up" size="12"></SvgIcon>
                    </button>
                  </div>
                </div>

                <!-- 回复列表 -->
                <div v-if="item.isOpenReply" class="mt-3 mb-3" v-auto-animate="{ duration: 300 }">
                  <div v-for="(reply, index) in item.replys" :key="reply.comment_id" class="flex mt-4">
                    <!-- 回复头像 -->
                    <div class="mr-3 flex-shrink-0">
                      <RandomAvatar :size="26" :token="item.nick_name" />
                    </div>

                    <!-- 回复内容 -->
                    <div class="flex-1 min-w-0">
                      <!-- 回复者信息 -->
                      <div class="flex items-center">
                        <div class="flex items-center">
                          <a :class="[
                            'font-bold text-sm hover:text-[var(--theme-color)] hover:underline',
                            {
                              'text-[var(--theme-color)]':
                                localIP == item.user_ip,
                            },
                          ]" :href="reply.jump_url" target="_blank">
                            {{
                              reply.visitor_info.nick_name || reply.nick_name
                            }}
                          </a>
                          <SvgIcon class="mx-1" name="arrow-drop-right-fill" size="10" color="var(--color1)"></SvgIcon>
                          <a :class="[
                            'font-bold text-sm hover:text-[var(--theme-color)] hover:underline',
                            {
                              'text-[var(--theme-color)]':
                                localIP == item.user_ip,
                            },
                          ]" :href="reply.reply_info.user_jump_url" target="_blank">
                            {{ reply.reply_info.nick_name }}
                          </a>
                        </div>
                      </div>

                      <!-- 回复时间和地点 -->
                      <div class="text-xs text-[var(--color2)] mb-2">
                        <n-time :time="Date.now()" :to="new Date(reply.created_at)" type="relative" />
                        · {{ reply.visitor_info.province }}
                      </div>

                      <!-- 回复内容 -->
                      <div class="html-container relative">
                        <div
                          class="v-html-content text-sm text-[var(--n-text-color)] whitespace-pre-wrap tracking-wider"
                          :class="{ truncated: !reply.isExpanded }" v-html="useDecodeEmoji(
                            reply.decodedContent,
                            limitContentNum,
                            reply.isExpanded
                          )
                            "></div>
                        <span v-if="reply.showExpand"
                          class="inline-block text-xs text-[var(--color2)] cursor-pointer mt-3 hover:text-[var(--theme-color)] hover:underline"
                          @click="
                            ($event) => {
                              reply.isExpanded = !reply.isExpanded;
                              toggleReply($event, reply.isExpanded);
                            }
                          ">
                          {{ reply.isExpanded ? "收起" : "展开" }}
                          <span class="inline-flex items-center">
                            <SvgIcon v-if="!reply.isExpanded" name="arrow-down" size="12"></SvgIcon>
                            <SvgIcon v-else name="arrow-up" size="12"></SvgIcon>
                          </span>
                        </span>
                      </div>
                      <!-- 回复按钮 -->
                      <div class="mt-2">
                        <button
                          class="text-xs text-[var(--color2)] bg-transparent border-none flex items-center cursor-pointer hover:text-[var(--theme-color)]"
                          @click="
                            replyLavel == 2 && replyIndex == index
                              ? clearHandle()
                              : handleReply(item, 2, index)
                            ">
                          <span class="mr-1">
                            {{
                              replyLavel == 2 && replyIndex == index
                                ? "取消回复"
                                : "回复"
                            }}
                          </span>
                          <SvgIcon name="reply" size="12"></SvgIcon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="loading" class="text-center my-5 text-[var(--color1)]">
            加载中...
          </div>
          <div v-if="noMore" class="text-center my-5 text-[var(--color1)]">
            没有更多评论
          </div>
        </div>
        <div v-else class="relative h-full min-h-[200px]">
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div class="w-[100px] h-[100px] mx-auto">
              <SvgIcon name="empty" size="100" />
            </div>
            <div class="mt-3 text-[var(--color1)]">快来发表你的评论吧~</div>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { emojiData } from "~/assets/js/emoji";
import { v4 } from "uuid";
import type { FormInst, FormItemRule } from "naive-ui";
import { getIP } from "@/utils/local";


const appConfig = useAppConfig();
const { width, height } = useWindowSize();
const { message } = useDiscreteApi();
const $http = useHttp();

const $emit = defineEmits(["change", "commentCount"]);

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

const placement = ref("right");
const screenWidth = ref(width);
const limitContentNum = ref(100);
const replyLavel = ref(0);
const replyIndex = ref(0);
const parentId = ref("");
const replyIp = ref("");
const prefix = ref("");
const placeholder = ref("想说点什么...");
const scrollContainer = ref<HTMLElement>();
const formRef1 = ref<FormInst | null>(null);
const formRef2 = ref<FormInst | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const localIP = ref('');
const emojiList = ref<any[]>([]);
const commentList = ref<any>([]);
const pageNum = ref(1);
const limitNum = ref(10);
const totalNum = ref(0);
const oneLevelCount = ref(0); // 一级评论数，用于加载更多评论
const loading = ref(false);
const showDrawer = ref(props.show);
const disabledSend = ref(true);
const disabledClear = ref(true);
const isReply = ref(false);
const showEmoji = ref(false);
const showForm = ref(false);
const noMore = computed(() => {
  const curNum = pageNum.value * limitNum.value;
  if (curNum >= oneLevelCount.value) {
    return true; // 已加载的数量等于/大于总数时,显示没有更多评论
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
const formRules = ref({
  user: {
    name: {
      required: true,
      trigger: ["input", "blur"],
      validator(rule: FormItemRule, value: string) {
        const nicknameRegex = /^[\u4e00-\u9fa5\w]{2,12}$/;
        if (!value) {
          return new Error("请输入昵称");
        } else if (!nicknameRegex.test(value)) {
          return new Error(
            "只允许汉字、字母、数字和下划线，长度2-12个字符组成"
          );
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
          return new Error(
            "只允许英文字母、数字、下划线、英文句号、以及中划线组成"
          );
        }
        return true;
      },
    },
    jumpUrl: {
      required: false,
      trigger: ["input", "blur"],
      validator(rule: FormItemRule, value: string) {
        const urlRegex =
          /^(https?:\/\/)(([\da-z.-]+\.([a-z.]{2,6}))|((\d{1,3}\.){3}\d{1,3})|localhost)(:[0-9]{1,5})?([/\w .-]*)*\/?(\?[a-zA-Z0-9=&_.-]*)?(#[\w]*)?$/;
        if (value && !urlRegex.test(value)) {
          return new Error("网址格式不正确，网址协议必填");
        }
        return true;
      },
    },
  },
});

// 收起触发该评论置顶
const toggleReply = ($event: Event, isExpanded: Boolean) => {
  // 展开不执行
  if (isExpanded) return;
  // 获取点击的目标元素
  const tar = $event.target as HTMLElement;
  // 获取评论容器元素
  const commentContainer = document.getElementById("drawer-content");

  if (commentContainer) {
    // 获取当前点击的评论元素
    const commentEl = tar.closest(".flex.mt-4.ml-3") || tar.closest(".mb-5");

    if (commentEl) {
      // 计算评论元素相对于容器的偏移位置
      const offsetTop =
        commentEl.getBoundingClientRect().top -
        commentContainer.getBoundingClientRect().top +
        commentContainer.scrollTop;

      // 收起时滚动到评论顶部
      commentContainer.scroll({
        top: Math.floor(offsetTop),
        // behavior: "smooth",
      });
    }
  }
};

// formRef1表单验证
const handleValidate = () => {
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

// 插入emoji表情
const insertEmoji = ($event: Event) => {
  const tar = $event.target as HTMLElement;
  const htmlCode = tar.dataset.htmlcode;
  const text = tar.innerText;
  const textarea = textareaRef.value as HTMLTextAreaElement;

  // 获取当前光标位置
  const startPos = textarea?.selectionStart ?? 0;
  const endPos = textarea?.selectionEnd ?? 0;

  // 分割文本
  const beforeText = textarea?.value.substring(0, startPos);
  const afterText = textarea?.value.substring(endPos);

  // 插入内容
  paramsForm.value.comment = beforeText + text + afterText;

  // 计算新的光标位置
  const newCursorPos = startPos + text.length;

  // 设置光标位置并聚焦
  nextTick(() => {
    textarea.focus();
    // 设置文本字段中所选内容的开始和结束位置。
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  });
};

const setLocal = async () => {
  await handleValidate();
  localStorage.setItem(
    "COMMENT_USERINFO",
    JSON.stringify(paramsForm.value.user)
  );
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

const changeTextarea = (event: Event) => {
  if (paramsForm.value.comment.length >= 500) {
    message.warning("超长啦~请简短描述！");
  }
};

// 清理按钮逻辑
const clearHandle = () => {
  isReply.value = false;
  disabledClear.value = true;
  disabledSend.value = true;
  showEmoji.value = false;
  showForm.value = false;
  placeholder.value = "想说点什么...";
  prefix.value = "";
  paramsForm.value.comment = "";
  replyIp.value = "";
  parentId.value = "";
  replyIndex.value = 0;
  replyLavel.value = 0;
  formRef2.value?.restoreValidation();
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = "auto";
};

// 回复评论
const handleReply = async (comment: any, level: number, index: number) => {
  await handleValidate();
  isReply.value = true;
  disabledClear.value = false;
  disabledSend.value = true;
  placeholder.value = `回复@${comment.visitor_info.nick_name}`;
  prefix.value = `@${comment.visitor_info.nick_name}`;
  paramsForm.value.comment = "";
  replyIp.value = comment.user_ip;
  replyIndex.value = index;
  replyLavel.value = level;
  if (level == 1) {
    parentId.value = comment.comment_id;
  } else if (level == 2) {
    parentId.value = comment.parent_id;
  }
  textareaRef.value?.focus();
  formRef2.value?.restoreValidation();
};

// 发送评论
const handleComment = async () => {
  await handleValidate();
  const { user, comment } = paramsForm.value;
  const encodeComment = useEncodeEmoji(comment);
  disabledSend.value = true;
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
    content: encodeComment,
    deleted: 0,
    approved: 1,
  };
  try {
    const res = await $http.comment.add(params);
    if (res.code == 200) {
      totalNum.value += 1;
      const processedData = dataMap([res.data]);
      if (replyIp.value && parentId.value) {
        commentList.value.reduce(
          (accValue: any, curValue: any, curIndex: number) => {
            if (curValue.comment_id == parentId.value) {
              // 展开回复列表
              commentList.value[curIndex].isOpenReply = true;
              switch (replyLavel.value) {
                case 1:
                  // 在开头插入数据
                  commentList.value[curIndex].replys.unshift(...processedData);
                  break;
                case 2:
                  // 在索引位置插入新元素（不删除元素）
                  commentList.value[curIndex].replys.splice(
                    replyIndex.value + 1,
                    0,
                    ...processedData
                  );
                  break;
                default:
                  break;
              }
            }
          },
          []
        );
      } else {
        commentList.value.unshift(...processedData);
      }
      message.success("评论成功");
      clearHandle();
    }
  } catch (error) {
    disabledSend.value = false;
    throw error;
  }
};

// 距离底部50px时加载评论数据
/* useThrottleFn 限制函数的执行。特别适用于在调整大小和滚动等事件上限制处理程序的执行速率。 */
const handleScroll = useThrottleFn((e: Event) => {
  const el = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = el;
  // 距离底部50px时加载
  if (scrollHeight - (scrollTop + clientHeight) < 50) {
    handleLoad();
  }
}, 200);

// 加载更多评论
const handleLoad = async () => {
  if (loading.value || noMore.value) return;
  loading.value = true;
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
      if (result.code == 200) {
        commentList.value.push(...dataMap(result.data));
        loading.value = false;
      }
    })
    .catch((err: any) => {
      throw err;
    });
};

// 处理评论数据
const dataMap = (data: Array<any>) => {
  return data.map((item: any) => {
    // 先将emoji解码
    const decodeEmoji = item.content.replace(
      /\\u([\dA-Fa-f]{4,5})/g,
      (match: string, p1: string) => String.fromCodePoint(parseInt(p1, 16))
    );
    // 处理回复内容
    if (item.replys && item.replys.length > 0) {
      item.replys = dataMap(item.replys);
    }
    return {
      ...item,
      isOpenReply: false,
      showOpenReply: item.replys && item.replys.length > 0,
      isExpanded: false,
      showExpand: item.content.length > limitContentNum.value,
      decodedContent: decodeEmoji,
    };
  });
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
      if (result.code == 200) {
        commentList.value.push(...dataMap(result.data));
        totalNum.value = result.oneLevelCount;
        oneLevelCount.value = result.oneLevelCount;
      }
    })
    .catch((err: any) => {
      throw err;
    });
};

// 过滤 Emoji
const filterEmoji = (emojis: any) => {
  const emojiData = [] as any[];
  const categorys = [] as any;
  // const filterEmojis = [
  //   "\u0026#127995;",
  //   "\u0026#127996;",
  //   "\u0026#127997;",
  //   "\u0026#127998;",
  //   "\u0026#127999;",
  // ];
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

// 输入框自动适应高度
const resizeTextarea = () => {
  watchEffect(() => {
    const textarea = textareaRef.value;
    if (!textarea) return;
    const handler = (e: Event) => {
      const tar = e.target as HTMLTextAreaElement;
      tar.style.height = "auto";
      tar.style.maxHeight = "200px";
      tar.style.height = `${tar.scrollHeight}px`;
      tar.style.overflowY = tar.scrollHeight > 200 ? "auto" : "hidden";
    };
    textarea.addEventListener("input", handler);
    // 清理函数：组件卸载时移除监听
    return () => {
      textarea.removeEventListener("input", handler);
    };
  });
};

// 根据断点修改评论区位置
watch(
  () => screenWidth.value,
  (newVal) => {
    if (newVal < appConfig.bp.md) {
      return (placement.value = "bottom");
    } else {
      return (placement.value = "right");
    }
  },
  {
    immediate: true,
  }
);

// 总评论数量
watch(
  () => totalNum.value,
  (newValue) => {
    $emit("commentCount", totalNum.value);
  }
);

// 打开评论区
watch(
  () => props.show,
  (newValue) => {
    showDrawer.value = newValue;
  }
);

// 清理&发送按钮状态
watch(
  () => paramsForm.value.comment,
  (newValue) => {
    if (newValue.trim().length > 0) {
      disabledSend.value = false;
      disabledClear.value = false;
    } else {
      disabledSend.value = true;
      if (isReply.value) {
        disabledClear.value = false;
      } else {
        disabledClear.value = true;
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
  getIP((ip) => {
    localIP.value = ip
  })
  filterEmoji(emojiData);
  nextTick(() => {
    resizeTextarea();
  });
});
</script>

<style lang="scss" scoped></style>
