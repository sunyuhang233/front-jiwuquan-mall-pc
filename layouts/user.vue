<script lang="ts" setup>
const { menu, leftMenu } = defineProps({
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

<template>
  <div class="min-h-100vh flex flex-col">
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
            />
          </el-button>
        </div>
      </template>
    </MenuHeaderMenuSe>
    <div class="flex">
      <!-- 左侧边导航 -->
      <ClientOnly>
        <MenuCollMenu
          v-if="leftMenu"
          class="transition-300 -translate-x-full"
          :class="{ 'translate-x-0 menu-bg': isShowMenu }"
          @close="isShowMenu = false"
        />
      </ClientOnly>
      <!-- 内容 -->
      <div class="flex-1">
        <slot />
      </div>
    </div>
    <!-- 右下角功能区 -->
    <ClientOnly>
      <MenuRightButtons :menu="menu" />
    </ClientOnly>
  </div>
</template>
