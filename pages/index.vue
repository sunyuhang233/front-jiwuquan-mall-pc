<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})
</script>
<template>
  <NuxtLayout>
    <div class="index" mx-a >
      <div class="top" overflow-x-hidden layout-default>
        <!-- 顶部导航 -->
        <IndexTopMenu />
        <div flex justify-center 
          md:justify-between 
          lg:items-start flex-wrap 
          lg:flex-nowrap mt-2>
          <!-- 分类 -->
          <div mr-3>
            <IndexCategory />
          </div>
          <!-- 轮播图 -->
          <IndexSwiper />
          <!-- 热门商品 -->
          <div ml-3>
            <IndexHotGoodsList />
          </div>
        </div>
      </div>
      <div class="bottom" 
      overflowx-hidden
      min-h-80vh
      >
      <div mt-6 layout-default>
        <!-- 热门商品分类 -->
        <IndexCategoryLine />
          <!-- 商品列表tabs -->
          <IndexGoodsTabs />
          <!-- 购物车 -->
          <div class="shop-card" overflow-hidden>
            <IndexShopCartBar />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
 
</style>
