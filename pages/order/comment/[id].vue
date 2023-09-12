<script lang="ts" setup>
import type { OrderCommentDTO } from '@/composables/api/orders';
import { appName } from '~/constants';

const user = useUserStore();
const route = useRoute();
// 订单id
const orderId = ref(route.params.id?.toString());
const order = useAsyncData(async () => {
  const { data, code } = await getOrdersInfoById(orderId.value, user.getToken);
  if (code === StatusCode.SUCCESS)
    return data;

  else
    return null;
});
// head
useHead({
  title: `${appName} - 订单评价`,
  meta: [
    {
      name: 'description',
      content: `${appName} - 订单评价`,
    },
  ],
});

// 参数列表
const dtoList = ref<
  {
    dto: OrderCommentDTO
    clearData: () => Promise<void>
  }[]
      >([]);

// 是否禁用
const isDisable = ref<boolean>(false);
const isDone = ref<boolean>(false);
const isLoading = ref<boolean>(false);
// 是否可以评价
const isExpire = computed(() => {
  return user.isLogin && route.params.id && order.data.value && !isDone.value;
});
/**
 * 提交评价
 */
async function onSubmit() {
  if (dtoList.value.length !== order.data.value?.ordersItems.length)
    return ElMessage.warning('评论列表个数缺失！');

  // 校验
  for (let i = 0; i < dtoList.value.length; i++) {
    const p = dtoList.value[i];
    if (!p.dto.rate)
      return ElMessage.warning('评论星级不能为空！');
    else if (!p.dto.orderItemId)
      return ElMessage.warning('评论表单错误，请稍后再试！');
  }

  isDisable.value = true;
  isDone.value = false;
  isLoading.value = true;
  // 发送
  const { code } = await toOrdersComment(
    order.data.value.id,
    JSON.parse(JSON.stringify(dtoList.value.map(p => p.dto))),
    user.getToken,
  );
  if (code === StatusCode.SUCCESS) {
    ElNotification.success({
      title: '评价成功 🎉',
      message: '感谢您的评价，欢迎下次继续选购~',
    });
    isDone.value = true;
  }
  else {
    ElNotification.error({
      title: '评价失败，请稍后再试！',
    });
    isDone.value = false;
  }
  // 清除数据
  dtoList.value.forEach((p) => {
    p.clearData && p.clearData();
  });
  isLoading.value = false;
}

definePageMeta({
  key: route => route.path,
  layout: false,
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
          v-if="isExpire"
          v-loading.fullscreen.lock="isLoading"
          class="layout-default md:w-650px"
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
            <BtnSwitch class="ml-a mr-0" />
          </h3>
          <!-- 表单集 -->
          <div
            v-for="(p, i) in order.data.value?.ordersItems"
            :key="p.id"
            class="v-card mb-4 rounded-10px p-4 shadow-sm"
          >
            <OrderCommentCard
              ref="dtoList"
              :index="i"
              :order-item="p"
              :is-disable="isDisable"
            />
          </div>
          <!-- 按钮 -->
          <div class="v-card tra sticky bottom-1rem mt-4 flex items-center rounded-10px p-3 shadow">
            <el-text flex-row-c-c>
              <ElIconService class="mx-2 h-1.2em w-1.2em" />
              客服
            </el-text>
            <el-button
              class="ml-a"
              type="primary"
              style="font-weight: 600; padding: 1.1rem"
              shadow-lg
              @click="onSubmit"
            >
              提 交
            </el-button>
          </div>
        </div>
        <!-- 评价完成 -->
        <div
          v-else-if="isDone"
          class="h-90vh w-full flex-row-c-c animate-[bounceIn_0.4s_ease-in] overflow-hidden"


          flex-col leading-2em tracking-0.2em
        >
          <img
            src="@/assets/images/icon/success_cone.svg"
            w-8rem
            alt="🎉"
          >
          <h3>评价已完成</h3>
          <div class="mt-2">
            <el-button
              type="primary"
              @click="navigateTo.length > 0 ? $router.back() : navigateTo('/order/list')"
            >
              关闭
            </el-button>
            <el-button
              plain
              type="primary"
            >
              主页
            </el-button>
          </div>
        </div>
        <!-- 订单不存在 -->
        <div
          v-else
          class="h-90vh w-full flex-row-c-c"
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
