<script lang="ts" setup>
import { getEventsLists } from "~/composables/api/event";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
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
const toEventDetailView = (event: EventVO) => {
  useRouter().push({
    path: "/event/detail",
    query: {
      eid: event.id,
    },
  });
};

// 计算剩余天数
const getEndDay = computed(() => {
  return (a: string, b: string): number => {
    let newDate = new Date().getTime();
    let start = Date.parse(a);
    let end = Date.parse(b);
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
    rounded-6px
    overflow-hidden
    cursor-pointer
    class="swpier"
  >
    <swiper
      :grabCursor="true"
      class="w-full h-full transition-1000"
      :effect="'creative'"
      :draggable="true"
      :loop="true"
      :mousewheel="true"
      :speed="500"
      :pagination="{
        clickable: true,
      }"
      :resistanceRatio="0.8"
      :creativeEffect="{
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
        @click="toEventDetailView(p)"
        :key="p.id"
        lazy
        class="bg-white dark:bg-dark-4 swiper-item"
      >
        <!-- 图片 -->
        <el-image
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
                w-sm
                p-30
                pt-20
                opacity-80
                flex-row-c-c
              />
            </div>
          </template>
        </el-image>
        <!-- 文本 -->
        <section
          class="tip px-5 py-3 tracking-0.2em text-xs line-height-none md:text-1em md:line-height-normal flex flex-col justify-around"
        >
          <h3 class="title">{{ p.title }}</h3>
          <!-- 已经结束 -->
          <p
            opacity-80
            v-if="getEndDay(p.startTime, p.endTime) < 0"
            style="text-decoration: line-through"
          >
            活动已经结束
          </p>
          <!-- 即将开始 -->
          <p
            opacity-80
            v-if="getEndDay(p.startTime, p.endTime) === 0"
            style="color: var(--el-color-success)"
          >
            活动即将开始
          </p>
          <!-- 正在进行 -->
          <p
            opacity-80
            v-else-if="getEndDay(p.startTime, p.endTime) > 0"
          >
            距离结束还有：
            <strong
              text-lg
              style="color: var(--el-color-error)"
            >
              {{ getEndDay(p.startTime, p.endTime) }}
            </strong>
            天
            <small class="cursor-pointer float-right opacity-60 ml-a">更多</small>
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
