<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { CommCategory } from "@/composables/api/community";
import { ElMenuItem, ElSubMenu } from "element-plus";
// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_isFold", true);
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
const commMenu = toRaw(commList.data.value?.data || []).map((p) => {
  if (p.isShow) {
    return toMenuTypeFn(p);
  }
}) as IndexMenuType[];

const menuList = <IndexMenuType[]>[
  { url: "/", icon: "i-solar:home-2-bold", title: "首页", children: [] },
  { url: "/community", icon: "i-solar:ufo-3-bold-duotone", title: "极物圈", children: [] },
  { url: "/category", icon: "i-solar:widget-5-bold-duotone", title: "圈子", children: commMenu },
  { url: "/setting", icon: "i-solar:settings-linear", title: "设置", children: [] },
];
interface IndexMenuType {
  url: string;
  icon: string;
  image?: string;
  title: string;
  children: IndexMenuType[];
}

// 长短折叠
const isCollapse = ref<boolean>(false);
</script>
<template>
  <div
    class="menu md:shadow-none md:translate-x-0px fixed md:sticky md:block z-998 bg-light dark:bg-[#121212] bg-opacity-80 backdrop-blur-30 h-full"
  >
    <ClientOnly>
      <!-- 菜单 -->
      <el-menu
        :router="true"
        :default-active="route.path"
        :collapse="isFold"
      >
        <!-- 顶部 -->
        <div
          class="w-full flex-row-c-c justify-between flex-wrap transition-300 hover:bg-transparent px-4"
          :class="{ 'flex-col items-center': isFold }"
        >
          <div class="home mt-6 transition-300">
            <NuxtLink
              to="/"
              flex-row-c-c
              class="group"
            >
              <img
                src="@/assets/images/logo/logo.svg"
                w-1.6rem
                h-1.6rem
              />
            </NuxtLink>
          </div>
          <span
            @click="isFold = !isFold"
            class="mt-6 p-1 transition-300"
          >
            <i class="i-solar:hamburger-menu-line-duotone"></i>
          </span>
        </div>
        <!-- 菜单 -->
        <!-- <template
          v-for="p in menuList"
          :key="p.url"
        >
          <el-menu-item
            v-if="p.children.length === 0"
            :index="p.url"
          >
            <i
              :class="p.icon"
              p-3
            />
            <span class="title truncate min-w-4rem text-center">{{ p.title }}</span>
            <span w-2rem></span>
          </el-menu-item>

          <el-sub-menu
            v-else
            :index="p.url"
          >
            <template #title>
              <i
                :class="p.icon"
                p-3
              />
              <span class="title truncate min-w-4rem text-center mr-4">{{ p.title }}</span>
              <span w-2rem></span>
            </template>
            <component
              v-for="c in p.children"
              :is="c.children.length ? ElSubMenu : ElMenuItem"
              :index="c.url"
              :key="c.url"
            >
              <template #title>
                <el-image
                  v-if="c.image"
                  loading="lazy"
                  :src="BaseUrlImg + c.image"
                  :alt="p.title"
                  class="w-2em h-2em"
                  fit="cover"
                  style="border-radius: 6px; overflow: hidden"
                />
                <span class="title truncate min-w-4rem text-center">{{ c.title }}</span>
              </template>
            </component>
          </el-sub-menu>
        </template>-->
        <MenuLine
          :data="data"
          v-for="data in menuList"
          :key="data.url"
        />
      </el-menu>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  user-select: none;
  top: $top-nav-height;
  height: calc(100vh - $top-nav-height);

  :deep(.el-menu) {
    height: 100%;

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
</style>
