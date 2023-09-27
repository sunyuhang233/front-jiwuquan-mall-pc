<script lang="ts" setup>
// 定义页面元数据
definePageMeta({
  key: route => route.path,
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="error">
      <OtherError msg="500, 服务器错误" />
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss"></style>
