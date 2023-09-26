<script lang="ts" setup>
import { appName } from "@/constants";

useHead({
  title: `我的收藏 - 个人中心 - ${appName}`,
  meta: [
    {
      name: "description",
      content: `我的收藏 - 个人中心 - ${appName}`,
    },
  ],
});
definePageMeta({
  key: route => route.path,
  layout: false,
});

const user = useUserStore();

// 功能
const activeMenu = ref<string>("goods");
</script>

<template>
  <div>
    <NuxtLayout
      name="user"
      :menu="['back']"
    >
      <div class="layout-default">
        <div class="flex-row-bt-c">
          <h2 class="mb-8 mt-4 flex animate-[fade-in-down_0.4s] items-center">
            我的收藏
            <ElDivider
              direction="vertical"
              style="margin: 0 1rem"
            />
            <i class="i-solar:star-bold-duotone bg-yellow-4 p-0.5em" />
          </h2>
          <div v-show="user.isLogin" />
        </div>
        <ClientOnly>
          <div
            class="v-card address-list animate-[fade-in_.3s_ease] rounded-14px p-6 leading-1.4em border-default"
          >
            <el-tabs
              v-model="activeMenu"
              tab-position="top"
              :stretch="false"
            >
              <!-- 收藏商品 -->
              <el-tab-pane
                name="goods"
                label="收藏商品"
              >
                <UserCollectGoodsList />
              </el-tab-pane>
              <!-- 收藏帖子 -->
              <el-tab-pane
                name="post"
                label="收藏帖子"
              />
            </el-tabs>
          </div>
        </ClientOnly>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tabs__item) {
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}
</style>
