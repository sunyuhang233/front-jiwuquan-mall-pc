<script lang="ts" setup>
import { type CategoryVO, getGoodsCategoryList } from "~/composables/api/goods/category";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";

const { data } = await getGoodsCategoryList();
const categoryList = data.value?.data || [];
// 跳转对应分类
function toView(item: CategoryVO) {
  navigateTo({
    path: "/search",
    query: {
      cname: item.name,
      cid: item.id,
    },
  });
}
</script>

<template>
  <div class="category-list">
    <h3 class="title" pl-1 dark:text-amber-4>
      热门分类
      <i i-solar:adhesive-plaster-bold-duotone ml-4 bg-yellow-4 p-3 />
    </h3>
    <el-scrollbar z-0 overflow-x-scroll tracking-0.1em style="width: 100%">
      <div class="scroll flex flex-nowrap">
        <div v-for="p in categoryList" :key="p.id" class="relative my-4 mr-4 flex-row-c-c">
          <!-- 一级 -->
          <el-button
            size="large" class="first" style="position: relative; width: 9em; height: 4.6em; line-height: 100%"
            flex-row-c-c inline-flex @click="toView(p)"
          >
            <img
              loading="lazy" :src="`${BaseUrlImg + p.icon}?imageView2/0/w/100/format/webp/interlace/1/q/50`"
              :alt="p.name" style="width: 9em; height: 4.6em; object-fit: cover" absolute left-0 top-0 z-0 rounded-4px
              opacity-85
            >
            <h3 z-1 text-light>
              {{ p.name }}
            </h3>
          </el-button>
          <!-- 二级 -->
          <el-button
            v-for="k in p?.children" :key="k.id" type="primary"
            style="position: relative; width: 9em; height: 4.6em; line-height: 100%" plain mx-0 my-2 flex-row-c-c
            @click="toView(k)"
          >
            <img
              loading="lazy" :src="BaseUrlImg + k.icon" :alt="k.name"
              style="width: 100%; height: 100%; object-fit: cover" absolute left-0 top-0 z-0 rounded-4px opacity-85
            >
            <h3 z-1 text-light>
              {{ k.name }}
            </h3>
          </el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss"></style>
