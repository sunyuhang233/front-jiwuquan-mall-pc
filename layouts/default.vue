<template>
  <!-- 顶部导航 -->
    <MenuHeaderMenu />
  <div flex>
    <!-- 左侧边导航 -->
    <MenuDrawerMenu />
    <transition class="content slideInLeft" name="slideInLeft">
      <slot name="default" />
    </transition>
  </div>
</template>
<script lang="ts" setup>
</script>
<style scoped lang="scss"></style>

