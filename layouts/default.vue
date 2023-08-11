<template>
  <div class="min-h-100vh">
    <!-- 头部导航 -->
    <MenuHeaderMenu
      class="sticky top-0 left-0 z-1001"
      v-if="header"
    />
    <div class="flex">
      <ClientOnly>
        <!-- 左侧边导航 -->
        <MenuDrawerMenu v-if="leftMenu" />
      </ClientOnly>
      <!-- 内容 -->
      <div class="flex-1 min-h-100vh">
        <slot></slot>
      </div>
    </div>
    <!-- 右下角功能区 -->
    <ClientOnly>
      <MenuRightButtons :menu="menu" />
    </ClientOnly>
    <!-- 页脚 -->
    <MenuFooter v-if="footer" />
  </div>
</template>
<script lang="ts" setup>
const { footer, menu, leftMenu } = defineProps({
  footer: {
    type: Boolean,
    default: true,
    required: false,
  },
  leftMenu: {
    type: Boolean,
    default: true,
    required: false,
  },
  header: {
    type: Boolean,
    default: true,
    required: false,
  },
  menu: {
    default: ["shopcart"],
    required: false,
  },
});
</script>
