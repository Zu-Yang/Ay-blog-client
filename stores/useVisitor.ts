import { defineStore } from "pinia";
const $http = useHttp();

export interface VisitorInfo {
  province: string
  city: string
  nick_name: string
  user_email: string
  user_jump_url?: string
  timestamp?: number
  isNewUser: boolean
}

export const useVisitor = defineStore("visitor", () => {
  const showVisitorForm = ref(false)
  const formStatus = ref('edit') // edit | preview
  const visitorInfo = ref<VisitorInfo | null>(null)

  /** 检查访客信息是否存在且有效  */
  const checkVisitorInfo = (): VisitorInfo | null => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('VISITOR_INFO')
      if (stored) {
        const info = JSON.parse(stored)
        const now = Date.now()
        const oneWeek = 7 * 24 * 60 * 60 * 1000

        // 检查信息是否完整且未过期
        if (info.user_email && info.nick_name && info.province && info.city && (now - (info.timestamp || 0) < oneWeek)) {
          visitorInfo.value = info
          return info
        }
      }
    }
    return null
  }

  /** 保存访客信息 */
  const saveVisitorInfo = (info: VisitorInfo) => {
    if (process.client) {
      const dataToSave = {
        ...info,
        timestamp: Date.now()
      }
      localStorage.setItem('VISITOR_INFO', JSON.stringify(dataToSave))
      visitorInfo.value = dataToSave
    }
  }

  /** 获取访客信息 */
  const getVisitorInfo = (): VisitorInfo | null => {
    if (!visitorInfo.value) {
      return checkVisitorInfo()
    }
    return visitorInfo.value
  }

  /** 清除访客信息 */
  const clearVisitorInfo = () => {
    if (process.client) {
      localStorage.removeItem('VISITOR_INFO')
      visitorInfo.value = null
    }
  }
  return {
    formStatus,
    visitorInfo,
    showVisitorForm,
    checkVisitorInfo,
    saveVisitorInfo,
    getVisitorInfo,
    clearVisitorInfo,
  };
});
