<script lang="ts" setup>
// 搜索
const isShowSearch = ref<boolean>(false);
const searchWord = ref<string>("");
// 登录表单
const store = useUserStore();
enum FormType {
  LOGIN,
  REGISTER,
}
// 表单
function onLogin(type: FormType) {
  if (type === FormType.LOGIN) {
    // 登录
    store.showLoginForm = true;
    store.showRegisterForm = false;
  }
  else {
    // 注册
    store.showLoginForm = false;
    store.showRegisterForm = true;
  }
}
function onSerch(val: string) {
}
// 搜索
</script>

<template>
  <!-- 顶部header -->
  <header
    class="nav select-none"
    text-m flex-row-bt-c px-2 md:px-6
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
        class="relative"
      >
        <img
          alt="Design By Kiwi23333"
          src="@/assets/images/logo/logo.png"
          w-2.4rem object-contain transition-300 dark:hidden group-hover:opacity-85 group-hover:filter-blur-2px
        >
        <img
          alt="Design By Kiwi23333"
          src="@/assets/images/logo/logo_dark.png"
          hidden w-2.4rem object-contain transition-300 dark:block group-hover:opacity-85 group-hover:filter-blur-2px
        >
        <span
          i-solar:home-2-bold absolute left-1 hidden h-1.6rem w-1.6rem transition-300 group-hover:block
          style="color: var(--el-text-color-primary)"
        />
      </NuxtLink>
      <span class="mx-4 hidden text-xl font-700 tracking-2 md:inline">极物圈</span>
      <a
        class="group"
        target="_blank"
        href="https://github.com/KiWi233333"
      >
        <img
          ml-4 w-5rem opacity-0 transition-300 group-hover:opacity-100 dark:filter-invert-100
          src="@/assets/images/logo/kiwi_strong.svg"
        >
      </a>
    </div>
    <!-- 搜索框 -->
    <transition name="fadeInOut">
      <div
        v-show="isShowSearch"
        class="fixed left-0 top-0 z-2 h-[100vh] w-full animate-[fade-in_0.2s_ease-out] bg-[rgba(0,0,0,0.8)] dark:bg-[rgba(10,10,10,0.9)]"
        @click="isShowSearch = false"
      />
    </transition>
    <div
      class="z-2 translate-y-0 transition-300 transition-ease-in-out absolute-center"
      :class="{ 'translate-y-20vh scale-120': isShowSearch }"
    >
      <InputSearch
        v-model="searchWord"
        :on-serch="onSerch"
        @open="isShowSearch = true"
        @close="isShowSearch = false"
      />
      <h2
        class="text-center font-500 text-light transition-300 absolute-center -translate-y-4em"
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
          class="mx-2 hidden md:block"
        />
        <!-- 购物车 -->
        <NuxtLink
          v-if="store.isLogin"
          to="/user/shopcart"
          class="hidden md:block hover:animate-[shopcart_1s_ease-in]"
        >
          <i
            class="mx-2 p-3 px-0.7em transition-100 hover:i-solar:cart-large-2-bold hover:bg-[var(--el-color-danger)]"
            i-solar:cart-large-2-linear
          />
        </NuxtLink>
        <!-- 切换主题 -->
        <BtnSwitch />
        <!-- 登陆注册 -->
        <div
          v-if="!store.isLogin"
          class="group z-0 flex flex-col"
        >
          <!-- 移动端 -->
          <div class="block md:hidden">
            <el-popover
              placement="bottom"
              class="inline-block sm:hidden"
              teleported
              :width="100"
              :offset="20"
              trigger="click"
            >
              <template #reference>
                <el-button
                  class="sm:hidden"
                  round
                  style="margin: 0; padding: 0.5em"
                >
                  <i
                    class="cursor-pointer rounded-4em bg-dark-1 p-2 opacity-80 shadow-md dark:bg-light"
                    i-solar:user-outline
                  />
                </el-button>
              </template>
              <div
                inline-block flex flex-col sm:hidden
              >
                <ElButton
                  round
                  class="m-2 cursor-pointer px-2 shadow-md"
                  type="primary"
                  @click="onLogin(FormType.LOGIN)"
                >
                  登 录
                </ElButton>
                <ElButton
                  round m-2 cursor-pointer px-2
                  style="margin-left: 0"
                  @click="onLogin(FormType.REGISTER)"
                >
                  注 册
                </ElButton>
              </div>
            </el-popover>
          </div>
          <!-- pc -->
          <div
            hidden flex-col items-center md:block md:flex-row
            class="z-1 rounded-10px bg-[#d8d8d854] p-2 backdrop-blur-12px md:static dark:bg-[#4d4d4d48] md:bg-transparent md:p-0 dark:md:bg-transparent"
          >
            <ElButton
              round
              class="m-2 cursor-pointer px-2 shadow-md"
              type="primary"
              @click="onLogin(FormType.LOGIN)"
            >
              登 录
            </ElButton>
            <ElButton
              round m-2 cursor-pointer px-2
              style="margin-left: 0"
              @click="onLogin(FormType.REGISTER)"
            >
              注 册
            </ElButton>
          </div>
        </div>
        <div
          v-else
          class="box"
        >
          <CardUserLine :user-info="store.userInfo" />
        </div>
      </div>
    </ClientOnly>
  </header>
</template>

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
