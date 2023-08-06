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
            class="title animate__animated animate__fadeInDown w-full"
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
          <div class="grid-content flex flex-wrap md:grid">
            <!-------------1------------>
            <div
              style="grid-template-columns: 2fr 4fr"
              flex
              w-full
              flex-wrap
              justify-center
              md:grid
              grid-gap-10
              grid-items-stretch
            >
              <!-- 钱包 -->
              <div
                class="flex min-h-290px flex-col justify-center w-400px relative overflow-x-hidden"
              >
                <UserWalSwiperCarts />
              </div>
              <!-- 统计卡片 -->
              <UserWalTotalList
                class="flex flex-wrap"
                md:grid="
                grid
                cols-2 gap-6 items-stretch"
              />
              <!-- 套餐 -->
              <UserWalCombo class="w-full" />
              <!-- 统计表 -->
              <UserWalTable class="h-500px md:h-full" />
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
