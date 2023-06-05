<template>
  <!-- 顶部导航 -->
  <MenuHeaderMenu />
  <div flex>
    <!-- 左侧边导航 -->
    <MenuDrawerMenu />
    <div class="content animate__slideInLeft"  >
      <slot name="default" />
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>
<script lang="ts" setup>
</script>
<style scoped lang="scss"></style>

