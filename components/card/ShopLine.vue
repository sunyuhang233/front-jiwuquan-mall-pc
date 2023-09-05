<script lang="ts" setup>
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import { ShopcartVO, updateShopcart } from "~/composables/api/shopcart";
import { GoodsSkuVO, getGoodsSkuByGid } from "~/composables/api/goods/sku";
import currency from "currency.js";
const { shopCart } = defineProps<{
  shopCart: ShopcartVO;
}>();
const shop = useShopStore();
const user = useUserStore();
const isUpdateLoading = ref<boolean>(false);
const isLoading = ref<boolean>(true);
// 获取分页信息
const skuList = ref<GoodsSkuVO[]>([]);
const selectShopcartId = ref<string>(shopCart.id);

// 改变规格
watch(
  shopCart,
  (vo: ShopcartVO) => {
    changeUpdateShopcart(vo.skuId, vo.quantity);
  },
  { deep: true }
);

const changeUpdateShopcart = async (skuId: string, quantity: number) => {
  if (isUpdateLoading.value || !quantity) return;
  isUpdateLoading.value = true;
  const data = await updateShopcart(
    selectShopcartId.value,
    {
      skuId,
      quantity,
    },
    user.getToken
  );
  if (data.code != StatusCode.SUCCESS) {
    ElMessage.closeAll();
    ElMessage.error("修改失败，稍后重试！");
  } else {
    shopCart.skuId = skuId;
    shopCart.quantity = quantity;
  }
  const timer = setTimeout(() => {
    isUpdateLoading.value = false;
    clearTimeout(timer);
  }, 300);
};

// 加载规格列表
const loadGoodSkuList = async (val: boolean) => {
  if (val && isLoading.value) {
    const { data } = await getGoodsSkuByGid(shopCart.goodsId);
    setTimeout(() => {
      data.value?.data.forEach((p) => skuList.value.push(p));
      isLoading.value = false;
    }, 300);
  }
};
// 计算规格全部属性
const getSkuProps = (goodsSku: GoodsSkuVO) => {
  return (goodsSku.size || "") + " " + (goodsSku.color || "") + " " + (goodsSku.combo || "");
};

const propsText = ref<string>(
  (shopCart.size || "") + " " + (shopCart.color || "") + " " + (shopCart.combo || "")
);

// 用户
const getProps = computed({
  get() {
    return (shopCart.size || "") + " " + (shopCart.color || "") + " " + (shopCart.combo || "");
  },
  set(skuId: string) {
    const p = toRaw(skuList.value.find((p) => p.id === skuId));
    // 更新
    if (p) {
      shopCart.size = p.size;
      shopCart.image = p.image;
      shopCart.price = p.price;
      shopCart.costPrice = p.costPrice;
      shopCart.color = p.color;
      shopCart.combo = p.combo;
      shopCart.skuId = skuId;
    }
  },
});

// 删除单个
const deleteShopCart = () => {
  ElMessageBox({
    title: "删除提示",
    message: "确定要删除吗？",
    type: "warning",
    showClose: false,
    customClass: "text-center",
    showCancelButton: true,
    cancelButtonText: "取 消",
    confirmButtonText: "删 除",
  })
    .then(async (res) => {
      if (res === "confirm") {
        const flag = await shop.deleteShopCartById(shopCart.id);
        if (flag) {
          ElMessage.success("删除成功！");
        } else {
          ElMessage.error("删除错误，请稍后再试试看！");
        }
      }
    })
    .catch((err) => {});
};

// 跳转详情页
const router = useRouter();
const toGoodsView = (gid: string) => {
  setTimeout(() => {
    navigateTo({
      path: `/goods/detail/${gid}`,
    });
  }, 300);
};
</script>
<template>
  <div
    v-loading="isUpdateLoading"
    p-0
    pr-2
    md:p-4
    class="flex-row-bt-c cursor-pointer rounded-6px mt-2 mb-3 transition-300 border-2px hover:shadow group"
    border-dashed
    border-default
    hover:border="solid [var(--el-color-primary)]"
    dark:hover:bg="dark-1"
  >
    <ClientOnly>
      <ElImage
        loading="lazy"
        @click="toGoodsView(shopCart.goodsId)"
        hover:transform-scale-110
        transition-300
        :src="BaseUrlImg + shopCart.image"
        style="width: 8em; height: 8em; border: 1px solid #eee; border-radius: 4px"
        fit="cover"
      />
    </ClientOnly>
    <div
      px-4
      truncate
      overflow-hidden
      style="width: 78%; height: 100%"
      group
      flex
      flex-col
      items-start
      justify-between
    >
      <h3
        tracking-1px
        max-w-12em
        md:max-w-16em
        class="overflow-hidden truncate ..."
      >
        {{ shopCart.name }}
      </h3>
      <!-- 中下 -->
      <p
        font-700
        color-red-6
        mt-1
        mb-5
      >
        ￥{{ currency(shopCart.price) }}
        <span
          color-coolgray
          text-0.6em
          style="text-decoration: line-through"
        >
          ￥{{ currency(shopCart.costPrice) }}
        </span>
      </p>
      <!-- 下 -->
      <p
        flex-row-bt-c
        class="w-1/1 mt-2"
      >
        <ClientOnly>
          <el-select
            no-data-text="暂无其他规格！"
            @visible-change="loadGoodSkuList"
            loading-text="加载中..."
            :loading="isLoading"
            v-model="getProps"
            :placeholder="getProps"
            collapse-tags-tooltip
            class="mr-2"
            size="small"
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
        <!-- 数量 -->
        <el-input-number
        size="small"
          :min="1"
          :max="99"
          v-model="shopCart.quantity"
        />
      </p>
    </div>
    <div
      flex
      flex-col
      items-center
      flex-1
      relative
    >
      <span
        i-solar:trash-bin-minimalistic-bold-duotone
        p-3
        dark:bg-light
        @click="deleteShopCart"
        transition-300
        absolute
        opacity-0
        group-hover:opacity-80
        style="top: -3em"
      ></span>
      <slot name="btn"></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-input-number) {
  .el-input__inner {
    width: 1em;
  }
}
</style>
