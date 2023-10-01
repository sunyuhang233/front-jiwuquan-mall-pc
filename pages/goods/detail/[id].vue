<script lang="ts" setup>
import type { EventGoodsSeVO } from "~/composables/api/event";
import { addGoodsViewsById, getGoodsInfoById } from "~/composables/api/goods";
import { getGoodsSkuByGid } from "~/composables/api/goods/sku";

const route = useRoute();
const user = useUserStore();
// 商品id
const goodsId = route.params.id as string;
// 商品详细信息
const goodsInfo = await getGoodsInfoById(goodsId.toString());

// 规格信息
const goodsSku = await getGoodsSkuByGid(goodsId.toString());

// 修改轮播图活动页面
const goodsSwiper = ref();
// 设置对应规格图片
function setActive(name: string) {
  goodsSwiper?.value?.setActiveItem(name);
}

// 商品介绍图和处理
const goodsImages = computed(() => {
  const set = new Set<string>();
  if (goodsInfo.data.value?.data && goodsInfo.data.value?.data.images)
    goodsInfo.data.value.data.images = goodsInfo.data.value?.data.images.toString().split(",");
  goodsSku.data.value?.data?.forEach((p) => {
    if (p.image)
      set.add(p.image);
  });
  if (Array.isArray(goodsInfo.data.value?.data?.images)) {
    goodsInfo.data.value?.data?.images.forEach((p) => {
      set.add(p);
    });
  }

  return [...set];
});

// 商品浏览量
useAsyncData(async () => {
  if (user.isLogin)
    await addGoodsViewsById(goodsId.toString(), user.getToken);
});

// 定义当前页面
useSeoMeta({
  title: `极物 ${goodsInfo.data.value?.data?.name}`,
  description: () =>
    `${goodsInfo.data.value?.data?.name}+${goodsInfo.data.value?.data?.description}`,
});


// 定义页面元数据
definePageMeta({
  key: route => route.path,
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout
      name="second"
      :menu="['shopcart', 'back']"
      :left-menu="false"
    >
      <div
        layout-default
        class="goods-detail"
      >
        <div
          class="top pt-2"
          flex
          items-center
        >
          <!-- 树形分类 -->
          <GoodsCategoryTree
            class="left"
            :gid="goodsId.toString()"
            :name="goodsInfo.data.value?.data?.name"
          />
        </div>
        <!-- 内容 -->
        <div
          class="center mt-6"
          flex-row-bt-c
          flex-wrap
        >
          <!-- 商品轮播图 -->
          <GoodsPreSwiper
            ref="goodsSwiper"
            class="flex-2 mx-a mt-4"
            w-500px
            :images="goodsImages"
            :video="goodsInfo.data.value?.data?.video"
            :goods-name="goodsInfo.data.value?.data?.name"
          />
          <!-- 规格和购物车、购买 -->
          <div class="z-1 mt-2rem w-full md:w-1/3">
            <GoodsSkuCard
              :goods-info="goodsInfo.data.value?.data"
              :goods-sku="goodsSku.data.value?.data"
              @set-active-item="setActive"
            />
          </div>
        </div>
        <!-- 商品详情 -->
        <div
          mt-5rem w-full flex flex-wrap justify-between border-0 border-default
          border-t="2px solid"
          class="bottom"
        >
          <!-- 详情tabs -->
          <div class="left w-full pt-3rem md:w-2/3">
            <h2 tracking-0.1em>
              <i
                i-solar:bolt-outline mr-2 bg-amber p-3.5
              />
              商品介绍
            </h2>
            <GoodsDetailTabs
              v-if="goodsSku?.data?.value?.data"
              class="mt-10 min-h-800px w-full overflow-hidden rounded-4px shadow-sm md:w-680px dark:opacity-90"
              :goods-info="goodsInfo.data.value?.data"
              :sku-list="goodsSku.data.value?.data"
            />
            <div v-else class="h-10rem w-full text-center leading-10rem">
              暂无内容
            </div>
          </div>
          <!-- 猜你喜欢 -->
          <div class="w-full pt-3rem md:w-1/3">
            <h2
              mb-0.8em tracking-0.1em
            >
              <i
                i-solar:bomb-emoji-outline mr-2 bg-lime p-4
              />
              猜你喜欢
            </h2>
            <ListGoodsList
              class="grid grid-cols-2 grid-gap-4"
              :dto="{
                name: goodsInfo.data.value?.data?.name[Math.floor(Math.random())],
              }"
              :limit="10"
            />
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.scale-imgs {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: auto;

  .scale-img {
    opacity: 0.8;
    border: 2px solid transparent;
    transition: $transition-delay;
  }
  .scale-img.active,
  .scale-img:hover {
    opacity: 1;
    border: 2px solid var(--el-color-primary);
  }
}
</style>
