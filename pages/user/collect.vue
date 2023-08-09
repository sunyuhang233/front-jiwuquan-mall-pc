<script lang="ts" setup>
useHead({
  title: "信息 - 我的收藏",
  meta: [
    {
      name: "description",
      content: "极物圈-个人中心",
    },
  ],
});
// 页面
definePageMeta({
  pageTransition: false,
  layoutTransition: false,
});
const user = useUserStore();
</script>
<template>
  <div>
    <NuxtLayout
      name="user"
      :menu="['back']"
    >
      <div class="layout-default mx-a">
        <div
          class="flex-row-bt-c animate__animated animate__fadeInDown"
          my-3
        >
          <h2 class="md:px-2em flex items-center animate-fade-in-down">
            我的收藏
            <ElDivider direction="vertical" />
            <i class="p-0.5em bg-yellow-5 i-solar:star-bold-duotone" />
          </h2>
          <div v-show="user.isLogin"></div>
        </div>
        <ClientOnly>
          <div class="address-list animate-[fade-in-up_.3s_ease]"></div>
        </ClientOnly>
      </div>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss"></style>
