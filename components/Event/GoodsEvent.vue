<script lang="ts" setup>
import currency from "currency.js";
import type { EventGoodsVO } from "@/composables/api/event/index";

const { data } = defineProps<{
  data: EventGoodsVO
}>();

const getInsurance = computed(() => {
  return data.warrantyTime
    ? `${data.warrantyTime}天无理由 `
    : `${data.refundTime}`
      ? `${data.refundTime}天保修 `
      : " ";
});
</script>

<template>
  <div
    class="group goods-card aspect-ratio-1 w-full flex flex-col cursor-pointer border-gray-200 rounded-4px shadow-sm border-default dark:border-dark-200 dark:bg-dark-8"
  >
    <!-- 商品图片  -->
    <div
      class="img relative h-120px w-full overflow-hidden rounded-t-inherit md:h-160px"
    >
      <el-image
        loading="lazy"
        class="h-full w-full"
        :src="BaseUrlImg + (data?.image ? data?.image : data?.images?.split(',')[0])"
        :alt="data.name"
        fit="cover"
      />
      <div class="absolute right-2 top-2">
        <el-tag
          v-if="data?.price && data?.eventPrice"
          type="danger"
          effect="dark"
          rounded-3px
          style="letter-spacing: 0.1em"
        >
          -￥{{ currency(data?.price).subtract(data?.eventPrice) }}
        </el-tag>
      </div>
      <!-- 浏览量 -->
      <small
        class="view absolute bottom-0 left-0 z-1 w-full flex-row-bt-c bg-[var(--el-bg-color-primary)] px-3 py-1 color-light opacity-0 backdrop-blur-2em transition-300"
        group-hover:opacity-80
      >
        <div>
          <i class="i-solar:eye-bold mr-1 p-2" />
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
      class="texts relative flex flex-col justify-between justify-around px-2 py-2 md:px-3"
    >
      <h4 class="w-full truncate">
        {{ data.name }}
      </h4>
      <p class="my-1 text-0.8em opacity-80">
        <small>
          {{ data.city ? `${data.city}发货 ` : "" }}
        </small>
        <small float-right>{{ getInsurance }}</small>
      </p>
      <!-- 价格 -->
      <p class="flex items-end color-[var(--el-color-danger)]">
        <strong pr-1>￥{{ currency(data.eventPrice!) }}</strong>
        <small
          hidden text-0.8em color-coolgray md:inline
          style="text-decoration: line-through"
        >
          ￥{{ currency(data.price!) }}
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
