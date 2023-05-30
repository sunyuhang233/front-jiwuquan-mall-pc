<script setup lang="ts">
import { appName } from '@/constants'
import { toLoginByPwd } from './server/api/user/user';

// html 头部
useHead({
  title: appName,
})

onMounted(async () => {
  const {data}= await toLoginByPwd("kiwi2333", "123456")
  console.log(data.data);
})



</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.dark,.light {
  transition: 0.3s;
}
html.dark {
  background-color: #111111;
}
</style>
