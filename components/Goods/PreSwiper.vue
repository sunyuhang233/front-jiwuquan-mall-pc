<script lang="ts" setup>
const { goodsName, images, video } = defineProps<{
  goodsName?: string;
  images: string[];
  video?: string;
}>();
// 打开视频播放
const isOpenVideo = ref<boolean>(false);
const openVideo = async () => {
  let video = document.querySelector(".videoRef");
  if (video) {
    isOpenVideo.value = true;
    // @ts-ignore
    if (video.requestFullscreen) {
      // video.requestFullscreen();
    }
  }
};
// 预览图片
const getImagesPreview = computed(() => {
  return images.map((p) => (p = BaseUrlImg + p));
});
// 轮播图
const swiper = ref();
const activeSmall = ref<string>(images[0] || "");
const setActiveItem = (name: string) => {
  swiper.value?.setActiveItem(name);
  activeSmall.value = name;
};
const changeSwiper = (current: number) => {
  activeSmall.value = images[current];
};
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
      @change="changeSwiper"
      rounded-4px
      cursor-pointer
      :interval="6000"
      arrow="hover"
      h-400px
      height="100%"
      trigger="click"
    >
      <!-- 轮播图项 -->
      <el-carousel-item
        v-for="(p, i) in images"
        :key="p"
        :name="p"
        class="swiper-item"
        style="width: 100%"
      >
        <el-image
          :preview-teleported="true"
          loading="lazy"
          :preview-src-list="getImagesPreview"
          :initial-index="+i"
          :src="BaseUrlImg + p"
          :alt="goodsName || 'Design By Kiwi23333'"
          class="e-img"
          style="width: 100%; height: 100%"
          fit="scale-down"
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
      </el-carousel-item>
    </el-carousel>
    <!-- 预览列表 -->
    <div
      class="scale-imgs"
      mt-4
      flex-row-c-c
    >
      <ElIconArrowLeftBold
        @click="prevSwiper"
        class="w-2em h-2em opacity-60 cursor-pointer flex-row-c-c mx-1"
      />
      <el-image
        @mouseenter="setActiveItem(p)"
        loading="lazy"
        :class="{ active: activeSmall === p }"
        v-for="(p, i) in images"
        :key="i"
        :src="BaseUrlImg + p"
        :alt="goodsName || 'Design by Kiwi2333'"
        class="scale-img"
        style="max-width: 6em; max-height: 4em; margin: 0 0.4em; padding: 0; border-radius: 4px"
        fit="contain"
        transition-300
        hover:scale-110
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
        @click="nextSwiper"
        class="w-2em h-2em opacity-60 cursor-pointer flex-row-c-c mx-1"
      />
    </div>
    <!-- 打开视频 -->
    <small
      @click="isOpenVideo = true"
      v-if="video"
      cursor-pointer
      mx-a
      mt-2
      leading-1.2em
      bg-gray-200
      dark:bg-dark-200
      shadow-md
      p-2
      transition-200
      hover:scale-110
      flex-row-c-c
      w-6em
      rounded-2em
    >
      <i
        i-solar:clapperboard-play-bold
        p-2.4
        mr-1
      ></i>
      视频
    </small>
    <Teleport to="body">
      <transition name="fade">
        <div
          class="mock"
          v-if="isOpenVideo"
          @click.self="isOpenVideo = false"
        >
          <!-- 视频播放 -->
          <video
            class="videoRef"
            :src="BaseUrlVideo + video"
            :alt="goodsName || ' By Kiwi23333'"
            :key="video"
            :name="video"
            controls
          ></video>
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
  .videoRef {
    width: 40vw;
    display: block;
  }
}
</style>
