<script setup lang="ts">
import { appName } from '@/constants/index'
useHead({
  title: appName,
})
</script>
<!-- html  -->
<template>
  <FormUserDialog />
  <NuxtPage />
</template>
<style >
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.3rem);
  transform: scale(0.99);
  animation: cubic-bezier(0.1, 0.7, 1, 1);
}
/* 
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
} */
</style>
