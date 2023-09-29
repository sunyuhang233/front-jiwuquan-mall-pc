<script lang="ts" setup>
const { goodsName, images, video } = defineProps<{
  goodsName?: string
  images: string[]
  video?: string
}>();
// 打开视频播放
const isOpenVideo = ref<boolean>(false);
async function openVideo() {
  const video = document.querySelector(".videoRef");
  if (video) {
    isOpenVideo.value = true;
    // @ts-expect-error
    if (video.requestFullscreen) {
      // video.requestFullscreen();
    }
  }
}
// 预览图片
const getImagesPreview = computed(() => {
  return images.map(p => (p = BaseUrlImg + p));
});
// 轮播图
const swiper = ref();
const activeSmall = ref<string>(images[0] || "");
function setActiveItem(name: string) {
  swiper.value?.setActiveItem(name);
  activeSmall.value = name;
}
function changeSwiper(current: number) {
  activeSmall.value = images[current];
}
const nextSwiper = () => swiper.value?.next();
const prevSwiper = () => swiper.value?.prev();

// 暴露部分方法
// https://cn.vuejs.org/api/sfc-script-setup.html#defineexpose
defineExpose({
  setActiveItem,
  nextSwiper,
  prevSwiper,
  activeSmall,
});

// /选项语法
defineComponent({
  setActiveItem,
  nextSwiper,
  prevSwiper,
  activeSmall,
});
</script>

<template>
  <div class="swiper">
    <el-carousel
      ref="swiper"
      indicator-position="none"
      :interval="6000"
      arrow="hover"
      h-400px
      cursor-pointer rounded-4px height="100%"
      trigger="click"
      @change="changeSwiper"
    >
      <!-- 轮播图项 -->
      <el-carousel-item
        v-for="(p, i) in getImagesPreview"
        :key="p"
        :name="p"
        class="swiper-item"
        style="width: 100%"
      >
        <el-image
          :preview-teleported="true"
          loading="lazy"
          :preview-src-list="getImagesPreview"
          :initial-index="i"
          :src="p"
          :alt="goodsName || 'Design By Kiwi23333'"
          style="width: 100%; height: 100%;"
          fit="scale-down"
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
      </el-carousel-item>
    </el-carousel>
    <!-- 预览列表 -->
    <div
      class="scale-imgs"
      mt-4
      flex-row-c-c
    >
      <ElIconArrowLeftBold
        class="mx-1 h-2em w-2em flex-row-c-c cursor-pointer opacity-60"
        @click="prevSwiper"
      />
      <el-image
        v-for="(p, i) in images"
        :key="i"
        preview-teleported
        :preview-src-list="images"
        loading="lazy"
        :class="{ active: activeSmall === p }"
        :src="BaseUrlImg + p"
        :alt="goodsName || 'Design by Kiwi2333'"
        class="scale-img"
        style="max-width: 6em; max-height: 4em; margin: 0 0.4em; padding: 0; border-radius: 4px"
        fit="contain"
        transition-300
        hover:scale-110
        @mouseenter="setActiveItem(p)"
      >
        <template #error>
          <div
            class="image-slot"
            flex-row-c-c
          >
            <ElIconPicture style="opacity: 0.8" />
          </div>
        </template>
      </el-image>
      <ElIconArrowRightBold
        class="mx-1 h-2em w-2em flex-row-c-c cursor-pointer opacity-60"
        @click="nextSwiper"
      />
    </div>
    <!-- 打开视频 -->
    <small
      v-if="video"
      class="mx-a my-2 w-6em flex-row-c-c cursor-pointer rounded-2em bg-gray-200 p-2 leading-1.2em shadow-md transition-200 hover:scale-110 dark:bg-dark-200"
      @click="isOpenVideo = true"
    >
      <i
        i-solar:clapperboard-play-bold mr-1 p-2.4
      />
      视频
    </small>
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isOpenVideo"
          class="mock"
          @click.self="isOpenVideo = false"
        >
          <!-- 视频播放 -->
          <video
            :key="video"
            class="videoRef w-80vw md:w-40vw"
            :src="BaseUrlVideo + video"
            :alt="goodsName || ' By Kiwi23333'"
            :name="video"
            controls
          />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.scale-imgs {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;

  .scale-img {
    opacity: 0.8;
    border: 2px solid transparent;
    transition: $transition-delay;
  }
  .scale-img.active,
  .scale-img:hover {
    opacity: 1;
    border: 2px solid var(--el-color-primary);
  }
}
.mock {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  z-index: 2000;
  justify-content: center;
  align-items: center;
  background-color: #5252528a;
}
</style>
