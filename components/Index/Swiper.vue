<script lang="ts" setup>
import { getEventsList } from '~/server/api/event';

// 活动事件列表
const eventList = reactive<EventVO[]>([]);

(async () => {
  let res = await getEventsList()
  const data = res.data.data
  console.log(data);
  data.forEach(p => {
    eventList.push(p);
  })
})()
</script>

<template>
  <el-carousel :interval="5000" arrow="always" w="xl md:2xl" h="xl md:2xl" class="swiper">
    <el-carousel-item v-for="p in eventList" :key="p.id">
      <ElImage :src="baseUrlImg + p.images"></ElImage>
      {{ p.title }}
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped lang="scss">
.swiper {}
</style>
