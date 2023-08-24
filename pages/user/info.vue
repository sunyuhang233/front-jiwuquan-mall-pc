<script lang="ts" setup>
useHead({
  title: "详细 - 个人中心",
  meta: [
    {
      name: "description",
      content: "极物圈-个人中心",
    },
  ],
});
// 页面
definePageMeta({ layout: false });

const user = useUserStore();
</script>
<template>
  <div>
    <NuxtLayout
      name="user"
      :menu="['back']"
    >
      <div>
        <ClientOnly>
          <!-- 壁纸 -->
          <UserInfoBgToggle />
          <div class="layout-default flex animate-[fade-in_.3s_ease]">
            <div class="flex-1 flex flex-wrap">
              <!-- 用户头像 -->
              <div class="avatars relative -top-6em flex-1 md:pr-4">
                <UserInfoLine />
                <div class="m-2">
                  <UserInfoTabs />
                </div>
              </div>
              <!-- 右侧 -->
              <div class="v-card shadow-sm">
                <!-- 签到 -->
                <UserInfoSigninCard />
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss"></style>
