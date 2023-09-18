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

<template>
  <div class="min-h-100vh">
    <MenuHeaderMenu
      v-if="header"
      class="sticky left-0 top-0 z-1001"
    />
    <div class="flex">
      <ClientOnly>
        <MenuDrawerMenu v-if="leftMenu" />
      </ClientOnly>
      <div class="flex-1">
        <slot name="default" />
      </div>
    </div>
    <ClientOnly>
      <MenuRightButtons :menu="menu" />
    </ClientOnly>
    <MenuFooter v-if="footer" />
  </div>
</template>
