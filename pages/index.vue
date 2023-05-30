<script setup lang="ts">
const online = useOnline()

</script>

<template>
  <div v-if="online">
    <defaul>
      <NuxtLayout name="top">

      </NuxtLayout>
    </defaul>
  </div>
  <div w-100 h-100 v-else text-gray:80>
    网络断开，请你开启网络！
  </div>
</template>
