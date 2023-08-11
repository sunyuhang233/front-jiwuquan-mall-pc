<script lang="ts" setup>
import currency from "currency.js";
import { type GoodsVO } from "~/types/goods";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
const { goods } = defineProps<{
  goods: GoodsVO;
}>();
</script>
<template>
  <div class="flex-row-bt-c cursor-pointer p-1">
    <ElImage
      class="hover:transform-scale-110 transition-300 w-6em h-6em"
      :src="BaseUrlImg + goods.images[0]"
      style="width: 6em; height: 6em; border: 1px solid #eee; border-radius: 4px"
      fit="cover"
    />
    <div class="px-2 md:px-4 flex-1 group flex flex-col justify-between">
      <h3 class="overflow-hidden truncate tracking-1px max-w-12em md:max-w-16em">
        {{ goods.name }}
      </h3>
      <!-- 中下 -->
      <p
        leading-1.2em
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
        flex-1
      >
        <small
          opacity-80
          mr-2
        >
          浏览：{{ goods.views }}
        </small>
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
