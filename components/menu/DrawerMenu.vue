<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { CommCategory } from "@/composables/api/community";

// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_isFold", true);
// 长短折叠
const isCollapse = ref<boolean>(false);
// 路由
const route = useRoute();
const commList = await getCommCategory();
const toMenuTypeFn = (p: CommCategory) => {
  const arr: IndexMenuType = {
    url: p.id || "",
    icon: "",
    image: p.image,
    title: p.name || "",
    children: [],
  };
  if (p.children?.length) {
    arr.children = p.children?.map((item) => toMenuTypeFn(item)) as IndexMenuType[];
  }
  return arr;
};

const menuList = <IndexMenuType[]>[
  { url: "/", icon: "i-solar:home-2-bold", title: "首页", children: [] },
  { url: "/community", icon: "i-solar:ufo-3-bold-duotone", title: "极物圈", children: [] },
  {
    url: "/category",
    icon: "i-solar:widget-5-bold-duotone",
    title: "圈子",
    children: toRaw(commList.data.value?.data || []).map((p) => {
      if (p.isShow) {
        return toMenuTypeFn(p);
      }
    }),
  },
  { url: "/setting", icon: "i-solar:settings-linear", title: "设置", children: [] },
];

interface IndexMenuType {
  url: string;
  icon: string;
  image?: string;
  title: string;
  children: IndexMenuType[];
}
</script>

<template>
  <div
    transition="all 300  cubic-bezier(0.61, 0.225, 0.195, 1.3)"
    class="menu  md:shadow-none fixed md:sticky md:block z-998 bg-light dark:bg-dark-8 backdrop-blur-30 h-full"
    :class="{ '-translate-x-full': isCollapse }"
  >
    <ClientOnly>
      <el-scrollbar height="100%">
        <el-menu
          class="menu-first"
          :router="true"
          :default-active="route.path"
          :collapse="isFold"
        >
          <!-- 顶部 -->
          <div
            border-default
            border-0
            border-b-1px
            class="w-full flex-row-c-c flex-wrap transition-300 hover:bg-transparent px-4"
          >
            <img
              my-3
              src="@/assets/images/logo/logo_dark.png"
              class="inline-block m-0.2rem mr-a"
              loading="lazy"
              w-1.6rem
              h-1.6rem
            />
            <span
              py-2
              cursor-pointer
              @click="isFold = !isFold"
            >
              <i
                inline-block
                class="i-solar:hamburger-menu-line-duotone"
                w-6
                h-6
              />
            </span>
          </div>
          <!-- 递归生成菜单栏 -->
          <MenuLine
            :data="data"
            v-for="data in menuList"
            :key="data.url"
          />
        </el-menu>
      </el-scrollbar>
      <!-- 折叠隐藏 -->
      <div
        @click="isCollapse = !isCollapse"
        rounded-r-8px
        cursor-pointer
        hover:-translate-x-1
        flex-row-c-c
        shadow-sm

        shadow-indigo-600
        transition="all 300  cubic-bezier(0.61, 0.225, 0.195, 1.3)"
        class="absolute bottom-2rem -right-2rem -z-20 w-2rem pl-1 h-3rem bg-[var(--el-color-primary)] -translate-x-2"
      >
        <i
          transition="all 300  cubic-bezier(0.61, 0.225, 0.195, 1.3)"
          :class="{ 'rotate-180': isCollapse }"
          i-solar:alt-arrow-left-bold
          p-3
          text-light
        ></i>
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
