<script lang="ts" setup>
import { getEventsList } from '~/server/api/event';


// 活动事件列表
const eventList = reactive<EventVO[]>([]);
const loading = ref<boolean>(true);

(async () => {
  let { data } = await getEventsList()
  if (data.code === 20000) {
    loading.value = false;
    data.data.forEach(p => {
      eventList.push(p);
    })
  }
})()
</script>

<template>
  <el-carousel :interval="5000" arrow="always" w="500px md:650px" h="300px md:400px" class="swiper" trigger="click">
    <!-- 骨架屏 -->
    <el-skeleton w-auto animated :loading="loading" :throttle="400">
      <template #template>
        <el-skeleton-item variant="image" class="w-100per sk-imgs" p-2 />
        <div style="padding: 14px">
          <el-skeleton-item variant="p" style="width: 100%" />
        </div>
      </template>
      <!-- 内容 -->
      <template #default>
        <el-carousel-item v-for="p in eventList" :key="p.id" class="swiper-item">
          <img :src="baseUrlImg + p.images" z-0 :alt="p.details" class="e-img" />
          <p class="tip" bg-dark z-1>{{ p.title }}</p>
        </el-carousel-item>
      </template>
    </el-skeleton>
  </el-carousel>
</template>

<style scoped lang="scss">
.swiper-items {

  .e-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

}
</style>
