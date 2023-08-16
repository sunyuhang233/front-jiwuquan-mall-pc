<script lang="ts" setup>
import { EventGoodsVO } from "@/composables/api/event/index";
import currency from "currency.js";
const { data } = defineProps<{
  data: EventGoodsVO;
}>();

const getInsurance = computed(() => {
  return data.warrantyTime
    ? data.warrantyTime + "天无理由 "
    : " " + data.refundTime
    ? data.refundTime + "天保修 "
    : " ";
});
</script>
<template>
  <div
    class="aspect-ratio-1 goods-card w-full border-default cursor-pointer flex flex-col dark:border-dark-200 dark:bg-dark-8 border-gray-200 rounded-4px shadow-sm group"
  >
    <!-- 商品图片  -->
    <div class="img relative w-full h-120px md:h-160px rounded-t-inherit overflow-hidden">
      <ElImage
        @click="$emit('link')"
        loading="lazy"
        class="w-full h-full"
        :src="BaseUrlImg + data.images.split(',')[0]"
        :alt="data.name"
        fit="cover"
      />
      <div class="absolute top-2 right-2">
        <el-tag
          type="danger"
          effect="dark"
          rounded-3px
          style="letter-spacing: 0.1em"
        >
          -￥{{ currency(data.price).subtract(data.eventPrice) }}
        </el-tag>
      </div>
      <!-- 浏览量 -->
      <small
        class="view w-full py-1 px-3 flex-row-bt-c absolute left-0 bottom-0 z-1 color-light bg-[var(--el-bg-color-primary)] backdrop-blur-2em opacity-0 transition-300"
        group-hover:opacity-80
      >
        <div>
          <i class="i-solar:eye-bold p-2 mr-1" />
          {{ data.views }}
        </div>
        <div>
          销量：
          {{ data.sales }}
        </div>
      </small>
    </div>
    <!-- 商品名 -->
    <div
      @click="$emit('link')"
      class="texts flex relative flex-col px-2 py-2 md:px-3 justify-around h-1/3 justify-between"
    >
      <h4 class="w-full truncate">
        {{ data.name }}
      </h4>
      <p class="opacity-80 text-0.4em">
        <small>
          {{ data.city ? data.city + "发货 " : "" }}
        </small>
        <small float-right>{{ getInsurance }}</small>
      </p>
      <!-- 价格 -->
      <p class="color-[var(--el-color-danger)] flex items-end">
        <strong pr-1>￥{{ currency(data.eventPrice) }}</strong>
        <small
          hidden
          md:inline
          color-coolgray
          text-0.6em
          style="text-decoration: line-through"
        >
          ￥{{ currency(data.price) }}
        </small>
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.texts {
  &::before {
    content: "立即购买";
    background-color: var(--el-color-danger);
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2em;
    z-index: 1;
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
    background-color: var(--el-color-danger);
    z-index: 1;
  }
}
</style>
