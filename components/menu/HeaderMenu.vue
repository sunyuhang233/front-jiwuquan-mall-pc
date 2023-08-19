<template>
  <!-- 顶部header -->
  <header
    class="nav select-none"
    flex-row-bt-c
    px-2
    md:px-6
    text-m
    dark:text="light"
  >
    <!-- 左侧 -->
    <div
      class="left group"
      flex-row-c-c
    >
      <NuxtLink
        mx-2
        to="/"
        flex-row-c-c
      >
        <img
          w-42px
          object-contain
          group-hover:opacity-85
          transition-300
          group-hover:filter-blur-2px
          alt="Design By Kiwi23333"
          src="@/assets/images/logo/logo.png"
          dark:hidden
        />
        <img
          w-42px
          object-contain
          group-hover:opacity-85
          transition-300
          group-hover:filter-blur-2px
          src="@/assets/images/logo/logo_dark.png"
          hidden
          dark:block
        />
        <span
          transition-300
          group-hover:block
          hidden
          w-32px
          h-32px
          i-solar:home-2-bold
          absolute
          left-9
          style="color: var(--el-text-color-primary)"
        ></span>
      </NuxtLink>
      <span class="tracking-2 mx-4 font-700 text-xl hidden md:inline">极物圈</span>
      <a
        class="group"
        target="_blank"
        href="https://github.com/KiWi233333"
      >
        <img
          dark:filter-invert-100
          ml-4
          w-5rem
          opacity-0
          transition-300
          group-hover:opacity-100
          src="@/assets/images/logo/kiwi_strong.svg"
        />
      </a>
    </div>
    <!-- 搜索框 -->
    <transition name="fadeInOut">
      <div
        class="fixed left-0 top-0 w-full h-[100vh] z-1 bg-[rgba(0,0,0,0.8)] dark:bg-[rgba(10,10,10,0.9)] animate-[fade-in_0.2s_ease-out]"
        v-show="isShowSearch"
        @click="isShowSearch = false"
      ></div>
    </transition>
    <div
      class="z-2 absolute-center transition-300 translate-y-0 transition-ease-in-out"
      :class="{ 'translate-y-20vh scale-120': isShowSearch }"
    >
      <InputSearch
        v-model="searchWord"
        :onSerch="onSerch"
        @open="isShowSearch = true"
        @close="isShowSearch = false"
      />
      <h2
        class="transition-300 text-center absolute-center -translate-y-4em font-500 text-light"
        :class="{ '-translate-y-3em': isShowSearch }"
      >
        搜 索
      </h2>
    </div>
    <!-- 右侧 -->
    <ClientOnly>
      <div
        class="right"
        flex-row-c-c
      >
        <!-- 消息 -->
        <BtnBell
          v-if="store.isLogin"
          class="hidden md:block mx-2"
        />
        <!-- 购物车 -->
        <NuxtLink
          to="/user/shopcart"
          v-if="store.isLogin"
          class="hover:animate-[shopcart_1s_ease-in] hidden md:block"
        >
          <i
            class="p-3 mx-2 px-0.7em transition-100 hover:bg-[var(--el-color-danger)] hover:i-solar:cart-large-2-bold"
            i-solar:cart-large-2-linear
          />
        </NuxtLink>
        <!-- 切换主题 -->
        <BtnSwitch />
        <!-- 登陆注册 -->
        <div
          class="flex flex-col group"
          v-if="!store.isLogin"
        >
          <el-popover
            placement="bottom"
            teleported
            :width="100"
            :offset="20"
            trigger="click"
          >
            <template #reference>
              <el-button
                round
                style="margin: 0; padding: 0.5em"
              >
                <i
                  class="inline-block sm:hidden rounded-4em p-2 shadow-md cursor-pointer bg-dark-1 dark:bg-light opacity-80"
                  i-solar:user-outline
                />
              </el-button>
            </template>
            <div
              flex
              flex-col
            >
              <ElButton
                round
                class="m-2 shadow-md px-2 cursor-pointer"
                type="primary"
                @click="onLogin(FormType.LOGIN)"
              >
                登 录
              </ElButton>
              <ElButton
                round
                px-2
                m-2
                cursor-pointer
                style="margin-left: 0"
                @click="onLogin(FormType.REGISTER)"
              >
                注 册
              </ElButton>
            </div>
          </el-popover>
          <div
            hidden
            flex-col
            md:block
            md:flex-row
            items-center
            class="bg-[#d8d8d854] dark:bg-[#4d4d4d48] backdrop-blur-12px rounded-10px z-1 p-2 md:p-0 md:bg-transparent md:static"
          >
            <ElButton
              round
              class="m-2 shadow-md px-2 cursor-pointer"
              type="primary"
              @click="onLogin(FormType.LOGIN)"
            >
              登 录
            </ElButton>
            <ElButton
              round
              px-2
              m-2
              cursor-pointer
              style="margin-left: 0"
              @click="onLogin(FormType.REGISTER)"
            >
              注 册
            </ElButton>
          </div>
        </div>
        <div
          class="box"
          v-else
        >
          <CardUserLine :user-info="store.userInfo" />
        </div>
      </div>
    </ClientOnly>
  </header>
</template>

<script lang="ts" setup>
// 搜索
let isShowSearch = ref<boolean>(false);
let searchWord = ref<string>("");
// 登录表单
const store = useUserStore();
enum FormType {
  LOGIN,
  REGISTER,
}
// 表单
const onLogin = (type: FormType) => {
  if (type === FormType.LOGIN) {
    // 登录
    store.showLoginForm = true;
    store.showRegisterForm = false;
  } else {
    // 注册
    store.showLoginForm = false;
    store.showRegisterForm = true;
  }
};
const onSerch = (val: string) => {};
// 搜索
</script>
<style lang="scss" scoped>
.nav {
  box-shadow: rgba(9, 30, 66, 0.1) 0px 4px 2px -2px;
  position: sticky;
  top: 0;
  z-index: 999;
  height: $top-nav-height;
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(6px);
  background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
}

.dark .nav {
  background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
  background-size: 4px 4px;
  box-shadow: rgba(92, 97, 124, 0.02) 12px 12px 60px;
}

.login:hover {
  transition: $transition-delay;
  border-color: var(--el-color-primary);
  opacity: 0.8;
}
</style>
