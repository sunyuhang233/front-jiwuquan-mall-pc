<script lang="ts" setup>
import { OrderInfoVO, DeliveryVO } from "@/composables/api/orders";
const user = useUserStore();
const props = defineProps<{
  orderInfo: OrderInfoVO;
}>();
const isFold = ref<boolean>(false);
// list
const list = ref<
  {
    active: number;
    time: string;
    title: string;
  }[]
>([
  {
    active: 1,
    time: props.orderInfo.createTime,
    title: "创建订单",
  },
]);
const delivery = useAsyncData(async () => {
  const { data, code } = await getBillsPage(
    1,
    1,
    {
      orderId: props.orderInfo.id,
      type: BillsType.OUT,
    },
    user.getToken
  );
  if (data.records.length > 0) {
    list.value.push({
      active: 2,
      title: "已支付，待发货",
      time: data.records[0].createTime,
    });
  }
  // 订单
  const delivery = await getDelivertOrders(props.orderInfo.id, user.getToken);
  return delivery.data;
});
defineExpose({
  reload: delivery.refresh,
});
</script>
<template>
  <section>
    <el-timeline>
      <el-timeline-item
        v-for="p in list"
        :color="
          p.active === list.length ? 'var(--el-color-primary)' : 'var(--el-color-primary-light-3)'
        "
        :key="p.active"
        :timestamp="p.time"
      >
        {{ p.title }}
      </el-timeline-item>
      <el-timeline-item
        :timestamp="delivery.data.value?.createTime"
        color="var(--el-color-primary)"
        v-show="delivery.data.value"
      >
        <template #default>
          <div class="v-card">
            <div class="el-timeline-item__content pb-1">
              已发货，
              <span
                class="text-[var(--el-color-primary)] mr-2 select-none cursor-pointer hover:underline active:underline"
                v-copying.toast="delivery.data.value?.deliveryNum"
              >
                {{ delivery.data.value?.deliveryNum }}
              </span>
              <el-text
                @click="isFold = !isFold"
                size="small"
                class="select-none cursor-pointer hover:underline active:underline"
                :type="isFold ? 'danger' : ''"
              >
                {{ isFold ? "折叠" : "展开" }}
              </el-text>
            </div>
            <div
              :class="{ 'h-6em': isFold }"
              class="h-0 overflow-hidden transition-height rounded-6px opacity-90 flex flex-col leading-1.4em pt-1"
            >
              <small>订单号：{{ delivery.data.value?.deliveryNum }}</small>
              <small>快递单号：{{ delivery.data.value?.deliveryNum }}</small>
              <small>收货地址：{{ delivery.data.value?.sendAddress }}</small>
              <small>发货地址：{{ delivery.data.value?.deliverAddress }}</small>
            </div>
          </div>
        </template>
      </el-timeline-item>
      <slot :data="delivery"></slot>
    </el-timeline>
  </section>
</template>
<style scoped lang="scss"></style>
