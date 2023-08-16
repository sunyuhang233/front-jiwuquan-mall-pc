<script lang="ts" setup>
import { appName } from "~/constants";
const user = useUserStore();
const route = useRoute();
// 订单id
const orderId = ref(route.params.id?.toString());
const order = useAsyncData(async () => {
  const { data, code } = await getOrdersInfoById(orderId.value, user.getToken);
  if (code === StatusCode.SUCCESS) {
    console.log(data);

    return data;
  } else {
    return data;
  }
});
console.log(order);

// head
useHead({
  title: `${appName} - 订单评价`,
  meta: [
    {
      name: "description",
      content: `${appName} - 订单评价`,
    },
  ],
});

const isNot = computed(() => {
  return user.isLogin && route.params.id && order.data.value;
});
</script>
<template>
  <div>
    <NuxtLayout
      name="second"
      :header="false"
      :left-menu="false"
      :footer="false"
      :menu="['back', 'service']"
    >
      <ClientOnly>
        <div
          class="layout-default md:w-650px"
          v-if="isNot"
        >
          <h3
            my-4
            flex
            items-center
          >
            订单评价
            <i
              i-solar:dialog-2-line-duotone
              ml-2
              p-0.6em
            />
            <BtnSwitch class="mr-0 ml-a" />
          </h3>
          <div
            class="v-card mb-4 shadow-sm rounded-10px p-4"
            v-for="p in order.data.value?.ordersItems"
            :key="p.id"
          >
            <OrderCommentCard :order-item="p" />
          </div>
          <div class="v-card tra flex-row-bt-c p-3 rounded-10px mt-4 shadow sticky bottom-1rem">
            <el-text flex-row-c-c>
              <ElIconService class="w-1.2em h-1.2em mx-2" />
              客服
            </el-text>
            <el-button
              type="primary"
              style="font-weight: 600; padding: 1.1rem"
              shadow-lg
            >
              提 交
            </el-button>
          </div>
        </div>
        <div
          class="flex-row-c-c w-full h-90vh"
          v-else
        >
          <OtherError
            msg="抱歉，订单不存在"
            class="text-[var(--el-color-primary)]"
          />
        </div>
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss"></style>
