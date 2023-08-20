<template>
  <ElButton
    @click="$emit('reload')"
    class="btn"
    round
  >
    <span class="hidden truncate md:inline overflow-hidden">刷新</span>
    <i
      class="hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)] w-1.4em w-1.4em"
      alt="页面刷新"
    />
  </ElButton>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.btn {
  padding: 0em 0.4em;
  transition: $transition-delay;

  span {
    width: 0;
    overflow: hidden;
    transition: $transition-delay;
    letter-spacing: 0.1em;
  }

  &:hover {
    span {
      width: 3em;
    }
  }
  &:hover span,
  &:focus span {
    width: 3em;
    margin: 0 0.4em;
  }
}
</style>
