import { acceptHMRUpdate, defineStore } from "pinia";
import { getUserInfo, type UserInfo, type UserWallet } from "../api/user/info";
import { toLogout } from "../api/user";
import { getUserWallet } from "../api/user/wallet";
// https://pinia.web3doc.top/ssr/nuxt.html#%E5%AE%89%E8%A3%85
export const useUserStore = defineStore(
  "user",
  () => {
    // token
    const token = ref<string>("");
    // 是否登录
    const isLogin = ref<boolean>(false);
    // 是否打开登录
    const showLoginForm = ref<boolean>(false);
    const showRegisterForm = ref<boolean>(false);
    const showUpdatePwd = ref<boolean>(false);
    // 钱包信息
    const userWallet = reactive<UserWallet>({
      userId: "",
      balance: 0,
      recharge: 0,
      spend: 0,
      points: 0,
      updateTime: "",
      createTime: "",
    });
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
    });

    const getToken = computed({
      get() {
        if (!isLogin || !token.value) {
          showLoginForm.value = true;
          showLoginForm.value;
          return "";
        }
        return token.value;
      },
      set(value) {
        token.value = value;
      },
    });

    watch(token, (val) => {
      if (val !== "") {
        onUserLogin(val);
      }
    });

    /**
     * 用户登录
     * @param token token
     */
    const onUserLogin = async (token: string, saveLocal?: boolean) => {
      await useAsyncData(async () => {
        // 用户信息
        const store = useUserStore();
        let res = await getUserInfo(token);
        if (res.code === StatusCode.SUCCESS) {
          store.$patch({
            userInfo: {
              ...res.data,
            },
          });
        } else {
          onUserExit(token);
        }
        // 钱包
        const wallet = await getUserWallet(token);
        if (wallet.code === StatusCode.SUCCESS) {
          store.$patch({
            userWallet: {
              ...wallet.data,
            },
          });
        }
      });
    };

    /**
     * 用户确认状态
     * @param token token
     */
    const onCheckLogin = () => {
      if (token.value) {
        onUserLogin(token.value);
      }
    };

    const shop = useShopStore();
    const address = useAddresStore();
    const order = useOrderStore();
    /**
     * 退出登录
     * @param t token
     */
    async function onUserExit(t: string) {
      const data = await toLogout(t);
      clearUserStore();
      useNuxtApp().hook("app:mounted", () => {
        shop?.$reset();
        address?.$reset();
        order?.$reset();
      });
    }

    function clearUserStore() {
      // localStorage.removeItem("user");
      // sessionStorage.removeItem("user");
      useUserStore().$patch({
        token: "",
        isLogin: false,
        userWallet: {
          userId: "",
          balance: 0,
          recharge: 0,
          spend: 0,
          points: 0,
          updateTime: "",
          createTime: "",
        },
        userInfo: {
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
        },
      });
    }
    return {
      // state
      token,
      isLogin,
      showUpdatePwd,
      showLoginForm,
      showRegisterForm,
      userInfo,
      userWallet,
      // actions
      onUserLogin,
      onCheckLogin,
      onUserExit,
      clearUserStore,
      // getter
      getToken,
    };
  },
  {
    // https://juejin.cn/post/7216182763250581564  持久化
    // https://juejin.cn/post/7216174863445737528
    persist: true,
  }
);
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
