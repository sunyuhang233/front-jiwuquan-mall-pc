<script lang="ts" setup>
const user = useUserStore();
useHead({
  title: "我的钱包 - 个人中心",
  meta: [
    {
      name: "description",
      content: "个人中心-极物钱包",
    },
  ],
});
// 页面
definePageMeta({
  pageTransition: false,
  layoutTransition: false,
});
</script>
<template>
  <div>
    <NuxtLayout
      name="user"
      :menu="['back']"
      :footer="false"
      class="p-0"
    >
      <ClientOnly>
        <div
          class="layout-default py-0"
          v-if="user.isLogin"
        >
          <!-- 标题 -->
          <div
            class="title animate-[fadeInDown_0.6s] w-full"
            pt-8
            pb-6
          >
            <span
              font-600
              text-2xl
              tracking-1
              flex
            >
              你的钱包
              <el-text
                style="font-size: 1.04em"
                type="info"
              >
                账单
              </el-text>
            </span>
          </div>
          <!-- 下方 -->
          <div
            class="animate-[fade-in_.3s] grid grid-cols-1 md:grid-cols-[8fr_3fr] grid-gap-8"
            grid-justify-items-stretch
            grid-items-stretch
          >
            <!-------------1------------>
            <div
              w-full
              grid="
              ~
              cols-1
              items-stretch
              gap-12"
              md:grid="
              ~
              cols-[4fr_3fr]
              gap-8
              items-stretch
              "
            >
              <!-- 钱包 -->
              <div
                class="z-0 overflow-x-hidden md:overflow-x-visible flex items-center relative w-full md:w-full md:max-w-380px"
              >
                <UserWalSwiperCarts />
              </div>
              <!-- 统计卡片 -->
              <UserWalTotalList
                grid="
                ~
                cols-1 gap-4 items-stretch"
                md:grid="
                ~
                cols-2 gap-6 items-stretch"
              />
              <!-- 套餐 -->
              <UserWalCombo class="w-full" />
              <!-- 统计表 -->
              <UserWalTable class="h-360px md:h-full" />
            </div>
            <!-------------2------------>
            <!-- 账单和日历 -->
            <UserWalBillsTab />
          </div>
        </div>
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss">
.grid-content {
  grid-template-columns: 8fr 3fr;
  grid-column-gap: 2.4rem;
  justify-items: stretch;
  align-items: stretch;
}
</style>
