<script lang="ts" setup>
import currency from "currency.js";
import { type OrderInfoVO } from "~/composables/api/orders";
const { order } = defineProps<{
  order: OrderInfoVO;
}>();
const emit = defineEmits(["submit"]);
// sotre
const store = useOrderStore();

interface BtnType {
  title?: string;
  type?: any;
  fn?: () => void;
}
// 订单状态
const types = computed(() => {
  const data: {
    banner: string;
    type: any;
    btns: BtnType[];
  } = {
    banner: "",
    type: "",
    btns: [],
  };

  switch (order.status) {
    case OrdersStatus.UN_PAID:
      data.banner = "待付款";
      data.btns = [
        {
          title: "取 消",
          type: "default",
          fn: () => {
            emit("submit", "cancel", order);
          },
        },
        {
          title: "修 改",
          type: "default",
          fn: () => {
            toDetail(order);
          },
        },
        {
          title: "立即付款",
          type: "danger",
          fn: () => {
            toDetail(order);
          },
        },
      ];
      data.type = "danger";
      break;
    case OrdersStatus.PAID:
      data.banner = "已付款，等待发货";
      data.type = "primary";
      data.btns = [
        {
          title: "退 款",
          type: "default",
          fn: () => {
            emit("submit", "pushRefund", order);
          },
        },
        {
          title: "催发货",
          type: "primary",
          fn: () => {
            emit("submit", "toastDelivery");
          },
        },
      ];
      break;
    case OrdersStatus.DELIVERED:
      data.banner = "已发货，请等待物流";
      data.type = "info";
      data.btns = [
        {
          title: "退 款",
          type: "default",
          fn: () => {
            emit("submit", "pushRefund", order);
          },
        },
        {
          title: "确认收货",
          type: "info",
          fn: () => {
            emit("submit", "checkDelivery", order);
          },
        },
      ];
      break;
    case OrdersStatus.RECEIVED:
      data.banner = "已确认收货，期待你的评价！";
      data.type = "info";
      data.btns = [
        {
          title: "再来一单",
          type: "default",
          fn: () => {
            toDetail(order);
          },
        },
        {
          title: "去评价",
          type: "info",
          fn: () => {
            toCommon();
          },
        },
      ];
      break;
    case OrdersStatus.COMMENTED:
      data.banner = "已完成评论，欢迎下次光临！";
      data.type = "success";
      data.btns = [
        {
          title: "再来一单",
          type: "default",
          fn: () => {
            toDetail(order);
          },
        },
      ];
      break;
    case OrdersStatus.CANCELED:
      data.banner = "订单已取消";
      data.type = "danger";
      data.btns = [
        {
          title: "删除订单",
          type: "danger",
          fn: () => {
            emit("submit", "toDelete", order);
          },
        },
        {
          title: "再来一单",
          type: "default",
          fn: () => {
            toDetail(order);
          },
        },
      ];
      break;
    case OrdersStatus.DELAY_CANCELED:
      data.banner = "订单超时，已自动取消";
      data.type = "danger";
      data.btns = [
        {
          title: "删除订单",
          type: "danger",
          fn: () => {
            emit("submit", "toDelete", order);
          },
        },
        {
          title: "再来一单",
          type: "default",
          fn: () => {
            toDetail(order);
          },
        },
      ];
      break;
    case OrdersStatus.REFUND:
      data.banner = "发起退款中，等等卖家处理...";
      data.type = "";
      data.btns = [
        {
          title: "处理中，请稍后",
          type: "default",
          fn: () => {
            toDetail(order);
          },
        },
      ];
      break;
    case OrdersStatus.REFUND_SUCCESS:
      data.banner = "退款成功，请注意到账！";
      data.type = "info";
      data.btns = [
        {
          title: "已退款",
          type: "default",
          fn: () => {
            toDetail(order);
          },
        },
      ];
      break;
  }
  return data;
});

// 订单按钮样式
const priceClass = computed(() => {
  return `text-[var(--el-color-${types.value.type || "default"})]`;
});
// 1、去到详情页
const toDetail = (o: OrderInfoVO = order) => {
  store.$patch({
    orderId: o.id,
    status: o.status,
    orderInfo: { ...o },
    pushOrderItems: [
      ...o.ordersItems.map((p) => {
        return { skuId: p.skuId, quantity: p.quantity };
      }),
    ],
    unPaidVO: {
      finalPrice: o.totalPrice,
      reducePrice: currency(o.totalPrice).subtract(o.spendPrice).value,
    },
  });
  setTimeout(() => {
    window.open(`/order/detail?id=${o.id}`, "_blank");
  }, 100);
};

