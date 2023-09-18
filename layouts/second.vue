<script lang="ts" setup>
const { footer, menu } = defineProps({
  footer: {
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
    default: ["shopcart", "back"],
    required: false,
  },
});
</script>

<template>
  <div class="min-h-100vh flex flex-col">
    <MenuHeaderMenu v-if="header" />
    <!-- 左侧边导航 -->
    <div class="flex-1">
      <slot name="default" />
    </div>
    <!-- 右下角功能区 -->
    <ClientOnly>
      <MenuRightButtons :menu="menu" />
    </ClientOnly>
    <!-- 页脚 -->
    <MenuFooter v-if="footer" />
  </div>
</template>

<style lang="scss" scoped>
.animate-fade-slice {
  animation: fade-slice-anim $transition-delay;
}

@keyframes fade-slice-anim {
  0% {
    transform: translateY(20%);
    transition: 0.3s;
    opacity: 0;
  }

  100% {
    transform: translateY(0%);
    opacity: 1;
  }
}
</style>
