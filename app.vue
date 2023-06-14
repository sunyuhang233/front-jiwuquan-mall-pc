<script setup lang="ts">

import { appName } from '@/constants/index'
useHead({
  title: appName,
})
</script>
<!-- html  -->
<template>
  <transition name="page">
    <div>
      <NuxtLoadingIndicator /> <!-- here -->
      <NuxtPage />
    </div>
  </transition>
</template>
<style  lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
  animation: cubic-bezier(0.1, 0.7, 1, 1);
}
</style>
