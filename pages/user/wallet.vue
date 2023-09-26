<script lang="ts" setup>
import { appName } from "@/constants";

const user = useUserStore();
useHead({
  title: `我的钱包 - 个人中心 - ${appName}`,
  meta: [
    {
      name: "description",
      content: `我的钱包 - 个人中心 - ${appName}`,
    },
  ],
});
// 定义页面元数据
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
      class="p-0"
    >
      <div>
        <ClientOnly>
          <div
            v-if="user.isLogin"
            class="py-0 layout-default"
          >
            <!-- 标题 -->
            <div
              class="title w-full animate-[fadeInDown_0.6s]"

              pb-6 pt-8
            >
              <span


                flex text-2xl font-600 tracking-1
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
              class="grid grid-cols-1 animate-[fade-in_.3s] grid-gap-8 md:grid-cols-[8fr_3fr]"
              grid-justify-items-stretch
              grid-items-stretch
            >
              <div
                w-full
                grid="
              ~
              cols-1
              items-stretch
              gap-12"
                md:grid="
              ~
              cols-[3fr_4fr]
              gap-8
              items-stretch
              "
              >
                <!-- 钱包 -->
                <div
                  class="relative z-0 w-full flex items-center overflow-x-hidden md:max-w-380px md:w-full md:overflow-x-visible"
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
              <!-- 账单和日历 -->
              <UserWalBillsTab />
            </div>
          </div>
        </ClientOnly>
      </div>
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
