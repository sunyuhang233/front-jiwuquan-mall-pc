<script lang="ts" setup>
import currency from "currency.js";
import { type GoodsVO } from "~/types/goods";

const { goods } = defineProps<{
  goods: GoodsVO
}>();
</script>

<template>
  <div class="flex-row-bt-c cursor-pointer p-1">
    <div card-default h-6em w-6em overflow-hidden border-default>
      <el-image
        loading="lazy"
        class="transition-300 hover:transform-scale-110"
        :src="`${BaseUrlImg + goods.images[0]}?imageView2/1/w/100/h/100/format/webp/interlace/1/q/50`"
        style="width: 6em; height: 6em; "
        fit="cover"
      />
    </div>
    <div class="group flex flex-1 flex-col justify-between px-2 md:px-4">
      <h3 class="max-w-12em truncate tracking-1px md:max-w-16em">
        {{ goods.name }}
      </h3>
      <!-- 中下 -->
      <p
        mb-5 mt-1 font-700 leading-1.2em color-red-6
      >
        ￥{{ currency(goods.price) }}
        <small
          text-0.8em color-coolgray
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
          mr-3 opacity-80
        >
          浏览：{{ goods.views }}
        </small>
        <small opacity-80>销量：{{ goods.sales }}</small>
        <slot
          name="btn"
          :goods="goods"
        />
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
