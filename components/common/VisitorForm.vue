<template>
  <n-modal style="width: 500px; border-radius: 16px;" title="欢迎访问" v-model:show="showModal" :mask-closable="false"
    :close-on-esc="true" @after-leave="" preset="card">
    <n-card :bordered="false">
      <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80px">
        <n-form-item label="昵称" path="nick_name">
          <n-input v-model:value="formData.nick_name" placeholder="请输入您的昵称" maxlength="12"
            :disabled="formStatus === 'preview'" />
        </n-form-item>

        <n-form-item label="邮箱" path="user_email">
          <n-input v-model:value="formData.user_email" placeholder="请输入您的邮箱地址" :disabled="formStatus === 'preview'" />
        </n-form-item>

        <n-form-item label="验证码" path="code" v-if="formStatus === 'edit' || formStatus === ''">
          <n-input v-model:value="formData.code" placeholder="验证码" :maxlength="6" />
          <n-button style="margin-left: 12px; opacity: 0.5;" text :disabled="disabledCode" @click="getEmailCode">
            {{ countDown_60s === 60 ? '点击获取' : countDown_60s + '秒' }}
          </n-button>
        </n-form-item>

        <n-form-item label="个人主页" path="user_jump_url">
          <n-input v-model:value="formData.user_jump_url" placeholder="您的个人主页（可选）"
            :disabled="formStatus === 'preview'" />
        </n-form-item>
      </n-form>

      <div style="width: 100%; display: flex; justify-content: center;">

        <n-button class="w-[30%] mb-4" @click="handleEdit" round type="primary" :loading="loading"
          v-if="formStatus === 'edit'">
          保存修改
        </n-button>
        <n-button v-if="formStatus === ''" class="w-[30%] mb-4" @click="handleSubmit" round type="primary"
          :loading="loading">
          登录
        </n-button>
      </div>
      <div style="width: 100%; display: flex; justify-content: flex-end;" v-if="formStatus === 'preview'">
        <n-button @click="changeEdit" round text type="info">
          编辑资料
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { FormInst, FormItemRule } from "naive-ui";

const { showVisitorForm } = toRefs(useVisitor());
const $http = useHttp()
const { message, notification } = useDiscreteApi();
const storeVisitor = useVisitor();
const { visitorInfo, formStatus } = toRefs(storeVisitor);

const showModal = ref(showVisitorForm)
const loading = ref(false)
const formRef = ref()
const disabledCode = ref(false)
const countDown_60s = ref(60)
// 表单数据
const formData = reactive({
  nick_name: '洋洋',
  user_email: '1656053797@qq.com',
  code: '',
  user_jump_url: 'http://localhost:8080'
})
// 表单验证规则
const rules = {
  nick_name: [{
    required: true,
    trigger: 'blur',
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
  }],
  user_email: [{
    key: 'user_email',
    required: true,
    trigger: 'blur',
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
  }],
  code: [{
    required: true,
    trigger: 'blur',
    validator(rule: FormItemRule, value: string) {
      const codeRegex = /^\d{6}$/;
      if (!value) {
        return new Error("请输入验证码");
      } else if (!codeRegex.test(value)) {
        return new Error("验证码必须是6位数字");
      }
      return true;
    },
  }],
  user_jump_url: [{
    trigger: 'blur',
    validator(rule: FormItemRule, value: string) {
      const urlRegex =
        /^(https?:\/\/)(([\da-z.-]+\.([a-z.]{2,6}))|((\d{1,3}\.){3}\d{1,3})|localhost)(:[0-9]{1,5})?([/\w .-]*)*\/?(\?[a-zA-Z0-9=&_.-]*)?(#[\w]*)?$/;
      if (value && !urlRegex.test(value)) {
        return new Error("网址格式不正确，网址协议必填");
      }
      return true;
    },
  }]
}

watch(() => showVisitorForm.value, (newVal) => {
  showModal.value = newVal
})

/**
 * 获取验证码 
*/
const getEmailCode = async () => {
  try {
    if (disabledCode.value === true) return
    await formRef.value?.validate(
      (errors: any) => {
        if (errors) {
          message.error('请先输入您的邮箱')
          throw new Error('邮箱校验失败')
        }
      },
      (rule: any) => {
        return rule?.key === 'user_email'
      }
    )

    disabledCode.value = true
    const res = await $http.visitor.getCaptcha({ user_email: formData.user_email }) // 发送验证码到用户的邮箱
    if (res.statusCode === 429) {
      disabledCode.value = false
      message.warning("验证码发送过于频繁，倒计时后再试")
    } else {
      message.success("验证码已发送")
      // 在开发环境下，可以返回验证码用于测试
      if (process.env.NODE_ENV === 'development') {
        if (res.code) {
          formData.code = res.code
        }
      }
      let timer = setInterval(() => {
        countDown_60s.value--
        if (countDown_60s.value === 0) {
          countDown_60s.value = 60
          disabledCode.value = false
          clearInterval(timer)
        }
      }, 1000);
    }
  } catch {
    message.error('验证码获取失败')
  }
}


/** 
 * 切换修改
 */
const changeEdit = () => {
  formStatus.value = 'edit'
}

/** 
 * 修改信息
 */
const handleEdit = () => {
  console.log("handleEdit");
}

/** 
 * 登录
 */
const handleSubmit = async () => {
  try {

    await formRef.value?.validate((errors: any) => {
      if (errors) {
        message.error('表单校验失败')
        return
      }
    },)

    loading.value = true

    // 准备提交到后端的数据
    const params = { ...formData }

    // 提交到后端visitor表
    const res = await $http.visitor.auth(params)

    if (res.code === 200) {
      const { isNewUser, nick_name, user_email, user_jump_url, province, city } = res.data
      notification.success({
        content: '【A‘yang】博客',
        meta: `欢迎来自${city}的${isNewUser ? '新' : '老'}朋友！`,
        duration: 5000,
        keepAliveOnHover: true // 当鼠标移入时是否保持通知框显示
      })
      storeVisitor.saveVisitorInfo({ isNewUser, nick_name, user_email, user_jump_url, province, city })
      showModal.value = false
      formStatus.value = 'preview'
      Object.assign(formData, { code: '' })
    }
  } catch (error: any) {
    console.error('表单提交失败:', error)
  } finally {
    loading.value = false
  }
}

// 暴露方法给父组件
defineExpose({})

// 组件挂载时检查访客信息
onMounted(() => {
  const info = storeVisitor.getVisitorInfo()

  if (info) {
    const { nick_name, user_email, user_jump_url } = info
    Object.assign(formData, { nick_name, user_email, user_jump_url })
    formStatus.value = 'preview'
  } else {
    formStatus.value = 'edit'
  }
})
</script>

<style lang="scss"></style>