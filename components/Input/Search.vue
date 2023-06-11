<template>
  <!-- 搜索框 -->
  <ElInput v-model="word" :onSearch="onSearch" :placeholder="'搜索'" @change="props.isChange && $emit('onSearch')" />
</ElAffix></template>

<script lang="ts" setup>
// 搜索
let props = defineProps<{
  modelValue: string,
  isChange?: boolean | false,
}>()

const word = computed({
  get(): string {
    return props.modelValue
  },
  set(v: string) {
    $emit("update:modelValue", v)
  }
})


function $emit(arg0: string, v: string) {
  throw new Error('Function not implemented.');
}
</script>
<style lang="scss" scoped> .nav {
   z-index: 999;
   height: $top-nav-height;
   background-image: radial-gradient(transparent 1px, $theme-bg-color2 1px);
   background-size: 4px 4px;
   backdrop-filter: saturate(50%) blur(1.4rem);
 }

 .dark .nav {
   background-image: radial-gradient(transparent 1px, $theme-bg-color 1px);
   background-size: 4px 4px;
   backdrop-filter: saturate(50%) blur(1.4rem);
 }
</style>