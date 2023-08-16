<script lang="ts" setup>
const { text, pretext, icon } = defineProps<{
  text: string;
  pretext?: string;
  icon?: string;
}>();
</script>
<template>
  <small class="cursor-pointer transition-300 hover:text-[var(--el-color-info)]">
    <div inline>
      {{ pretext }}
    </div>
    <div
      inline
      ml-a
      v-copying.toast="text"
    >
      {{ text }}
    </div>
    <i
      v-if="icon"
      class="ml-1 p-0.5em opacity-60"
      :class="icon"
    ></i>
  </small>
</template>
<style scoped lang="scss"></style>
