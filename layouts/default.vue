<template>
  <!-- 顶部导航 -->
  <MenuHeaderMenu />
  <div flex>
    <!-- 左侧边导航 -->
    <!-- <MenuLeftMenu /> -->
    <div class="content" flex-1>
      <slot name="default" />
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>
<style scoped lang="scss"></style>

