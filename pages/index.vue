<script setup lang="ts">
const online = useOnline()

</script>

<template>
  <div v-if="online">
    <NuxtLayout>
      
    </NuxtLayout>
  </div>
  <div v-else>
    网络断开，请你开启网络！
  </div>
</template>
