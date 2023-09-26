<script lang="ts" setup>
import { appName } from "@/constants";

const user = useUserStore();

useHead({
  title: `账号与安全 - 个人中心 - ${appName}`,
  meta: [
    {
      name: "description",
      content: `账号与安全 - 个人中心 - ${appName}`,
    },
  ],
});
// 页面
definePageMeta({
  key: route => route.path,
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout
      name="user"
      :menu="['back']"
      :footer="false"
    >
      <ClientOnly>
        <div
          v-if="user.isLogin"
          class="flex flex-col layout-default"
        >
          <div
            class="title animate__animated animate__fadeInDown"
            mt-3
          >
            <h2 tracking-1>
              账户与安全
            </h2>
          </div>
          <div class="flex flex-col-reverse grid-gap-6 md:grid md:grid-cols-2">
            <!-- 登录设备 -->
            <UserSafeDeviceList mt-4 />
            <!-- 修改信息 -->
            <UserSafeUpdateCards mt-4 />
          </div>
        </div>
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss"></style>
