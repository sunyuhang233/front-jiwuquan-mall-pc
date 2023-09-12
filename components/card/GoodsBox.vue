<script lang="ts" setup>
import currency from 'currency.js';
import { BaseUrlImg } from '~/composables/utils/useFetchUtil';
import type { GoodsVO } from '~/types/goods';

// 商品参数
const { goods } = defineProps<{
  goods: GoodsVO
}>();
const getDiscount = computed<number>(() => {
  return currency(1).subtract(currency(goods.price).divide(goods.costPrice)).intValue;
});
</script>

<template>
  <div
    class="group w-full flex flex-col cursor-pointer border-gray-200 rounded-4px shadow-sm border-default dark:border-dark-200 dark:bg-dark-8"
    aspect-ratio-1
    md:aspect-ratio-1.2
  >
    <!-- 商品图片  -->
    <div class="img relative h-2/3 w-full">
      <ClientOnly>
        <ElImage
          loading="lazy"

          transition-300 hover:transform-scale-110
          class="h-full w-full overflow-hidden rounded-t-4px"
          :src="`${BaseUrlImg + goods.images[0]}?imageView2/0/format/webp/interlace/1/q/70`"
          :alt="goods.name"
          fit="cover"
        />
      </ClientOnly>
      <!-- 浏览量 -->
      <small
        class="absolute bottom-0 left-0 z-1 w-full flex-row-bt-c bg-[var(--el-bg-color-primary)] px-3 py-1 color-light opacity-0 backdrop-blur-2em transition-300"
        group-hover:opacity-80
      >
        <div class="icon">
          <i class="i-solar:eye-bold mr-1 p-2" />
          {{ goods.views }}
        </div>
        <strong
          v-if="+getDiscount"
          class="dis rounded-2em bg-red-5 px-2 py-0.2em tracking-0.1em"
        >
          {{ `-${getDiscount}%` }}
        </strong>
      </small>
    </div>
    <!-- 商品名 -->
    <div class="relative h-1/3 flex flex-col justify-between justify-around px-2 py-2 md:px-3">
      <h4 class="w-full truncate">
        {{ goods.name }}
      </h4>
      <p
        color-red-5
        class="texts"
      >
        <strong pr-1>￥{{ currency(goods.price) }}</strong>
        <small
          hidden text-0.6em color-coolgray md:inline
          style="text-decoration: line-through"
        >
          ￥{{ currency(goods.costPrice) }}
        </small>
        <!-- 小标填充 -->
        <slot :goods="goods" />
      </p>
      <slot
        name="bottom"
        :goods="goods"
      />
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
