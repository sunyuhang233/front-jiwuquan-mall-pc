<script lang="ts" setup>
// 页面
// const option = [
//   { id: 1, title: "首&emsp;页", icon: HomeFilled, path: "/" },
//   { id: 2, title: "社&emsp;区", icon: ElIconSwitchFilled, path: "/community" },
//   { id: 3, title: "极物圈", icon: ElIconArrowLeftBold, path: "/social" },
//   { id: 4, title: "设&emsp;置", icon: ElIconSetting, path: "/setting" },
// ]
// 是否折叠 
const isFold = ref<boolean>(Boolean(false))
// 路由
const route = useRoute()
</script>

<template>
  <!-- 菜单 -->
  <ElAffix :offset="60">
    <transition name="slideInOut">
      <div v-show="!isFold" class="menu-list" w-auto md:w-200px>
        <el-menu :router="true" :default-active="route.path" bg=" dark:dark-600">
          <!-- 首页 -->
          <el-menu-item index="/">
            <ElIconHomeFilled />
            <div class="title" mx-4 hidden sm:inline-block>
              首&emsp;页
            </div>
          </el-menu-item>
          <!-- 社区 -->
          <el-menu-item index="/community">
            <ElIconSwitchFilled />
            <div class="title" mx-4 hidden sm:inline-block>
              社&emsp;区
            </div>
          </el-menu-item>
          <!-- 圈子 -->
          <el-menu-item index="/quanzi">
            <ElIconGoodsFilled />
            <div class="title" mx-4 hidden sm:inline-block>
              极物圈
            </div>
          </el-menu-item>
          <el-menu-item index="/setting">
            <ElIconSetting />
            <div class="title" mx-4 hidden sm:inline-block>
              设&emsp;置
            </div>
          </el-menu-item>
        </el-menu>

        <!-- 折叠按钮 -->
        <div class="collapse" flex-row-c-c p-2 duration-300 @click="isFold = !isFold">
          <ElIconArrowRightBold skew-y-2 />
        </div>
      </div>
    </transition>
    <!-- 折叠按钮 -->
    <div v-show="isFold" class="collapse animate__animated animate__bounceIn collapse2" flex-row-c-c p-l-3 duration-300
      @click="isFold = !isFold">
      <ElIconArrowRightBold />
    </div>
  </ElAffix>
</template>

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
  transform: translate(50%, -50%);
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

.collapse2 {
  left: -1em;
  bottom: 1em;
  height: 2.6em;
  border-radius: 0 0.3em 0.3em 0;
  transition: $transition-delay;
  animation-delay: $transition-delay;
}
</style>
