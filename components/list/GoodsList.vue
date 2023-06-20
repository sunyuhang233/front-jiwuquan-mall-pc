<script lang="ts" setup>
import { type GoodsPageDTO } from "@/composables/api/goods";
import { getGoodsListByPage } from "@/composables/api/goods";
import { IPage } from "~/types";
import { GoodsVO } from "~/types/goods";

// props
const props = defineProps<{
  dto: GoodsPageDTO;
}>();

const errReCount = ref<number>(0);
const isLoadCard = ref<boolean>(false);
const isLoadMore = ref<boolean>(false);
// 商品列表
const goodsList = ref<GoodsVO[]>([]);
// 分页器
const page = ref<number>(1);
const size = ref<number>(10);
let pageInfo = reactive<IPage<GoodsVO>>({
  records: [],
  total: 0,
  pages: 0,
  size: 0,
  current: 0,
});
const loadGoodsPage = async () => {
  isLoadCard.value = true;
  // 页面结束
  if (pageInfo.total > goodsList.value.length) return isLoadCard.value = false;
  page.value++;
  const { data, code } = await getGoodsListByPage(page.value, size.value, props.dto);
  // 错误重试尝试
  if (code !== StatusCode.SUCCESS && errReCount.value < 3) {
    errReCount.value++;
    setTimeout(() => {
      loadGoodsPage();
    }, 1000);
  }
  // 展示结果
  pageInfo = toReactive({ ...data });
  data?.records.forEach(p => {
    p.images = typeof p.images === "string" ? p.images.split(",") : [];
    goodsList.value.push(p);
  });
};
loadGoodsPage();
</script>
<template>
  <div
    class="goods-list"
    overflow-hidden
    flex
    flex-wrap
  >
    <CardGoodsBox
      class="mx-2.4 my-5 transition-300"
      :goods="p"
      :key="p.id"
      v-for="p in goodsList"
    />
  </div>
</template>
<style scoped lang="scss"></style>
