<script lang="ts" setup>
import { appName } from "@/constants";

const user = useUserStore();

useHead({
  title: `个人信息 - 个人中心 - ${appName}`,
  meta: [
    {
      name: "description",
      content: `个人信息 - 个人中心 - ${appName}`,
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
    >
      <ClientOnly>
        <div v-if="user.getToken">
          <!-- 壁纸 -->
          <UserInfoBgToggle />
          <div class="flex animate-[fade-in_.3s_ease] layout-default">
            <div class="flex flex-1 flex-wrap">
              <!-- 用户头像 -->
              <div class="avatars relative flex-1 -top-6em md:pr-4">
                <UserInfoLine />
                <div class="m-2">
                  <UserInfoTabs />
                </div>
              </div>
              <!-- 右侧 -->
              <div class="shadow-sm">
                <!-- 签到 -->
                <UserInfoSigninCard class="sm:w-360px" />
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss"></style>
