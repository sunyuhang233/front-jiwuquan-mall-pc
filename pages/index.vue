<script lang="ts" setup>

</script>

<template>
  <NuxtLayout>
    <div class="index " p="y-6 x-4">
      <!-- logo -->
      <IndexTop />
      <div class="center" flex-row>
        <!-- 分类 -->
        <IndexCategory />
        <!-- 轮播图 -->
        <IndexSwiper scale-80 origin-tl lg:scale-100 />
      </div>

    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.index {
  width: 76%;
  margin: 0 auto;
}
</style>
