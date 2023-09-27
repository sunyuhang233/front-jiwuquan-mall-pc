<script setup lang="ts">
import { appName } from "@/constants/index";

// 1、确认是否登录
const user = useUserStore();
const shop = useShopStore();
useAddressStore();
const isLogin = computed(() => user.isLogin);
// 退出登录时候
watch(
  isLogin,
  async (val) => {
    if (val && user.getToken !== "") {
      // 获取用户信息
      user.onCheckLogin();
      // 获取用户购物车
      shop.reLoadShopcartList();
    }
  },
  {
    immediate: true,
  },
);

// 加载
const isPageLoading = ref<boolean>(true);
onMounted(() => {
  if (document && document.body)
    document.body.style.overflow = "hidden";
});
// 不能有根节点
// https://nuxt.com.cn/docs/guide/directory-structure/app

// 准备完成关闭加载
onNuxtReady(async () => {
  isPageLoading.value = false;
});

useHead({
  title: `${appName} - 开启你的极物之旅 ✨`,
  meta: [
    {
      name: "description",
      content: "极物圈-主页 开启你的极物之旅！",
    },
  ],
});
</script>

<template>
  <NuxtLayout name="default">
    <Transition name="fade">
      <OtherLoading v-show="isPageLoading" v-window-lock="isPageLoading" />
    </Transition>
    <NuxtPage />
    <FormUserDialog />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(16px) contrast(4);
}
.dark .page-enter-from,
.dark .page-leave-to {
    filter: blur(10px) contrast(0);
}


.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(16px) contrast(4);
}
.dark .layout-enter-from,
.dark .layout-leave-to {
  filter: blur(10px) contrast(0);
}
</style>
