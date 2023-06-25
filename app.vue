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
  <NuxtPage />
</template>
<style> 
.page-enter-active,
.page-leave-active {
  transition: filter 0.24s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0.2;
  filter: blur(0.4em);
}


.layout-enter-active,
.layout-leave-active {
  transition: filter 0.24s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0.2;
  filter: blur(0.4em);
}

</style>
