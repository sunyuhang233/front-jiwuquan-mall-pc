<template>
  <!-- 菜单 -->
  <ElAffix :offset="60">
    <div class="menu-list" w-auto md:w-200px>
      <ClientOnly>
        <transition name="slideInOut">
          <el-menu :router="true" :default-active="route.path" bg=" dark:dark-600" v-show="!isFold">
            <!-- 首页 -->
            <el-menu-item index="/">
              <ElIconHomeFilled />
              <div class="title" hidden mx-4 sm:inline-block>首&emsp;页</div>
            </el-menu-item>
            <!-- 社区 -->
            <el-menu-item index="/community">
              <ElIconSwitchFilled />
              <div class="title" hidden mx-4 sm:inline-block>社&emsp;区</div>
            </el-menu-item>
            <!-- 圈子 -->
            <el-menu-item index="/quanzi">
              <ElIcon />
              <div class="title" hidden mx-4 sm:inline-block>极物圈</div>
            </el-menu-item>
            <el-menu-item index="/setting">
              <ElIconSetting />
              <div class="title" hidden mx-4 sm:inline-block>设&emsp;置</div>
            </el-menu-item>
          </el-menu>
        </transition>
        <!-- 折叠按钮 -->
        <div @click="isFold = !isFold" class="collapse" flex-row-c-c duration-300 p-2>
          <ElIconArrowRightBold skew-y-2 />
        </div>
      </ClientOnly>
    </div>
  </ElAffix>
</template>

<script lang="ts" setup>
// 页面
// const option = [
//   { id: 1, title: "首&emsp;页", icon: HomeFilled, path: "/" },
//   { id: 2, title: "社&emsp;区", icon: ElIconSwitchFilled, path: "/community" },
//   { id: 3, title: "极物圈", icon: ElIconArrowLeftBold, path: "/social" },
//   { id: 4, title: "设&emsp;置", icon: ElIconSetting, path: "/setting" },
// ]
// 路由

// 是否折叠
let isFold = ref<boolean>(false)
// route
const route = useRoute()
</script>

<style lang="scss" scoped>
.menu-list {
  user-select: none;
  position: relative;
  height: calc(100vh - $top-nav-height);
  transition: $transition-delay;
  // 菜单和项


  .el-menu {
    height: 100%;
    box-shadow: rgba(100, 100, 100, 0.1) 0px 1px 4px;

    .el-menu-item {
      width: calc(100% + 3px);
      border-right: 3px solid transparent;
      transition: 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 20px 20px;

      .title {
        letter-spacing: 0.3em;
      }

      svg {
        width: 1.4em;
        height: 1.4em;
      }

      NuxtLink {
        transition: $transition-delay;
      }
    }


    .el-menu-item.is-active {
      transition: 0.3s;
      border-radius: 4px;
      background-color: var(--el-color-primary-light-9);
      border-right: 3px solid var(--el-color-primary);
    }
  }


  // 折叠按钮
  .collapse {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 2.4em;
    height: 2.4em;
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transform: translate(60%, -50%);
    background-color: var(--el-color-primary);
    color: white;
    border-radius: 50%;
    // border-radius: 0% 100% 100% 0% / 50% 50% 50% 50% ;
    // clip-path: ellipse(70% 50% at 0% 50%);

    .icon {
      object-fit: contain;
    }
  }

  .collapse.dark {
    background-color: var(--el-color-primary);
  }

}
</style>
