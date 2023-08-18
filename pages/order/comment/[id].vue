<script lang="ts" setup>
import CategoryTree from "components/Goods/CategoryTree.vue";
import { appName } from "~/constants";
const user = useUserStore();
const route = useRoute();
// 订单id
const orderId = ref(route.params.id?.toString());
const order = useAsyncData(async () => {
  const { data, code } = await getOrdersInfoById(orderId.value, user.getToken);
  if (code === StatusCode.SUCCESS) {
    return data;
  } else {
    return null;
  }
});
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
// 是否可以评价
const isExpire = computed(() => {
  return user.isLogin && route.params.id && order.data.value;
});
// 参数列表
const dtoList = ref([]);
// 是否禁用
const isDisable = ref<boolean>(false);
const isDone = ref<boolean>(false);
const isLoading = ref<boolean>(false);
/**
 * 提交评价
 */
const onSubmit = async () => {
  isDisable.value = true;
  isLoading.value = true;
  isDone.value = false;
  if (dtoList.value.length !== order.data.value?.ordersItems.length) {
    return ElMessage.warning("评论列表个数缺失！");
  }

  // 发送
  const { code } = await toOrdersComment(order.data.value.id, dtoList.value, user.getToken);
  if (code === StatusCode.SUCCESS) {
    ElNotification.success({
      title: "评价成功 🎉",
      message: "感谢您的评价，欢迎下次继续选购~",
    });
  } else {
    ElNotification.error({
      title: "评价失败，请稍后再试！",
    });
  }

  isLoading.value = false;
  isDone.value = true;
};
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
          v-loading.fullscreen.lock="isLoading"
          class="layout-default md:w-650px"
          v-if="isExpire"
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
          <KeepAlive>
            <div
              class="v-card mb-4 shadow-sm rounded-10px p-4"
              v-for="p in order.data.value?.ordersItems"
              :key="p.id"
            >
              <OrderCommentCard
                ref="dtoList"
                :order-item="p"
                :is-disable="isDisable"
              />
            </div>
          </KeepAlive>
          <!-- 按钮 -->
          <div class="v-card tra flex-row-bt-c p-3 rounded-10px mt-4 shadow sticky bottom-1rem">
            <el-text flex-row-c-c>
              <ElIconService class="w-1.2em h-1.2em mx-2" />
              客服
            </el-text>
            <el-button
              type="primary"
              style="font-weight: 600; padding: 1.1rem"
              shadow-lg
              @click="onSubmit"
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
