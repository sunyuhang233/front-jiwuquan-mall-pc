<template>
  <NuxtLayout>
    <div class="index" p="y-2 x-4">
      <h1>主页{{ route.path }}</h1>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
const route = useRoute()

</script>
<style scoped lang="scss"></style>

