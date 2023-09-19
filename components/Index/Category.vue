<script lang="ts" setup>
import { type CategoryVO, getGoodsCategoryList } from "~/composables/api/goods/category";

// 加载
const isLoading = ref<boolean>(true);
// 分类列表
const { data, refresh } = await getGoodsCategoryList();
const categoryList = ref<CategoryVO[]>(data.value?.data || []);
isLoading.value = false;
// 跳转查询分类
function toView(item: CategoryVO) {
  navigateTo({
    path: "/search",
    query: {
      cid: item.id,
    },
  });
}
</script>

<template>
  <div class="catgory">
    <!-- 骨架屏 -->
    <el-skeleton :rows="6" animated :loading="isLoading" :throttle="200" />
    <ClientOnly>
      <!-- 滚动 -->
      <el-scrollbar
        :always="false" border="1px dashed gray-200" dark:border="1px dashed dark-200"
        class="category" max-h-400px min-h-380px w-360px overflow-scroll rounded-6px p-4 tracking-0.1em
        flex="col wrap"
      >
        <h3>
          商品分类
          <i i-solar:bag-3-bold ml-2 bg-yellow-4 p-3 />
        </h3>
        <div v-for="(p) in categoryList" :key="p.id" my-4 type="warning">
          <h4 class="first" mr-2 block style="line-height: 100%;" @click="toView(p)">
            {{ p.name }}
          </h4>
          <el-button
            v-for="(k) in p?.children" :key="k.id" type="primary" plain style="margin: 0.2em 0.5em 0.2em 0; padding: 0 0.8em; cursor: pointer;"
            @click="toView(k)"
          >
            {{ k.name }}
          </el-button>
        </div>
      </el-scrollbar>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss"></style>
