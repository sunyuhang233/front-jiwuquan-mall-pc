<template>
  <NuxtLayout>
    <div class="index" p="y-2 x-4">
      <h1>社区</h1>
      {{ route.path }}
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { RouteLocationNormalizedLoaded } from 'vue-router';
const route:RouteLocationNormalizedLoaded = useRoute()
</script>
<style scoped lang="scss"></style>
