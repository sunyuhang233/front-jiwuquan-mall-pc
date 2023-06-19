<template>
  <div class="hot-list" h-380px p-4 mx-a md:ma-0 rounded-4px border="1px solid gray-200" dark:border="1px solid dark-200">
    <div class="bg"></div>
    <h3 px-1 pb-4>热门商品
      <span p-3 bg-red-6 mx-2 i-solar:fire-bold></span>
    </h3>
    <ClientOnly>
      <ElScrollbar height="88%">
        <NuxtLink :to="`/goods/detail?id=${p.id}`" class="mt-2  animate__animated animate__fadeIn"
          v-for="(p, i) in hotGoodsList" :key="p.id">
          <!-- 商品卡片 -->
          <CardGoodsLine :goods="p" :key="p.id" class="card">
            <template #btn>
              <!-- 立即购买 -->
              <div opacity-0 class="item" float-right>
                <el-button group:hover:block type="danger" style="padding: 0 1em;margin-left: 2em;"><nuxt-link to=""
                    style="font-size: 10px;">前往购买</nuxt-link></el-button>
              </div>
            </template>
          </CardGoodsLine>
          <ElDivider dark:opacity-50 v-if="i !== (hotGoodsList.length - 1)"
            style="width: 100%;margin: 0.6em auto;margin-bottom: 0.8em; " />
        </NuxtLink>
        <p v-show="searchPage.total < hotGoodsList.length">加载更多</p>
      </ElScrollbar>
    </ClientOnly>
  </div>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from "@/composables/api/goods";
import { IPage } from "~/types";
import { GoodsVO } from "~/types/goods";

// 分页器
const page = ref<number>(1)
const size = ref<number>(6)
let searchPage = reactive<IPage<GoodsVO>>({
  records: [],
  total: 0,
  pages: 0,
  size: 0,
  current: 0
});
const hotGoodsList = ref<GoodsVO[]>([]);
const { data } = await getGoodsListByPage(page.value, size.value, { viewsSort: Sort.DESC, saleSort: Sort.DESC });
// 展示结果
searchPage = toReactive({ ...data });
data?.records.forEach(p => {
  p.images = typeof p.images === "string" ? p.images.split(",") : [];
  hotGoodsList.value.push(p);
});
</script>

<!-- 样式scss -->
<style scoped lang="scss">
.card {
  .item {
    opacity: 0;
    float: right;
    transform: translateY(40%);
  }

  &:hover {
    .item {
      transition: $transition-delay;
      transform: translateY(0%);
      opacity: 1;
    }
  }
}

.dark .hot-list {
  background-color: rgba(17, 17, 17, 0.712);
}

.hot-list {
  background-color: #ffffff;
  position: relative;
  backdrop-filter: blur(20px);

  .bg {
    position: absolute;
    transform: translate(50%, -50%);
    z-index: -99;
    width: 60%;
    height: 60%;
    opacity: 0.6;
    filter: blur(60px);
    border-radius: 50%;
    background: radial-gradient(104.24% 141.88% at 8.26% 9.64%, #B95BE6 0%, rgba(185, 91, 230, 0.18) 69.92%, rgba(185, 91, 230, 0) 100%), radial-gradient(103.57% 140.97% at 14.06% 105.21%, #F97C59 0%, rgba(249, 124, 89, 0.19) 72.45%, rgba(249, 124, 89, 0) 100%);
  }
}
</style>
