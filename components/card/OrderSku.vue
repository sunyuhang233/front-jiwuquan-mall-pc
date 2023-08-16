<script lang="ts" setup>
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import { GoodsSkuMdVO, GoodsSkuVO, getGoodsSkuByGid } from "~/composables/api/goods/sku";
import { PushOrdersItemDTO } from "~/composables/api/orders/index";
import currency from "currency.js";
const { data, disable } = defineProps<{
  data: PushOrdersItemDTO & GoodsSkuMdVO;
  disable: boolean;
}>();
const isUpdateLoading = ref<boolean>(false);
const isLoading = ref<boolean>(true);
// 商品规格信息
const skuList = ref<GoodsSkuVO[]>([]);
// 加载规格列表
const loadGoodSkuList = async (val: boolean) => {
  if (val && isLoading.value) {
    const res = await getGoodsSkuByGid(data.goodsId);
    setTimeout(() => {
      res.data.value?.data.forEach((p) => skuList.value.push(p));
      isLoading.value = false;
    }, 300);
  }
};
// 计算规格全部属性
const getSkuProps = (goodsSku: GoodsSkuVO) => {
  return (goodsSku.size || "") + " " + (goodsSku.color || "") + " " + (goodsSku.combo || "");
};
// 规格属性计算
const getProps = computed({
  get() {
    return (data.size || "") + " " + (data.color || "") + " " + (data.combo || "");
  },
  set(skuId: string) {
    const p = toRaw(skuList.value.find((p) => p.id === skuId));
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
    class="card group"
    flex
    justify-between
    flex-wrap
    cursor-pointer
    p-0
    md:p-3
    text-0.6rem
    md:text-1em
    rounded-8px
    border-default-hover
    border-2px
  >
    <!-- 图片 -->
    <ClientOnly>
      <div class="w-2/7 md:w-8em">
        <ElImage
          loading="lazy"
          hover:transform-scale-110
          transition-300
          :src="BaseUrlImg + data.image"
          style="width: 100%; height: 100%; aspect-ratio: 1/1; border-radius: 4px"
          fit="cover"
        />
      </div>
    </ClientOnly>
    <!-- 商品名称|规格 -->
    <div class="flex py-2 justify-between overflow-hidden truncate flex-1">
      <div class="h-full left px-4 group flex flex-col items-start justify-between">
        <h4 class="max-w-1/1 md:max-w-16em overflow-hidden truncate">
          {{ data.name }}
        </h4>
        <!-- 中下 -->
        <p
          font-700
          color-red-6
          mt-1
          mb-a
        >
          ￥{{ currency(data.price) }}
          <span
            color-coolgray
            text-0.6em
            style="text-decoration: line-through"
          >
            ￥{{ currency(data.costPrice) }}
          </span>
        </p>
        <!-- 下 -->
        <div
          flex-row-bt-c
          class="mt-2"
        >
          <!-- 规格 -->
          <ClientOnly>
            <el-select
              :disabled="disable"
              no-data-text="暂无其他规格！"
              @visible-change="loadGoodSkuList"
              loading-text="加载中..."
              :loading="isLoading"
              v-model="getProps"
              :placeholder="getProps"
              collapse-tags-tooltip
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
      <div class="md:mr-4 flex items-end">
        <div class="mt-a mr-2">
          <small v-if="disable">
            共
            <strong class="text-[var(--el-color-error)]">{{ data.quantity }}</strong>
            件&nbsp;
          </small>
        </div>
        <!-- 金额+运费 -->
        <div class="leading-1.2em hidden md:flex flex-col mt-a items-end">
          <small>{{ data.postage ? `运费：￥${data.postage}` : "免运费" }}</small>
          <small v-if="data">价格：￥{{ getGoodsPrices }}</small>
          <small
            font-600
            mt-1
            v-if="data.quantity"
          >
            合计：￥{{ getTotalPrice }}
          </small>
        </div>
      </div>
    </div>
    <!-- 数量 -->
    <div class="flex-row-c-c flex-col mr-4 md:mr-0 md:w-1/10 relative">
      <slot name="btn">
        <!-- 数量 -->
        <el-input-number
          :min="1"
          :max="99"
          style="width: 5rem"
          v-model="data.quantity"
          :disabled="disable"
          size="small"
          v-if="!disable"
        />
        <span
          class="font-700 opacity-40"
          v-else
        >
          选中
        </span>
      </slot>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
