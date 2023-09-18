<script lang="ts" setup>
</script>

<template>
  <!-- 顶部header -->
  <header
    class="nav select-none"
    text-m flex-row-bt-c px-6 py-4
    dark:text="light"
  >
    <!-- 左侧 -->
    <div
      class="left"
      group flex-row-c-c
    >
      <NuxtLink
        mx-2
        to="/"
        flex-row-c-c
        class="group"
      >
        <img
          alt="Design By Kiwi23333"
          src="@/assets/images/logo/logo.png"
          w-42px object-contain transition-300 dark:hidden group-hover:opacity-85 group-hover:filter-blur-2px
        >
        <img
          alt="Design By Kiwi23333"
          src="@/assets/images/logo/logo_dark.png"
          hidden w-42px object-contain transition-300 dark:block group-hover:opacity-85 group-hover:filter-blur-2px
        >
        <span
          i-solar:home-2-bold absolute left-9 hidden h-32px w-32px transition-300 group-hover:block
          style="color: var(--el-text-color-primary)"
        />
        <span
          m-4 hidden text-xl font-700 tracking-2 md:inline
        >
          极物圈
        </span>
      </NuxtLink>
    </div>
    <!-- 右侧 -->
    <ClientOnly>
      <div
        class="right"
        flex-row-c-c
      >
        <slot name="right" />
        <!-- 切换主题 -->
        <BtnSwitch />
        <!-- 头像简约 -->
        <!-- <CardUserLineSe /> -->
        <CardUserLineSe />
      </div>
    </ClientOnly>
  </header>
</template>

<style lang="scss" scoped>
.nav {
  position: sticky;
  box-shadow: rgba(9, 30, 66, 0.1) 0px 4px 2px -2px;
  top: 0;
  z-index: 999;
  height: $top-nav-height;
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(6px);
  background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
}

.dark .nav {
  background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
  background-size: 4px 4px;
  box-shadow: rgba(92, 97, 124, 0.02) 12px 12px 60px;
}

.login:hover {
  transition: $transition-delay;
  border-color: var(--el-color-primary);
  opacity: 0.8;
}

.input-search {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -130%);
  transition: all 2 * $transition-delay $animate-cubic-bount;
}

.nav:focus,
.nav:hover {
  overflow: hidden;

  .input-search {
    animation-duration: 0.6s;
    transform: translate(-50%, 0);
  }

  .input-search:focus {
    animation-duration: 0.6s;
    transform: translate(-50%, 0);
  }
}
</style>
