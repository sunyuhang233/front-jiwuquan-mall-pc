<script lang="ts" setup>

</script>

<template>
  <NuxtLayout>
    <div class="index " p="y-6 x-4">
      <!-- logo -->
      <IndexTop />
      <!-- 分类 -->
      <!-- 轮播图 -->
      <IndexSwiper scale-80 origin-tl lg:scale-100 mt-0px lg:mt-20px mx-20px lg:mx-100px />
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.index {
  width: 70%;
  margin: 0 auto;
}
</style>