// 2、去评价
const toCommon = () => {
  if (order.status !== OrdersStatus.RECEIVED) return;
  navigateTo({
    path: `/order/comment/${order.id}`,
  });
};
// 计算优惠价
const getReduce = computed(() => {
  if (order.spendPrice) {
    return currency(order.totalPrice).subtract(order.spendPrice);
  } else {
    return null;
  }
});

const delayOrder = () => {
  order.status = OrdersStatus.DELAY_CANCELED;
  order.updateTime = useDateFormat(Date.now(), "YYYY-MM-DD HH:mm:ss").value.toString();
};
</script>
<template>
  <div
    class="v-card group mb-6 border-default rounded-10px p-4 tracking-0.1em transition-300 hover:shadow active:shadow"
  >
    <!-- 顶部 -->
    <span class="flex items-center border-0 border-default pb-2 border-b-1px">
      <i class="p-2 opacity-50 i-solar:shop-bold-duotone bg-[var(--el-color-primary)] mr-2" />
      <small font-600>极物圈</small>
      <div ml-a>
        <el-text
          :type="types.type"
          class="flex"
        >
          <span
            flex
            items-center
            v-if="order.status === OrdersStatus.UN_PAID"
          >
            <OrderDelayTimer
              @delay="delayOrder"
              :date="new Date(order.createTime)"
            />
            ，
          </span>
          <span>{{ types.banner }}</span>
        </el-text>
      </div>
    </span>
    <!-- 子订单 -->
    <div
      @click="toDetail(order)"
      class="flex cursor-pointer items-center"
      my-4
      v-for="p in order.ordersItems"
      :key="p.skuId"
    >
      <ClientOnly>
        <el-image
          loading="lazy"
          fit="cover"
          :src="BaseUrlImg + p.goodsSku.image"
          class="w-5.8rem transition-300 hover:shadow md:w-7.2rem h-5.8rem md:h-7.2rem rounded-8px overflow-hidden border-default"
        />
      </ClientOnly>
      <!-- 中间 -->
      <div
        class="center flex-1 leading-1.2em md:leading-1.6em px-2 md:px-4 flex flex-col overflow-hidden truncate"
      >
        <strong truncate>
          {{ p.goods.name }}
          <el-tag
            v-if="p.activityId"
            type="danger"
            opacity-80
          >
            活动商品
          </el-tag>
        </strong>
        <small truncate>
          {{ [p.goodsSku.size, p.goodsSku.color, p.goodsSku.combo].filter((p) => p).join(" | ") }}
        </small>
        <small
          inline
          ml-a
          flex
          flex-col
          justify-end
        >
          <div
            ml-a
            opacity-80
            line-through
          >
            ￥{{ currency(p.goodsSku.price) }}
          </div>
          <div
            class="font-600 text-1.2em"
            opacity-80
            :class="priceClass"
          >
            ￥{{ currency(p.goodsSku.price) }}
          </div>
        </small>
      </div>
      <!-- 价格 -->
      <span
        font-600
        h-full
        flex
        items-center
        ml-4
      >
        X{{ p.quantity }}
      </span>
    </div>
    <!-- 总价 -->
    <div class="mt-4 w-full flex flex-col">
      <div flex-row-bt-c>
        <BtnCopyText
          class="opacity-80 hover:underline opacity-0 group-hover:opacity-70"
          :text="order.id"
          pretext="订单号："
          icon="i-solar:copy-outline"
        />
        <span
          ml-a
          mb-2
          v-if="getReduce"
        >
          -￥{{ getReduce }}
        </span>
      </div>
      <div flex-row-bt-c>
        <small class="opacity-60">创建于{{ order.createTime }}</small>

        <span
          font-600
          flex
          ml-a
          text-1.2rem
        >
          <small text-0.85rem>总计：</small>
          <div :class="priceClass">
            ￥{{ getReduce ? currency(order.spendPrice) : currency(order.totalPrice) }}
          </div>
        </span>
      </div>
    </div>
    <!-- 按钮 -->
    <div
      mt-3
      flex-row-bt-c
      tracking-0.3em
    >
      <div class="left cursor-pointer flex items-center">
        <i
          p-1.8
          bg-dark
          dark:bg-light
          i-solar:headphones-square-broken
        />
        <small class="mx-2 hover:underline hover:text-[var(--el-color-primary)]">客服</small>
        <!-- |
        <small class="mx-2 hover:underline hover:text-[var(--el-color-primary)]">查看详情</small> -->
      </div>
      <div class="btns">
        <el-button
          class="ml-2 hover:-translate-y-0.15em"
          v-for="p in types.btns"
          :key="p.title"
          :type="p.type || 'default'"
          @click="(p.fn || toDetail)()"
        >
          {{ p.title }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.btns {
  :deep(.el-button) {
    letter-spacing: 0.12em;
  }
}
</style>
