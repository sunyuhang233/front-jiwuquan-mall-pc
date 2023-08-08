<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_isFold", true);
// 路由
const route = useRoute();
</script>
<template>
  <!-- 菜单 -->
  <div
    class="group fixed md:sticky menu-list w-12vw md:w-200px"
    :class="{ 'is-fold': isFold }"
  >
    <el-menu
      style="width: 100%"
      :router="true"
      :default-active="route.path"
      bg=" dark:dark-600"
    >
      <!-- 首页 -->
      <el-menu-item index="/">
        <ElIconHomeFilled />
        <div
          class="title"
          mx-4
          hidden
          md:block
        >
          首&emsp;页
        </div>
      </el-menu-item>
      <!-- 社区 -->
      <el-menu-item index="/community">
        <ElIconSwitchFilled />
        <div
          class="title"
          mx-4
          hidden
          md:block
        >
          社&emsp;区
        </div>
      </el-menu-item>
      <!-- 分类 -->
      <el-menu-item index="/category">
        <ElIconGoodsFilled />
        <div
          class="title"
          mx-4
          hidden
          md:block
        >
          分&emsp;类
        </div>
      </el-menu-item>
      <el-menu-item index="/setting">
        <ElIconSetting />
        <div
          class="title"
          mx-4
          hidden
          md:block
        >
          设&emsp;置
        </div>
      </el-menu-item>
    </el-menu>
    <ClientOnly>
      <!-- 折叠按钮 -->
      <div
        class="collapse flex-row-c-c"
        @click="isFold = !isFold"
      >
        <i
          class="icon p-3.2 mx-0.3rem"
          i-solar:alt-arrow-left-bold
        ></i>
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.menu-list {
  top: $top-nav-height;
  left: 0;
  user-select: none;
  z-index: 100;
  height: calc(100vh - $top-nav-height);
  transition: all $transition-delay;

  // 菜单和项
  :deep(.el-menu) {
    width: 100%;
    height: 100%;
    box-shadow: rgba(100, 100, 100, 0.1) 0px 1px 4px;
    .el-menu-item {
      border-radius: 0 3px 3px 0;
      border-right: 3px solid transparent;
      transition: $transition-delay;
      display: flex;
      width: 101%;
      overflow: hidden;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0;
      transition: $transition-delay;
      svg {
        width: 1.4em;
        height: 1.4em;
      }
      &.is-active {
        border-right: 1%;
        border-color: var(--el-color-primary);
      }
    }

    .el-menu-item.is-active {
      background-color: var(--el-color-primary-light-9);
    }
  }
  .collapse {
    position: absolute;
    right: 0.3em;
    transform: translateX(100%);
    z-index: -1;
    bottom: 2rem;
    height: 3.2rem;
    background-color: var(--el-color-primary);
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    transition: $transition-delay;
    .icon {
      background-color: #fff;
    }
    &:hover {
      right: 0;
      transform: translateX(100%);
    }
  }
}
.is-fold {
  width: 0;
  margin: 0;
  padding: 0;
  :deep(.el-menu-item) {
    opacity: 0.6;
    &,
    .title,
    &.is-active {
      width: 0;
      margin: 0;
      padding: 0;
    }
  }
  .collapse {
    .icon {
      transform: rotate(180deg);
    }
  }
}
</style>
