<template>
  <div class="hot-list" mx-a md:ma-0 pl-4>
    <h3 pl-1 pb-3>热门商品
      <span p-3 bg-red-6 mx-2 i-solar:fire-bold></span>
    </h3>
    <ElScrollbar height="360">
      <NuxtLink :to="`/goods/detail?id=${p.id}`" class="mt-2  animate__animated animate__fadeIn"
        v-for="(p, i) in hotGoodsList" :key="p.id">
        <!-- 商品卡片 -->
        <CardGoodsLine :goods="p" :key="p.id" class="card">
          <template #btn>
            <!-- 立即购买 -->
            <div opacity-0 class="item" float-right>
              <el-button group:hover:block type="danger" style="padding: 0 1em;"><nuxt-link to=""
                  style="font-size: 10px;">前往购买</nuxt-link></el-button>
            </div>
          </template>
        </CardGoodsLine>
        <ElDivider dark:opacity-50 v-if="i !== (hotGoodsList.length - 1)"
          style="width: 100%;margin: 0.6em auto;margin-bottom: 0.8em; " />
      </NuxtLink>
    </ElScrollbar>
  </div>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from "@/composables/api/goods";
import { useStorage } from "@vueuse/core";
import { IPage } from "~/types";
import { GoodsVO } from "~/types/goods";
// 搜索相关
let searchPage = reactive<IPage<GoodsVO>>({
  records: [],
  total: 0,
  pages: 0,
  size: 0,
  current: 0
});
const hotGoodsList = reactive<GoodsVO[]>([]);
// 分页器
const isLoading = ref<boolean>(false);
const page = ref<number>(1)
const size = ref<number>(6)
const noMore = computed(() => searchPage.total > 0 && hotGoodsList.length === searchPage.total)
// 搜索历史 本地存储
let searchHistoryList = useStorage<string[]>("jiwu_index_search", []);
/**
 * 搜索商品
 */

isLoading.value = true;
// 清空
page.value = 1
size.value = 8
hotGoodsList.splice(0);
searchPage = toReactive({
  records: [],
  total: 0,
  pages: 0,
  size: 0,
  current: 0
});

const { data } = await getGoodsListByPage(page.value, size.value, {viewsSort:Sort.DESC,saleSort:Sort.DESC});
const pageData = data.data;
// 展示结果
searchPage = toReactive({ ...pageData });
pageData.records?.forEach(p => {
  p.images = typeof p.images === "string" ? p.images.split(",") : [];
  hotGoodsList.push(p);
});

// searchKeyWords.value = ""
setTimeout(() => {
  isLoading.value = false;
}, 500);  
</script>

<!-- 样式scss -->
<style scoped lang="scss">
.card {
  &:hover {
    .item {
      transition: $transition-delay;
      opacity: 1;
    }
  }
}
</style>
