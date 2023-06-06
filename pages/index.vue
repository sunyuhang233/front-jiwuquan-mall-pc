<template>
  <NuxtLayout>
    <div class="index" p="y-2 x-4">
      <h1>主页</h1>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { onMounted } from "vue"
const app = useNuxtApp()
onMounted(async () => {
  console.log(app);
})

</script>
<style scoped lang="scss"></style>

