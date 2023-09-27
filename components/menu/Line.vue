<script lang="ts" setup>
import { ElMenuItem, ElSubMenu } from "element-plus";

const { data } = defineProps<{
  data: IndexMenuType
}>();

interface IndexMenuType {
  url: string
  icon: string
  image?: string
  title: string
  children: IndexMenuType[]
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
        class="h-2em w-2em"
        fit="cover"
        style="border-radius: 6px; overflow: hidden"
      />
      <i
        v-else
        :class="{ 'ml-a': data.children }"
        i-solar:hashtag-bold-duotone
        p-2
      />
      <span class="title min-w-6rem truncate pl-4 text-center">{{ data.title }}</span>
      <span w-2rem />
    </template>
    <!-- 嵌套 -->
    <template
      v-if="data.children?.length"
      #title
    >
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
        class="h-2em w-2em"
        fit="cover"
        style="border-radius: 6px; overflow: hidden"
      />
      <i
        v-else
        :class="{ 'ml-a': data.children }"
        i-solar:dialog-2-line-duotone
        p-2
      />
      <span class="title w-5rem truncate text-center">{{ data.title }}</span>
      <span w-2rem />
    </template>
    <MenuLine
      v-for="child in data.children"
      :key="child.url"
      :data="child"
    />
  </component>
</template>

<style scoped lang="scss"></style>
