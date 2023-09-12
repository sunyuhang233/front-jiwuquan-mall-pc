<script lang="ts" setup>
// route
const route = useRoute();
// 活动id
const eventId = route.query.eid?.toString();
const list = await getEventsInfo(eventId || "");
if (!eventId || !list.data.value?.data.id)
  showError({ statusCode: 404, statusMessage: "页面找不到 ❌" });

// 无数据
const isNot = computed(() => list.data.value?.data.list.length === 0);

useSeoMeta({
  title: `${list.data.value?.data.title}极物圈`,
  description: () =>
    (list.data.value?.data.details || "")
    + (list.data.value?.data.list.map(p => p.description).join(",") || ""),
});
const getEventStatus = computed(() => {
  if (list.data.value?.data.status === -1) {
    return {
      title: "已结束",
      class: "text-light bg-[var(--el-color-danger)]",
    };
  }
  else if (list.data.value?.data.status === 0) {
    return {
      title: "未开始",
      class: "text-light bg-[var(--el-color-info)]",
    };
  }
  else {
    return {
      title: "进行中",
      class: "text-light bg-[var(--el-color-info)]",
    };
  }
});

// const bgImage = ref();
// // 颜色解析
// const bgColorList = ref<number[]>([]);
// watchDebounced(bgImage, (img) => {
//   if (img) {
//     const colorThief = new ColorThief();
//     if (img.complete) {
//       bgColorList.value = colorThief.getColor(img, 12);
//     } else {
//       img.addEventListener("load", function () {
//         bgColorList.value = colorThief.getColor(img, 12);
//       });
//     }
//   }
// });

definePageMeta({
  key: route => route.path,
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout
      name="main"
      :left-menu="false"
      :header="false"
      :menu="['home', 'back', 'service']"
    >
      <div class="layout-default">
        <div class="v-card mx-a min-h-100vh w-full flex flex-col rounded-10px p-4 shadow md:w-80%">
          <!-- bg -->
          <div class="bg absolute relative left-0 h-300px w-full overflow-hidden rounded-t-10px">
            <img
              :src="BaseUrlImg + list.data.value?.data.images"
              class="-cover h-full w-full"
              style="object-fit: cover"
              crossOrigin="anonymous"
            >
            <div


              absolute left-0 top-0 backdrop-blur-20px
              class="z-1 h-full w-full flex-row-c-c flex-col leading-1.2em text-shadow-lg"
            >
              <h3
                text-light
                class="tip absolute right-0 top-0 w-8em translate-x-10 translate-y-5 rotate-45 p-2 text-center"
                border-t="2px dashed light"
                border-b="2px dashed light"
                :class="getEventStatus.class"
              >
                {{ getEventStatus.title }}
              </h3>
              <!-- 活动名称 -->
              <h2
                text-light
                class="mt-4 cursor-pointer text-center tracking-1 transition-300 hover:scale-106 md:text-3xl"
              >
                {{ list.data.value?.data.title }}
              </h2>
              <small class="my-2 text-[var(--el-color-info)]">
                活动时间：
                <small class="opacity-60">{{ list.data.value?.data.startTime }}</small>
                ~
                <small class="opacity-60">{{ list.data.value?.data.endTime }}</small>
              </small>
            </div>
          </div>
          <!-- 内容 -->
          <section
            v-show="!isNot"
            class="list flex-1 pb-6"
          >
            <h3
              my-6 border-l-0 border-r-0 py-4 text-center border-default
            >
              活动商品
            </h3>
            <div grid="~ cols-2 md:cols-4 gap-4 md:gap-6">
              <NuxtLink
                v-for="p in list.data.value?.data.list"
                :key="p.id"
                :to="`/goods/detail/${p.goodsId}`"
              >
                <EventGoodsEvent
                  :data="p"
                />
              </NuxtLink>
            </div>
          </section>
          <!-- 无活动商品 -->
          <div
            v-show="isNot"
            class="w-full flex-row-c-c flex-1 text-center"
          >
            暂无活动商品
          </div>
          <!-- footer -->
          <section>
            <v-md-preview
              :text="list.data.value?.data.details"
              preview-class="vuepress-markdown-body"
            />
          </section>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss"></style>
