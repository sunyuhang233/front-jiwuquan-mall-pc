<template>
  <!-- 顶部导航 -->
  <MenuHeaderMenu />
  <!-- 左侧边导航 -->
  <div flex>
    <MenuDrawerMenu />
    <!-- 内容 -->
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>

</script>
<style scoped lang="scss"></style>