<script lang="ts" setup>
import { getEventsLists } from "~/composables/api/event";

// 活动事件列表
const eventList = reactive<EventVO[]>([]);
// 请求
const { data, refresh } = await getEventsLists();
if (data.value && data.value.code === StatusCode.SUCCESS) {
  // 结束时间排序
  const res = data.value.data.sort((a, b) => b.status - a.status);
  res.forEach((p) => {
    eventList.push(p);
  });
}
// 跳转详情页
function toEventDetailView(event: EventVO) {
  useRouter().push({
    path: "/event/detail",
    query: {
      eid: event.id,
    },
  });
}

// 计算剩余天数
const getEndDay = computed(() => {
  return (a: string, b: string): number => {
    const newDate = new Date().getTime();
    const start = Date.parse(a);
    const end = Date.parse(b);
    if (start > newDate) {
      // 未开始
      return 0;
    }
    if (end < newDate) {
      // 结束
      return -1;
    }
    return +((end - newDate) / (1 * 24 * 60 * 60 * 1000)).toFixed(0);
  };
});
</script>

<template>
  <div


    cursor-pointer overflow-hidden rounded-6px
    class="swpier"
  >
    <swiper
      :grab-cursor="true"
      class="h-full w-full transition-1000"
      effect="creative"
      :draggable="true"
      :loop="true"
      :mousewheel="true"
      :speed="500"
      :pagination="{
        clickable: true,
      }"
      :resistance-ratio="0.8"
      :creative-effect="{
        prev: {
          shadow: true,
          translate: ['-20%', 0, -1],
          opacity: 0,
        },
        next: {
          translate: ['100%', 0, 0],
          opacity: 0,
        },
      }"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :modules="[
        SwiperAutoplay,
        SwiperPagination,
        SwiperController,
        SwiperEffectCreative,
        SwiperMousewheel,
      ]"
    >
      <swiper-slide
        v-for="p in eventList"
        :key="p.id"
        lazy
        class="swiper-item bg-white dark:bg-dark-4"
        @click="toEventDetailView(p)"
      >
        <!-- 图片 -->
        <el-image
          loading="lazy"
          :src="BaseUrlImg + p.images"
          :alt="p.details"
          class="e-img"
          style="width: 100%; height: 100%"
          fit="fill"
        >
          <template #error>
            <div
              class="image-slot"
              flex-row-c-c
            >
              <ElIconPicture


                w-sm flex-row-c-c p-30 pt-20 opacity-80
              />
            </div>
          </template>
        </el-image>
        <!-- 文本 -->
        <section
          class="tip flex flex-col justify-around px-5 py-3 text-xs line-height-none tracking-0.2em md:text-1em md:line-height-normal"
        >
          <h3 class="title">
            {{ p.title }}
          </h3>
          <!-- 已经结束 -->
          <p
            v-if="getEndDay(p.startTime, p.endTime) < 0"
            opacity-80
            style="text-decoration: line-through"
          >
            活动已经结束
          </p>
          <!-- 即将开始 -->
          <p
            v-if="getEndDay(p.startTime, p.endTime) === 0"
            opacity-80
            style="color: var(--el-color-success)"
          >
            活动即将开始
          </p>
          <!-- 正在进行 -->
          <p
            v-else-if="getEndDay(p.startTime, p.endTime) > 0"
            opacity-80
          >
            距离结束还有：
            <strong
              text-lg
              style="color: var(--el-color-error)"
            >
              {{ getEndDay(p.startTime, p.endTime) }}
            </strong>
            天
            <small class="float-right ml-a cursor-pointer opacity-60">更多</small>
          </p>
        </section>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped lang="scss">
.dark .swpier {
  opacity: 0.95;
  background-color: transparent;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.swpier {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.ske {
  width: 100%;
  height: 100%;
  border-radius: 6px;

  .sk-imgs {
    width: 100%;
    height: 80%;
    transition: $transition-delay;
  }
}

.swiper-item {
  width: 100%;
  height: 100%;

  :deep(img) {
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
.swpier:hover {
  :deep(.swiper-pagination) {
    height: 2em;
  }
}
//  指示器
:deep(.swiper-pagination) {
  display: flex;
  bottom: 20%;
  position: absolute;
  height: 0;
  overflow: hidden;
  transition: $transition-delay;
  align-items: center;
  backdrop-filter: blur(2em);
  padding: 0 0.8rem;
  background-color: #9696966e;
  .swiper-pagination-bullet {
    width: 3em;
    height: 0.5em;
    transition: $transition-delay;
    border-radius: 2px;
    background-color: var(--el-color-info);
    backdrop-filter: blur(2em);
    margin: 0 0.4rem;
  }
}
</style>
