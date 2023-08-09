<script lang="ts" setup>
import { type GoodsVO } from "~/types/goods";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import currency from "currency.js";
const { goods } = defineProps<{
  goods: GoodsVO;
}>();
</script>
<template>
  <div
    class="card"
    flex-row-bt-c
    cursor-pointer
    p-1
  >
    <ClientOnly>
      <ElImage
        hover:transform-scale-110
        transition-300
        :src="BaseUrlImg + goods.images[0]"
        style="width: 6em; height: 6em; border: 1px solid #eee; border-radius: 4px"
        fit="cover"
      />
    </ClientOnly>
    <div class="px-2 md:px-4 flex-1 group flex flex-col items-start justify-between">
      <h3 class="overflow-hidden truncate tracking-1px max-w-12em md:max-w-16em">
        {{ goods.name }}
      </h3>
      <!-- 中下 -->
      <p
        font-700
        color-red-6
        mt-1
        mb-5
      >
        ￥{{ currency(goods.price) }}
        <small
          color-coolgray
          text-0.4em
          style="text-decoration: line-through"
        >
          ￥{{ currency(goods.costPrice) }}
        </small>
      </p>
      <!-- 下 -->
      <p
        flex-row-bt-c
        class="w-1/1"
      >
        <small opacity-80>浏览：{{ goods.views }}</small>
        <small opacity-80>销量：{{ goods.sales }}</small>
        <slot
          name="btn"
          :goods="goods"
        ></slot>
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
