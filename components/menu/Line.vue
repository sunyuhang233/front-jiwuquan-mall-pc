<script lang="ts" setup>
import { ElMenuItem, ElSubMenu } from "element-plus";
const { data } = defineProps<{
  data: IndexMenuType;
}>();

interface IndexMenuType {
  url: string;
  icon: string;
  image?: string;
  title: string;
  children: IndexMenuType[];
}
</script>
<template>
  <!-- 一级组件 -->
  <component
    :is="data.children?.length ? ElSubMenu : ElMenuItem"
    :index="data.url"
  >
    <!-- 无儿子 -->
    <template v-if="!data.children?.length">
      <i
        v-if="data.icon"
        :class="data.icon"
        p-3
      />
      <el-image
        v-else-if="data.image"
        loading="lazy"
        :src="BaseUrlImg + data.image"
        :alt="data.title"
        class="w-2em h-2em"
        fit="cover"
        style="border-radius: 6px; overflow: hidden"
      />
      <span class="title truncate min-w-5rem text-center pl-4">{{ data.title }}</span>
      <span w-2rem></span>
    </template>
    <!-- 嵌套 -->
    <template
      #title
      v-if="data.children?.length"
    >
      <i
        :class="data.icon"
        p-3
      />
      <span class="title truncate min-w-5rem text-center pl-4">{{ data.title }}</span>
      <span w-2rem></span>
    </template>
    <MenuLine
      v-for="child in data.children"
      :key="child.url"
      :data="child"
    />
  </component>
</template>
<style scoped lang="scss"></style>
