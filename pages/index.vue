<script lang="ts" setup>
</script>
<template>
  <NuxtLayout>
    <div class="index" transition-300 w-90vw md:w-70vw p="y-6 x-4"> 
      <!-- logo+search -->
      <IndexTopMenu />
      <div class="center" flex lg:items-start>
        <!-- 轮播图 -->
        <IndexSwiper />
        <!-- 热门商品 -->
        
      </div>
      <!-- 分类 -->
      <IndexCategory />
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.index {
  margin: 0 auto;
}
</style>
