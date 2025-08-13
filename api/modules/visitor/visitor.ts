import { fetch } from "~/utils/http";

export default {
  // 访客登录
  auth: (params: any) => {
    return fetch(`/api/visitor/auth`, {
      method: "POST",
      body: params,
    });
  },

  // 发送验证码
  getCaptcha: (params: { user_email: string }) => {
    return fetch(`/api/visitor/send-code`, {
      method: "POST",
      body: params,
    });
  },

  // 获取访客信息
  getByEmail: (email: string) => {
    return fetch(`/api/visitor/email/${email}`, {
      method: "GET",
    });
  },

  // 更新访客信息
  update: (id: number, params: any) => {
    return fetch(`/api/visitor/${id}`, {
      method: "PATCH",
      body: params,
    });
  }
};