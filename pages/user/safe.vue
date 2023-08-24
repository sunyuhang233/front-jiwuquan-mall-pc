<script lang="ts" setup>
const user = useUserStore();
useHead({
  title: "账户与安全 - 个人中心",
  meta: [
    {
      name: "description",
      content: "极物圈-账户与安全",
    },
  ],
});
// 页面
definePageMeta({ layout: false });
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
          class="layout-default flex flex-col"
        >
          <div
            class="title animate__animated animate__fadeInDown"
            mt-3
          >
            <h2 tracking-1>账户与安全</h2>
          </div>
          <div class="flex flex-col-reverse md:grid md:grid-cols-2 grid-gap-6">
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
