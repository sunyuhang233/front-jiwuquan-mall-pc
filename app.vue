<script setup lang="ts">
import { appName } from '@/constants'
useHead({
  title: appName,
})
</script>
<!-- html  -->
<template>
  <NuxtPage />
</template>
<style  lang="scss">

.page-enter-active,
.page-leave-active {
  transition: all $transition-delay;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
  animation: cubic-bezier(0.1, 0.7, 1.0, 1.0);
}

</style>
