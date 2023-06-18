<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})
</script>
<template>
  <NuxtLayout>
    <div class="index" overflow-x-hidden layout-default>
      <!-- logo+search -->
      <IndexTopMenu />
      <div class="center" flex lg:items-start flex-wrap mt-40px>
        <!-- 分类 -->
        <IndexCategory />
        <!-- 轮播图 -->
        <IndexSwiper />
        <!-- 热门商品 -->
        <IndexHotGoodsList/>
      </div>
      <IndexCategoryLine />
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss"></style>
