<script lang="ts" setup>
import { GoodsCollectVO } from "@/composables/api/goods/collect";
import currency from "currency.js";
const { data } = defineProps<{
  data: GoodsCollectVO;
}>();
</script>
<template>
  <div
    class="aspect-ratio-1 w-full cursor-pointer flex flex-col dark:bg-dark-8 border-transparent rounded-4px group"
  >
    <!-- 商品图片  -->
    <div class="img relative w-full h-120px md:h-160px rounded-t-inherit overflow-hidden">
      <ElImage
        @click="$emit('link')"
        loading="lazy"
        class="w-full h-full"
        :src="BaseUrlImg + data.goods.images[0]"
        :alt="data.goods.name"
        fit="cover"
      />
      <div class="absolute top-0 left-0">
        <slot name="btns"></slot>
      </div>
      <!-- 商品收藏 -->
      <small
        @click="$emit('cancel', data.goods.id)"
        rounded-3px
        class="v-card opacity-0 hover:text-[var(--el-color-danger)] group-hover:opacity-100 bg-light shadow text-black group dark:text-light text-0.8rem absolute top-0 right-0 pl-2.6 pr-1.8 py-0.6 m-2"
      >
        <div class="inline text-dark dark:text-light">取消收藏</div>
        <i
          ml-1
          i-solar:star-bold
          text-yellow-4
          p-0.6em
        />
      </small>
      <!-- 浏览量 -->
      <small
        class="view w-full py-1 px-3 flex-row-bt-c absolute left-0 bottom-0 z-1 color-light bg-[var(--el-bg-color-primary)] backdrop-blur-2em opacity-0 transition-300"
        group-hover:opacity-80
      >
        <div class="icon">
          <i class="i-solar:eye-bold p-2 mr-1" />
          {{ data.goods.views }}
        </div>
      </small>
    </div>
    <!-- 商品名 -->
    <div
      @click="$emit('link')"
      class="flex relative flex-col px-2 py-2 md:px-3 justify-around h-1/3 justify-between"
    >
      <h4 class="w-full truncate">
        {{ data.goods.name }}
      </h4>
      <p
        color-red-5
        class="texts"
      >
        <strong pr-1>￥{{ currency(data.goods.price) }}</strong>
        <small
          hidden
          md:inline
          color-coolgray
          text-0.6em
          style="text-decoration: line-through"
        >
          ￥{{ currency(data.goods.costPrice) }}
        </small>
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
