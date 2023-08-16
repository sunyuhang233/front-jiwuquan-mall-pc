<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
const bgList = ref<string[]>([
  "kiwi-bg-1.jpg",
  "kiwi-bg-2.jpg",
  "kiwi-bg-3.jpg",
  "kiwi-bg-4.jpg",
  "kiwi-bg-5.jpg",
]);
const bgUrl = useLocalStorage("jiwu_user_bg", "kiwi-bg-4.jpg");
</script>
<template>
  <div class="top-bg group relative select-none shadow-lg shadow-inset">
    <el-popover
      :width="400"
      placement="top"
      title="切换壁纸"
      trigger="click"
    >
      <template #reference>
        <!-- 切换按钮 -->
        <el-button
          class="opacity-0 group-hover:opacity-100 absolute right-1em bottom-1.4em z-1"
          type="info"
          plain
          style="padding: 8px; background-color: rgba(97, 255, 163, 0.1); transition: 0.3s"
        >
          <i
            i-solar:pallete-2-bold
            w-1.6em
            h-1.6em
          ></i>
        </el-button>
      </template>
      <template #default>
        <ClientOnly>
          <div class="img-list">
            <el-image
              loading="lazy"
              v-for="(p, i) in bgList"
              :key="i"
              alt="Design By Kiwi23333"
              :src="BaseUrlImg + p"
              object-cover
              @click="bgUrl = p"
              class="w-6em h-4em hover:scale-110 transition-300 object-cover w-1/1 m-1 border-default rounded-4px hover:"
            />
          </div>
        </ClientOnly>
      </template>
    </el-popover>
    <el-image
      loading="lazy"
      :src="BaseUrlImg + bgUrl"
      object-cover
      class="h-300px object-cover w-1/1"
    />
  </div>
</template>
<style scoped lang="scss"></style>
