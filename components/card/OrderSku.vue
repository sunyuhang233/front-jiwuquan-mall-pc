<!-- eslint-disable vue/no-mutating-props -->
<script lang="ts" setup>
import currency from "currency.js";
import type { GoodsSkuMdVO, GoodsSkuVO } from "~/composables/api/goods/sku";
import { getGoodsSkuByGid } from "~/composables/api/goods/sku";
import type { PushOrdersItemDTO } from "~/composables/api/orders/index";

const { data, disable } = defineProps<{
  data: PushOrdersItemDTO & GoodsSkuMdVO
  disable: boolean
}>();
const isUpdateLoading = ref<boolean>(false);
const isLoading = ref<boolean>(true);
// 商品规格信息
const skuList = ref<GoodsSkuVO[]>([]);
// 加载规格列表
async function loadGoodSkuList(val: boolean) {
  if (val && isLoading.value) {
    const res = await getGoodsSkuByGid(data.goodsId);
    setTimeout(() => {
      res.data.value?.data.forEach(p => skuList.value.push(p));
      isLoading.value = false;
    }, 300);
  }
}
// 计算规格全部属性
function getSkuProps(goodsSku: GoodsSkuVO) {
  return `${goodsSku.size || ""} ${goodsSku.color || ""} ${goodsSku.combo || ""}`;
}
// 规格属性计算
const getProps = computed({
  get() {
    return `${data.size || ""} ${data.color || ""} ${data.combo || ""}`;
  },
  set(skuId: string) {
    const p = toRaw(skuList.value.find(p => p.id === skuId));
    // 更新
    if (p && p.id !== "") {
      data.size = p.size || "";
      data.image = p.image;
      data.price = p.price;
      data.costPrice = p.costPrice;
      data.color = p.color || "";
      data.combo = p.combo;
      data.skuId = p.id;
      data.id = p.id;
    }
  },
});
// 计算商品总价
const getGoodsPrices = computed(() => {
  return currency(data.price).multiply(data.quantity);
});
// 计算最终价
const getTotalPrice = computed(() => {
  return getGoodsPrices.value.add(data.postage);
});
</script>

<template>
  <div
    v-loading="isUpdateLoading"
    class="group overflow-hidden"
    flex flex-wrap cursor-pointer justify-between border-2px rounded-8px p-0 text-0.6rem border-default-hover md:p-3 md:text-1em
  >
    <!-- 图片 -->
    <ClientOnly>
      <div
        class="relative w-2/7 md:w-8em"
        :class="{ 'is-event ': data.activityId !== undefined }"
      >
        <ElImage
          loading="lazy"
          :src="BaseUrlImg + data.image"
          style="width: 100%; height: 100%; aspect-ratio: 1/1; border-radius: 4px"
          fit="cover"
        />
      </div>
    </ClientOnly>
    <!-- 商品名称|规格 -->
    <div class="flex flex-1 justify-between overflow-hidden truncate py-2">
      <div class="group left h-full flex flex-col items-start justify-between px-4">
        <h4 class="max-w-1/1 overflow-hidden truncate md:max-w-16em">
          {{ data.name }}
        </h4>
        <!-- 中下 -->
        <div
          my-a font-700 color-red-6
        >
          ￥{{ currency(data.price) }}
          <span
            text-0.8em color-coolgray
            style="text-decoration: line-through"
          >
            ￥{{ currency(data.costPrice) }}
          </span>
        </div>
        <!-- 下 -->
        <div
          flex-row-bt-c
          class="mt-2"
        >
          <!-- 规格 -->
          <ClientOnly>
            <el-select
              v-model="getProps"
              :disabled="disable"
              no-data-text="暂无其他规格！"
              loading-text="加载中..."
              :loading="isLoading"
              :placeholder="getProps"
              collapse-tags-tooltip
              @visible-change="loadGoodSkuList"
            >
              <!-- value 内容 -->
              <el-option
                v-for="p in skuList"
                :key="p.id"
                :label="getSkuProps(p)"
                :value="p.id"
                :disabled="p.stock === 0"
              />
            </el-select>
          </ClientOnly>
        </div>
      </div>
      <div class="flex items-end md:mr-4">
        <div class="mr-2 mt-a">
          <small v-if="disable">
            共
            <strong class="text-[var(--el-color-error)]">{{ data.quantity }}</strong>
            件&nbsp;
          </small>
        </div>
        <!-- 金额+运费 -->
        <div class="mt-a hidden flex-col items-end leading-1.2em md:flex">
          <small>{{ data.postage ? `运费：￥${data.postage}` : "免运费" }}</small>
          <small v-if="data">价格：￥{{ getGoodsPrices }}</small>
          <small

            v-if="data.quantity" mt-1
            font-600
          >
            合计：￥{{ getTotalPrice }}
          </small>
        </div>
      </div>
    </div>
    <!-- 数量 -->
    <div class="relative mr-4 flex-row-c-c flex-col md:mr-0 md:w-1/10">
      <slot name="btn">
        <!-- 数量 -->
        <el-input-number
          v-if="!disable"
          v-model="data.quantity"
          :min="1"
          :max="99"
          style="width: 5rem"
          :disabled="disable"
          size="small"
        />
        <span
          v-else
          class="font-700 opacity-40"
        >
          选中
        </span>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.is-event {

  &::before {
    content: "活动";
    position: absolute;
    left:-2rem;
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    box-shadow:4px 3px 8px rgba(194, 52, 52, 0.24) ;
    transform: rotate(-45deg) translate(0.1rem, -0.8rem);
    background-color: var(--el-color-error);
    color: #fff;
    display: block;
    z-index: 1;
    text-align: center;
    border: 1px solid #fff;
    border-left: 0;
    border-right: 0;
  }
}
</style>
