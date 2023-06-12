<script lang="ts" setup>
import { getEventsList } from '~/composables/api/event';


// 活动事件列表
const eventList = reactive<EventVO[]>([]);
const isLoading = ref<boolean>(true);

(async () => {
  let { data } = await getEventsList()
  if (data.code === 20000) {
    const res = data.data.sort((a, b) => a.level - b.level)
    res.forEach(p => {
      eventList.push(p);
    })
    if (eventList.length === data.data.length) {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
  }
})()


</script>
<template>
  <el-carousel :interval="8000" height="420px" arrow="hover" w="670px" class="swpier" trigger="click" shadow="md  ">
    <!-- 骨架屏 -->
    <el-skeleton animated :loading="isLoading" class="ske ">
      <template #template>
        <el-skeleton-item p-4 variant="image" class="sk-imgs" p-2 />
        <div p-4 px-8>
          <el-skeleton-item class="p-1 m-1" variant="p" style="width: 70%" />
          <el-skeleton-item class="p-1 m-1" variant="p" style="width: 100%" />
        </div>
      </template>
      <!-- 内容 -->
      <template #default>
        <!-- 轮播图项 -->
        <el-carousel-item v-for="p in eventList" :key="p.id" class="swiper-item">
          <!-- 图片 -->
          <el-image :src="baseUrlImg + p.images" :alt="p.details" class="e-img" style="width: 100%;height: 100%;"
            fit="fill">
            <template #error>
              <div class="image-slot">
                <ElIconPicture />
              </div>
            </template>
          </el-image>
          <!-- 文本 -->
          <div class="tip" px-4 py-2>
            <h3 class="title" py-2>{{ p.title }}</h3>
            <p opacity-65>时间：{{ p.createTime }} - {{ p.createTime }}
              <span cursor-pointer float-right opacity-60>更多</span>
            </p>
          </div>
        </el-carousel-item>
      </template>
    </el-skeleton>
  </el-carousel>
</template>
<style scoped lang="scss"> .dark .swpier {
   opacity: 0.86;
   background-color: #0f0f0f;
 }

 .swpier {
   background-color: #bebebe34;
   border-radius: 10px;
   overflow: hidden;
 }

 .ske {
   width: 100%;
   height: 100%;
   border-radius: 10px;
   overflow: hidden;

   .sk-imgs {
     transition: $transition-delay;
     width: 100%;
     height: 80%;
   }
 }

 .swiper-item {
   width: 100%;
   height: 100%;
   backdrop-filter: blur(3px);

   :deep(img) {
     border-radius: 6px;
     height: 80%;
   }

   .tip {
     width: 100%;
     height: 20%;
     position: absolute;
     bottom: 0;
     z-index: 10;
   }

 }

 //  指示器
 :deep(.el-carousel__indicators) {
   left: 20px;
   bottom: 22%;
   transform: translateX(0);

   li .el-carousel__button {
     height: 5px;
     border-radius: 2px;

     &.is-active {
       background-color: var(--el-color-primary);
     }
   }
 }
</style>
