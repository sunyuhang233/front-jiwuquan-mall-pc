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
definePageMeta({
  key: route => route.path,
  layout: false,
});

const user = useUserStore();
</script>

<template>
  <div>
    <NuxtLayout
      name="user"
      :menu="['back']"
    >
      <div v-if="user.getToken">
        <ClientOnly>
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
