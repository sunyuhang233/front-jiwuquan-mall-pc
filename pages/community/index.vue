<template>
  <div>
    <NuxtLayout name="main">
      <div
        class="index"
        p-4
      >
        <h1>社区</h1>
      </div>
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  key: (route) => route.path,
  layout: false,
});
</script>
<style scoped lang="scss"></style>
