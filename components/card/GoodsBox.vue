<script lang="ts" setup>
import currency from "currency.js";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import { GoodsVO } from "~/types/goods";
// 商品参数
const { goods } = defineProps<{
  goods: GoodsVO;
}>();
const getDiscount = computed<number>(() => {
  return currency(1).subtract(currency(goods.price).divide(goods.costPrice)).intValue;
});
</script>
<template>
  <div
    class="w-full border-default cursor-pointer flex flex-col dark:border-dark-200 dark:bg-dark-8 border-gray-200 rounded-4px shadow-sm group"
    aspect-ratio-1
    md:aspect-ratio-1.2
  >
    <!-- 商品图片  -->
    <div class="img relative w-full h-110px md:h-160px">
      <ClientOnly>
        <ElImage
          loading="lazy"
          hover:transform-scale-110
          transition-300
          class="w-full h-full rounded-t-4px overflow-hidden"
          :src="BaseUrlImg + goods.images[0] + '?imageView2/0/format/webp/interlace/1/q/70'"
          :alt="goods.name"
          fit="cover"
        />
      </ClientOnly>
      <!-- 浏览量 -->
      <small
        class="view w-full py-1 px-3 flex-row-bt-c absolute left-0 bottom-0 z-1 color-light bg-[var(--el-bg-color-primary)] backdrop-blur-2em opacity-0 transition-300"
        group-hover:opacity-80
      >
        <div class="icon">
          <i class="i-solar:eye-bold p-2 mr-1" />
          {{ goods.views }}
        </div>
        <strong
          class="dis tracking-0.1em bg-red-5 rounded-2em py-0.2em px-2"
          v-if="+getDiscount"
        >
          {{ `-${getDiscount}%` }}
        </strong>
      </small>
    </div>
    <!-- 商品名 -->
    <div class="flex relative flex-col px-2 py-2 md:px-3 justify-around h-1/3 justify-between">
      <h4 class="w-full truncate">
        {{ goods.name }}
      </h4>
      <p
        color-red-5
        class="texts"
      >
        <strong pr-1>￥{{ currency(goods.price) }}</strong>
        <small
          hidden
          md:inline
          color-coolgray
          text-0.6em
          style="text-decoration: line-through"
        >
          ￥{{ currency(goods.costPrice) }}
        </small>
        <!-- 小标填充 -->
        <slot :goods="goods"></slot>
      </p>
      <slot
        name="bottom"
        :goods="goods"
      ></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
.texts {
  line-height: 1.2em;
  &:hover > * {
    opacity: 0;
  }
  &::before {
    content: "立即购买";
    background-color: $text-mark-color4;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2em;
    line-height: 2em;
    transform: rotateX(90deg);
    transition: $transition-delay;
    color: #fff;
    text-align: center;
    border-radius: 2px;
  }
  &:hover::before {
    content: "立即购买";
    transform: rotateX(0deg);
    background-color: $text-mark-color4;
    z-index: 1;
  }
}
</style>
