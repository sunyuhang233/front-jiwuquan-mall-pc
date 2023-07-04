<script setup lang="ts">
import { appName } from '@/constants/index'
useHead({
  title: appName,
})
const app = useNuxtApp()
app.hook("app:mounted", () => {
  const store = useUserStore()
  if (store.isLogin) {
    store.onCheckLogin()
  }
})
</script>
<template>
  <FormUserDialog />
  <NuxtPage />
</template>
<style> 
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter:blur(1rem) grayscale(1);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter:blur(1rem) grayscale(1);
} 
</style>
