<template>
  <div class="min-h-100vh flex flex-col">
    <!-- 头部 -->
    <MenuHeaderMenuSe>
      <template #right>
        <div class="md:hidden">
          <el-button
            style="padding: 0em 0.4em"
            round
            @click="isShowMenu = !isShowMenu"
          >
            <i
              i-solar:hamburger-menu-broken
              p-2.4
            ></i>
          </el-button>
        </div>
      </template>
    </MenuHeaderMenuSe>
    <div class="flex">
      <ClientOnly>
        <!-- 左侧边导航 -->
        <MenuCollMenu
          v-if="leftMenu"
          class="-translate-x-full transition-300"
          @close="isShowMenu = false"
          :class="{ 'translate-x-0 menu-bg': isShowMenu }"
        />
      </ClientOnly>
      <!-- 内容 -->
      <ClientOnly>
        <div class="flex-1 animate-fade-in animate-duration-300">
          <slot name="default"></slot>
        </div>
      </ClientOnly>
    </div>
    <!-- 右下角功能区 -->
    <ClientOnly>
      <MenuRightButtons :menu="menu" />
    </ClientOnly>
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
  menu: {
    default: ["shopcart"],
    required: false,
  },
});
const isShowMenu = ref<boolean>(false);
</script>
