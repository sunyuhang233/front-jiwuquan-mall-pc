<template>
  <NuxtLayout>
    <div class="index">
      <h1>主页</h1>
      <ElButton type="primary"/>
    </div>
  </NuxtLayout>
  <!-- <MenuLeftMenu /> -->
</template>
<script lang="ts" setup>
import { onMounted } from "vue"
const app = useNuxtApp()
onMounted(async () => {
  console.log(app);
})

</script>
<style scoped lang="scss"></style>

