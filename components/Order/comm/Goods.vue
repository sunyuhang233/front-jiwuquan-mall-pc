<script lang="ts" setup>
import { OrderGoodsSkuVO, OrdersItemVO } from "@/composables/api/orders";
const { orderItem } = defineProps<{
  orderItem: OrdersItemVO;
}>();

// 商品规格
const getProps = (p: OrderGoodsSkuVO): string => {
  const arr = [];
  arr.push(p.size, p.color, p.combo);
  return arr.join(" | ");
};
</script>
<template>
  <div class="goods flex">
    <el-image
      loading="lazy"
      class="w-4rem h-4rem rounded-6px overflow-hidden border-default"
      :src="
        BaseUrlImg +
        orderItem.goodsSku.image +
        '?imageView2/0/w/100/h/100/format/webp/interlace/1/q/50'
      "
    />
    <div class="flex flex-col justify-around px-4">
      <small>{{ orderItem.goods.name }}</small>
      <small
        opacity-60
        text-0.6em
      >
        {{ getProps(orderItem.goodsSku) }}
      </small>
    </div>
  </div>
</template>
