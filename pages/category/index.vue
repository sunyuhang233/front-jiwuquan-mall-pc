<template>
  <div>
    <NuxtLayout name="default">
      <div
        class="index"
        p-4
      >
        <h1>分类</h1>
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
