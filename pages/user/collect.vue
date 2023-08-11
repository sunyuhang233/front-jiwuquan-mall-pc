<script lang="ts" setup>
useHead({
  title: "我的收藏 - 个人中心",
  meta: [
    {
      name: "description",
      content: "极物圈-个人中心",
    },
  ],
});
// 页面过渡
definePageMeta({
  pageTransition: false,
  layoutTransition: false,
});
const user = useUserStore();

// 功能
const activeMenu = ref<string>("goods");
</script>
<template>
  <NuxtLayout
    name="user"
    :menu="['back']"
  >
    <div class="layout-default">
      <div class="flex-row-bt-c">
        <h2 class="flex mt-4 mb-8 items-center animate-[fade-in-down_0.4s]">
          我的收藏
          <ElDivider
            direction="vertical"
            style="margin: 0 1rem"
          />
          <i class="p-0.5em bg-yellow-4 i-solar:star-bold-duotone" />
        </h2>
        <div v-show="user.isLogin"></div>
      </div>
      <ClientOnly>
        <div
          class="address-list animate-[fade-in_.3s_ease] v-card rounded-14px border-default p-6 leading-1.4em"
        >
          <el-tabs
            tab-position="top"
            v-model="activeMenu"
            :stretch="false"
          >
            <!-- 收藏商品 -->
            <el-tab-pane
              name="goods"
              label="收藏商品"
            >
              <UserCollectGoodsList />
            </el-tab-pane>
          </el-tabs>
        </div>
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>
<style scoped lang="scss">
:deep(.el-tabs__item) {
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}
</style>
