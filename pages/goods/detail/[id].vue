<script lang="ts" setup>
import { addGoodsViewsById, getGoodsInfoById } from "~/composables/api/goods";
import { getGoodsSkuByGid } from "~/composables/api/goods/sku";
const route = useRoute();
const user = useUserStore();
// 商品id
const goodsId = route.params.id;
// 商品详细信息
// const reqGoodsInfo = getGoodsInfoById(goodsId.toString());
const goodsInfo = await getGoodsInfoById(goodsId.toString());

// 规格信息
// const reqGoodsSku = getGoodsSkuByGid(goodsId.toString());
const goodsSku = await getGoodsSkuByGid(goodsId.toString());

// 修改轮播图活动页面
const goodsSwiper = ref();
// 设置对应规格图片
const setActive = (name: string) => {
  goodsSwiper?.value?.setActiveItem(name);
};

// 商品介绍图和处理
const goodsImages = computed(() => {
  const set = new Set<string>();
  if (goodsInfo.data.value?.data && goodsInfo.data.value?.data.images) {
    goodsInfo.data.value.data.images = goodsInfo.data.value?.data.images.toString().split(",");
  }
  goodsSku.data.value?.data.forEach((p) => {
    if (p.image) {
      set.add(p.image);
    }
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
  if (user.isLogin) {
    await addGoodsViewsById(goodsId.toString(), user.getToken);
  }
});

// 定义当前页面
useSeoMeta({
  title: "极物 " + goodsInfo.data.value?.data?.name,
  description: () =>
    `${goodsInfo.data.value?.data?.name}+${goodsInfo.data.value?.data?.description}`,
});

// 定义页面元数据
definePageMeta({
  key: (route) => route.path,
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
          class="top"
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
            class="swiper ml-0em flex-2"
            w-500px
            :images="goodsImages"
            :video="goodsInfo.data.value?.data?.video"
            :goods-name="goodsInfo.data.value?.data?.name"
            ref="goodsSwiper"
          />
          <!-- 规格和购物车、购买 -->
          <div class="z-1 w-full mt-2rem md:w-1/3">
            <GoodsSkuCard
              :goods-info="goodsInfo.data.value?.data"
              :goods-sku="goodsSku.data.value?.data"
              @set-active-item="setActive"
            />
          </div>
        </div>
        <!-- 商品详情 -->
        <div
          w-full
          flex
          flex-wrap
          justify-between
          border-default
          border-0
          mt-5rem
          border-t="2px solid"
          class="bottom"
        >
          <!-- 详情tabs -->
          <div class="left w-full md:w-2/3 pt-3rem">
            <h2 tracking-0.1em>
              <i
                i-solar:bolt-outline
                bg-amber
                p-3.5
                mr-2
              ></i>
              商品介绍
            </h2>
            <GoodsDetailTabs
              class="w-full md:w-680px mt-10 overflow-hidden rounded-4px dark:opacity-90 min-h-800px shadow-sm"
              :goods-info="goodsInfo.data.value?.data"
              :sku-list="goodsSku.data.value?.data"
            />
          </div>
          <!-- 猜你喜欢 -->
          <div class="w-full md:w-1/3 pt-3rem">
            <h2
              tracking-0.1em
              mb-0.8em
            >
              <i
                i-solar:bomb-emoji-outline
                bg-lime
                p-4
                mr-2
              ></i>
              猜你喜欢
            </h2>
            <ListGoodsList
              :class="'grid grid-cols-2 grid-gap-4'"
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
