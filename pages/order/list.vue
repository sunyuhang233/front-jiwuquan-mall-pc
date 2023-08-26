<script lang="ts" setup>
import { appName } from "~/constants";
useHead({
  title: `${appName} - 订单`,
  meta: [
    {
      name: "description",
      content: "极物圈 - 我的订单",
    },
  ],
});
const user = useUserStore();
// 内容
const activeMenu = ref<string>("all");
// isLoading
const isLoading = ref<boolean>(false);
const reload = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

definePageMeta({
  key: (route) => route.path,
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout
      name="second"
      :left-menu="false"
      :footer="false"
      :menu="['back', 'service']"
    >
      <div>
        <ClientOnly>
          <div
            class="layout-default-se min-h-80vh group"
            v-loading.fullscreen="isLoading"
            v-if="user.isLogin"
          >
            <!-- 头部 -->
            <div class="top my-4 mb-6 flex-row-bt-c">
              <h2
                flex
                items-center
              >
                <span mr-2>我的订单</span>
                <ElDivider direction="vertical" />
                <ClientOnly>
                  <span
                    ml-2
                    text-0.8em
                    opacity-80
                  >
                    {{ user.userInfo.nickname }}
                  </span>
                </ClientOnly>
              </h2>
              <i
                @click="reload"
                opacity-0
                transition-300
                group-hover:opacity-100
                class="block hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)] p-0.8em"
              />
            </div>
            <!-- 订单列表 -->
            <div
              class="v-card p-6 rounded-10px shadow"
              v-if="!isLoading"
            >
              <el-tabs
                tab-position="top"
                v-model="activeMenu"
                :stretch="true"
              >
                <!-- 全部 -->
                <el-tab-pane
                  name="all"
                  label="全部"
                >
                  <OrderInfoList />
                </el-tab-pane>
                <!-- 待付款 -->
                <el-tab-pane
                  lazy
                  name="unpaid"
                  label="待付款"
                >
                  <OrderInfoList :status="OrdersStatus.UN_PAID" />
                </el-tab-pane>
                <!-- 待 发 货 -->
                <el-tab-pane
                  lazy
                  name="paid"
                  label="待发货"
                >
                  <OrderInfoList :status="OrdersStatus.PAID" />
                </el-tab-pane>
                <!-- 待 收 货 -->
                <el-tab-pane
                  name="received"
                  label="待收货"
                  lazy
                >
                  <OrderInfoList :status="OrdersStatus.DELIVERED" />
                </el-tab-pane>
                <!-- 待评价 -->
                <el-tab-pane
                  name="comment"
                  label="待评价"
                  lazy
                >
                  <OrderInfoList :status="OrdersStatus.RECEIVED" />
                </el-tab-pane>
                <!-- 已取消 -->
                <el-tab-pane
                  name="canceled"
                  label="已取消"
                  lazy
                >
                  <OrderInfoList :status="OrdersStatus.CANCELED" />
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </ClientOnly>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tabs) {
  .el-tabs__item {
    font-size: 1rem;
    &.is-active {
      font-weight: 600;
    }
    letter-spacing: 0.6em;
  }
}
</style>
