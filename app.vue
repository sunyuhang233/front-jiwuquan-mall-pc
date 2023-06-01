<script setup lang="ts">
import { appName } from '@/constants'
// html 头部
useHead({
  title: appName,
})
</script>
<template>
  <NuxtPage class="page"/>
</template>

<style scoped lang="scss">
.dark,.light {
  transition: 0.3s;
}
html.dark {
  background-color: #111111;
}

// 动画
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
