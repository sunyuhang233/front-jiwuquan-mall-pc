<script setup lang="ts">
import { appName } from "@/constants/index";
useHead({
  title: appName,
});
// 1、确认是否登录
const user = useUserStore();
const shop = useShopStore();
const isLogin = computed(() => user.isLogin);
// 退出登录时候
watch(
  isLogin,
  async (val) => {
    if (val && user.getToken != "") {
      // 获取用户信息
      await user.onCheckLogin();
      // 获取用户购物车
      await shop.reLoadShopcartList();
    }
  },
  {
    immediate: true,
  }
);
// 加载
const isLoading = ref<boolean>(true);
useNuxtApp().hook("app:mounted", (app) => {
  if (document && document.body) {
    document.body.style.overflow = "hidden";
  }
});
// 准备完成关闭加载
onNuxtReady(async () => {
  isLoading.value = false;
  if (document && document.body) {
    document.body.style.overflow = "auto";
  }
});
// 不能有根节点
// https://nuxt.com.cn/docs/guide/directory-structure/app
</script>
<template>
  <FormUserDialog />
  <NuxtPage />
  <Transition name="fade">
    <OtherLoading v-show="isLoading" />
  </Transition>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem) grayscale(1);
}

.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.2s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem) grayscale(1);
}
</style>
