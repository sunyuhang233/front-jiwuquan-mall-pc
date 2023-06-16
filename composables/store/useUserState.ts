import { acceptHMRUpdate, defineStore } from 'pinia'
import { getUserInfo, type UserInfo, type UserWallet } from '../api/user/info';
import { toLogout } from "../api/user"
// https://pinia.web3doc.top/ssr/nuxt.html#%E5%AE%89%E8%A3%85
export const useUserStore = defineStore('user', () => {
  // token
  const token = ref<string>("");
  // 是否登录
  const isLogin = ref<boolean>(false);
  // 是否打开登录
  const showLoginForm = ref<boolean>(false);
  const showRegisterForm = ref<boolean>(false);
  // 钱包信息
  const userWallet = reactive<UserWallet>({})
  // 用户个人信息
  const userInfo = reactive<UserInfo>({
    id: "",
    username: "",
    email: "",
    phone: "",
    nickname: "",
    gender: Gender.BOY,
    avatar: "",
    birthday: "",
    createTime: "",
    updateTime: "",
    lastLoginTime: "",
    status: UserStatus.FALESE,
    isEmailVerified: 0,
    isPhoneVerified: 0,
  })

  /**
   * 用户登录
   * @param token token
   */
  const onUserLogin = async (token: string, saveLocal?: boolean) => {
    await useAsyncData(async () => {
      const store = useUserStore()
      let res = await getUserInfo(token)
      if (res.code === StatusCode.SUCCESS) {
        store.$patch({
          userInfo: {
            ...res.data
          }
        })
      }else {
        onUserExit(token)
      }
      // 钱包
      // const wallet = await getuseWa(token)
    })
  }

  /**
   * 退出登录
   * @param t token
   */
  async function onUserExit(t: string) {
    const { data } = await toLogout(t)
    if (data.code === StatusCode.SUCCESS) {
      isLogin.value = false
    }
  }

  // 登陆状态动态
  watch(isLogin, (val: boolean) => {
    if (val) {
      onUserLogin(token.value)
    } else {
      onUserExit(token.value)
      useUserStore.caller()
    }
  })


  return {
    // state
    token,
    isLogin,
    showLoginForm,
    showRegisterForm,
    userInfo,
    userWallet,
    // actions
    onUserLogin,
    onUserExit
  }
}, {
  // https://juejin.cn/post/7216182763250581564 持久化
  persist: process.client && {
    storage: localStorage,
    paths: ['times']
  }
})


if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
