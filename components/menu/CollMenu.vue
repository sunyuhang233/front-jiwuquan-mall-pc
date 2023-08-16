<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_userisFold", true);
// 路由
const route = useRoute();

const menuList = ref<
  {
    name: string;
    path: string;
    icon: string;
  }[]
>([
  {
    name: "首页",
    path: "/",
    icon: "home",
  },
]);
</script>
<template>
  <div
    class="menu md:shadow-none md:translate-x-0px fixed md:sticky md:block z-998 bg-light dark:bg-[#121212] bg-opacity-80 backdrop-blur-30 h-1/1"
  >
    <ClientOnly>
      <!-- 菜单 -->
      <el-menu
        :router="true"
        :default-active="route.path"
        :collapse="isFold"
      >
        <!-- 顶部 -->
        <div class="w-full flex-row-c-c flex-wrap transition-300 px-5 hover:bg-transparent">
          <div class="home mt-6 transition-300">
            <NuxtLink
              to="/"
              flex-row-c-c
              class="group"
            >
              <i class="i-solar:home-2-broken"></i>
            </NuxtLink>
          </div>
          <div class="ml-a mt-6 ml-a float-left">
            <BtnBell />
          </div>
          <span
            @click="isFold = !isFold"
            class="mt-6 p-1 transition-300"
          >
            <i class="i-solar:hamburger-menu-line-duotone"></i>
          </span>
        </div>
        <div class="border-0 border-default border-b-1px w-5/6 mx-a my-4"></div>
        <!-- 个人信息 -->
        <el-menu-item index="/user/info">
          <i
            class="i-solar:user-broken"
            v-show="route.path !== '/user/info'"
          ></i>
          <i
            class="i-solar:user-bold-duotone"
            v-show="route.path === '/user/info'"
          ></i>
          <span class="min-w-10em title ml-3">个人信息</span>
        </el-menu-item>
        <!-- 购物车 -->
        <el-menu-item index="/user/shopcart">
          <i
            class="i-solar:cart-large-2-linear"
            v-show="route.path !== '/user/shopcart'"
          ></i>
          <i
            class="i-solar:cart-large-2-bold"
            v-show="route.path === '/user/shopcart'"
          ></i>
          <span class="min-w-10em title ml-3">购物车</span>
        </el-menu-item>
        <!-- 钱包 -->
        <el-menu-item index="/user/wallet">
          <i
            class="i-solar:wallet-broken"
            v-show="route.path !== '/user/wallet'"
          ></i>
          <i
            class="i-solar:wallet-bold-duotone"
            v-show="route.path === '/user/wallet'"
          ></i>
          <span class="title ml-3">钱包账单</span>
        </el-menu-item>
        <!-- 收货地址 -->
        <el-menu-item index="/user/address">
          <i
            class="i-solar:compass-broken"
            v-show="route.path !== '/user/address'"
          ></i>
          <i
            class="i-solar:compass-bold-duotone"
            v-show="route.path === '/user/address'"
          ></i>
          <span class="title ml-3">收货地址</span>
        </el-menu-item>
        <!-- 账号与安全 -->
        <el-menu-item
          index="/user/safe"
          class="group"
        >
          <i
            class="i-solar:danger-broken"
            v-show="route.path !== '/user/safe'"
          ></i>
          <i
            class="i-solar:danger-bold-duotone"
            v-show="route.path === '/user/safe'"
          ></i>
          <span class="title ml-3">账号与安全</span>
        </el-menu-item>
        <!-- 回到首页 -->
        <el-menu-item
          class="overflow-x-hidden truncate"
          index="/"
        >
          <i i-solar:square-alt-arrow-left-broken></i>
          <span class="title ml-3">回到首页</span>
        </el-menu-item>
      </el-menu>
    </ClientOnly>
    <div
      class="bg"
      @click="$emit('close')"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  user-select: none;
  top: $top-nav-height;
  height: calc(100vh - $top-nav-height);

  :deep(.el-menu) {
    height: 100%;

    .el-menu-item {
      padding: 0.8em;
      padding-top: 0px;
      padding-bottom: 0px;
      overflow: hidden;
      text-overflow: clip;
      height: 3em;
      border-radius: 8px;
      margin: 10px;
      transition: $transition-delay;
      border: 1px dashed transparent;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        transition: 100ms;
      }

      &:hover,
      &.is-active:hover,
      &.is-active {
        border: 1px solid;
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);

        i {
          color: var(--el-color-primary);
        }
      }

      &:hover {
        border: 1px dashed;
      }
    }

    .el-menu-item-group {
      .el-menu-item {
        background-color: #8181811a;
        opacity: 0.9;

        &:hover {
          background-color: #8181811a;
          opacity: 1;
        }

        .second-icon {
          padding: 2px;
        }
      }

      .el-menu-item:hover {
        background-color: transparent;
        color: var(--el-color-primary);
      }

      .el-menu-item-group__title ml-2 {
        display: none;
      }
    }

    // 图标
    i {
      padding: 0.6rem;

      &:hover {
        transition: $transition-delay;
        color: var(--el-color-primary);
      }
    }

    .title {
      margin-left: 0.8em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@media screen and (max-width: 768px) {
  .menu-bg .bg {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 150vw;
    overflow: hidden;
    height: 100vh;
    background-color: rgba(51, 51, 51, 0.3);
    z-index: -1;
    transition: $transition-delay;
  }
}
</style>
