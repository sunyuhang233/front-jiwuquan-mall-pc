<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import type { CommCategory } from "@/composables/api/community";

// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_index_isFold", true);
// 长短折叠
const isCollapse = useStorage<boolean>("jiwu_index_isCollapse", false);
// 路由
const route = useRoute();
const commList = await getCommCategory();
function toMenuTypeFn(p: CommCategory) {
  const arr: IndexMenuType = {
    url: p.id || "",
    icon: "",
    image: p.image,
    title: p.name || "",
    children: [],
  };
  if (p.children?.length)
    arr.children = p.children?.map(item => toMenuTypeFn(item)) as IndexMenuType[];

  return arr;
}

const menuList = ref<IndexMenuType[]>([
  { url: "/", icon: "i-solar:home-2-bold", title: "首页", children: [] },
  { url: "/community", icon: "i-solar:ufo-3-bold-duotone", title: "极物圈", children: [] },
  {
    url: "/category",
    icon: "i-solar:widget-5-bold-duotone",
    title: "圈子",
    children: commList.data.value?.data
      ? commList.data.value?.data.map((p) => {
        if (p.isShow)
          return toMenuTypeFn(p);
        else
          return p;
      })
      : [],
  },
  { url: "/setting", icon: "i-solar:settings-linear", title: "设置", children: [] },
]);

interface IndexMenuType {
  url: string
  icon: string
  image?: string
  title: string
  children: IndexMenuType[]
}
</script>

<template>
  <div>
    <ClientOnly>
      <div v-show="!isCollapse" class="mock fixed left-0 top-0 z-998 block h-full w-full backdrop-blur sm:hidden" style="background-color: #85858510;" @click="isCollapse = true" />
      <div
        transition="all 300  cubic-bezier(0.61, 0.225, 0.195, 1.3)"
        class="menu fixed z-998 h-full bg-light backdrop-blur-30 md:sticky md:block dark:bg-dark-8 md:shadow-none"
        :class="{ '-translate-x-full': isCollapse }"
      >
        <el-scrollbar height="100%">
          <el-menu
            class="menu-first"
            :router="true"
            :default-active="route.path"
            :collapse="isFold"
          >
            <!-- 顶部 -->
            <div
              border-0 border-b-1px border-default
              class="w-full flex-row-c-c flex-wrap px-4 transition-300 hover:bg-transparent"
            >
              <img
                loading="lazy"
                alt="Design By Kiwi23333"
                src="@/assets/images/logo/logo_dark.png"
                class="m-0.2rem mr-a inline-block"
                my-3 h-1.6rem w-1.6rem
              >
              <span
                cursor-pointer py-2
                @click="isFold = !isFold"
              >
                <i
                  class="i-solar:hamburger-menu-line-duotone"
                  inline-block h-6 w-6
                />
              </span>
            </div>
            <!-- 递归生成菜单栏 -->
            <MenuLine
              v-for="data in menuList"
              :key="data.url"
              :data="data"
            />
          </el-menu>
        </el-scrollbar>
        <!-- 折叠隐藏 -->
        <div
          flex-row-c-c
          cursor-pointer rounded-r-8px shadow-indigo-600 shadow-sm hover:-translate-x-1 transition="all 300  cubic-bezier(0.61, 0.225, 0.195, 1.3)"
          class="absolute bottom-2rem h-3rem w-2rem bg-[var(--el-color-primary)] pl-1 -right-2rem -z-20 -translate-x-2"
          @click="isCollapse = !isCollapse"
        >
          <i
            transition="all 300  cubic-bezier(0.61, 0.225, 0.195, 1.3)"
            :class="{ 'rotate-180': isCollapse }"
            i-solar:alt-arrow-left-bold
            p-3
            text-light
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.dark .menu {
  :deep(.el-menu) {

    background-color: #0f0f0ffa;
  }
}
.menu {
  user-select: none;
  top: $top-nav-height;
  height: calc(100vh - $top-nav-height);
  :deep(.el-menu).menu-first {
    min-height: calc(100vh - $top-nav-height);

    .el-sub-menu__title,
    .el-menu-item {
      padding: 0.8em;
      padding-top: 0px;
      padding-bottom: 0px;
      overflow: hidden;
      text-overflow: clip;
      height: 3em;
      border-radius: 8px;
      margin: 10px;
      transition: $transition-delay;
      border: 1px dashed transparent;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        transition: 100ms;
      }


      &:hover,
      &.is-active:hover,
      &.is-active {
        border: 1px solid;
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);

        i {
          color: var(--el-color-primary);
        }
      }

      &:hover {
        border: 1px dashed;
      }
    }

    .el-menu-item-group {
      .el-menu-item {
        overflow: hidden;
        background-color: #8181811a;
        opacity: 0.9;

        &:hover {
          background-color: #8181811a;
          opacity: 1;
        }

        .second-icon {
          padding: 2px;
        }
      }

      .el-menu-item:hover {
        background-color: transparent;
        color: var(--el-color-primary);
      }

      .el-menu-item-group__title ml-2 {
        display: none;
      }


    }

    // 图标
    i {
      padding: 0.6rem;

      &:hover {
        transition: $transition-delay;
        color: var(--el-color-primary);
      }
    }

    .title {
      margin-left: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      text-align: justify;
      text-justify: distribute-all-lines;
      text-align-last: justify;
    }
  }
}

@media screen and (max-width: 768px) {
  .menu-bg .bg {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 150vw;
    overflow: hidden;
    height: 100vh;
    background-color: rgba(51, 51, 51, 0.3);
    z-index: -1;
    transition: $transition-delay;
  }
}
:deep(.el-sub-menu__icon-arrow) {
  right: 0;
  margin-top: -8px;
}
</style>
