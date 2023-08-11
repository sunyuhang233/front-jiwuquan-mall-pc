<script lang="ts" setup>
useHead({
  title: "极物圈",
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
    <NuxtLayout name="default">
      <div class="layout-default py-0">
        <div
          flex
          flex-col
        >
          <!-- 顶部菜单 -->
          <IndexTopMenu w-full />
          <div
            flex
            flex-col
            md:flex-row
            w-full
          >
            <!-- 轮播图 -->
            <IndexSwiperList
              class="my-6 w-full md:mr-a md:w-620px h-260px md:h-420px aspect-ratio-1.48"
            />
            <!-- 热门商品 -->
            <IndexHotGoodsList
              my-6
              mx-0
            />
          </div>
          <!-- 热门商品分类 -->
          <IndexCategoryLine class="mt-6 md:my-8" />
          <!-- 商品列表tabs -->
          <IndexGoodsTabs mt-4 />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss"></style>
