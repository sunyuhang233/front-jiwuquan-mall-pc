<template>
  <el-tabs class="goods-tabs" :stretch="true" tab-position="top" v-model="activeMenu" @tab-change="changMenu">
    <el-tab-pane name="isNew" label="新品上架">
      <ListGoodsList/>
    </el-tab-pane>
    <el-tab-pane name="isHot" label="热卖好物">

    </el-tab-pane>
    <el-tab-pane name="isViews" label="多人围观">

    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { GoodsPageDTO, getGoodsListByPage } from "@/composables/api/goods";
import { IPage } from "~/types";
import { GoodsVO } from "~/types/goods";
const activeMenu = ref<string>("isNew");
const option = reactive<GoodsPageDTO>({
  name: "",
  isPostage: undefined,
  priceSort: undefined,
  viewsSort: undefined,
  saleSort: undefined,
  isNew: undefined
});
const changMenu = (val: any) => {
  switch (val) {
    case "isNew":
      ElMessage.success("新品");
      break;
    case "isHot":
      ElMessage.success("热卖好物");
      break;
    case "isSale":
      ElMessage.success("新品");
      break;
    case "isViews":
      ElMessage.success("多人围观");
      break;
  }
 
}
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
.goods-tabs {

  :deep(.tabs__item) {
    padding: 1em 2em;
  }
}
</style>
