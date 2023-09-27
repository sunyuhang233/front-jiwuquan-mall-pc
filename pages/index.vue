<script lang="ts" setup>
import { appName } from "@/constants";

// 定义页面元数据
definePageMeta({
  key: route => route.path,
  layout: false,
});
useHead({
  title: `${appName} - 开启你的极物之旅 ✨`,
  meta: [
    {
      name: "description",
      content: "极物圈-主页 开启你的极物之旅！",
    },
  ],
});
</script>

<template>
  <div>
    <NuxtLayout name="main">
      <div class="py-0 layout-default">
        <div
          flex
          flex-col
        >
          <!-- 顶部菜单 -->
          <IndexTopMenu w-full />
          <div
            w-full flex flex-col transition-300 md:flex-row
          >
            <!-- 轮播图 -->
            <IndexSwiperList
              class="my-6 aspect-ratio-1.48 w-full flex-shrink-0 md:mr-a md:h-420px md:w-620px"
            />
            <!-- 热门商品 -->
            <IndexHotGoodsList
              mx-0 my-6 flex-shrink-0
            />
          </div>
          <!-- 热门商品分类 -->
          <IndexCategoryLine class="mt-6 md:my-8" />
          <!-- 商品列表tabs -->
          <IndexGoodsTabs
            mb-10vh mt-4 min-h-50vh
          />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss"></style>
