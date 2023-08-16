<script lang="ts" setup>
const user = useUserStore();
const { menu } = defineProps({
  menu: {
    default: ["shopcart"],
    required: false,
  },
});
const router = useRouter();
const toBack = () => {
  if (history.length > 1) {
    router.back();
  } else {
    navigateTo("/");
  }
};
// const isFold = computed(() => {
//   return menu.length >= 3;
// });
// const toggle = ref<boolean>(false);
</script>
<template>
  <ClientOnly>
    <KeepAlive>
      <div class="btns group flex px-2 flex-col">
        <div class="btn-group py-3 flex flex-col justify-end">
          <!-- 回到顶部 -->
          <el-backtop
            key="backtop"
            style="width: 3rem; height: 3rem; overflow: visible"
            class="cursor-pointer rounded-1/2 hover:scale-90 transition-300 rounded-1/2 shadow-[#0bdb85] shadow-opacity-60 shadow-md btn"
          >
            <i
              class="w-3/5 h-3/5"
              i-solar:alt-arrow-up-bold
              text-light
            />
          </el-backtop>
          <!-- 返回 -->
          <span
            key="back"
            v-if="menu.includes('back')"
            @click="toBack()"
            cursor-pointer
            hover:scale-90
            transition-300
            class="bg-[var(--el-color-primary)] shadow-md shadow-[var(--el-color-primary)] shadow-opacity-40 btn"
            p-1
            mt-3
            w-3rem
            h-3rem
            flex-row-c-c
            rounded-4em
          >
            <i
              class="w-2/3 h-2/3"
              mr-0.5
              i-solar:alt-arrow-left-line-duotone
              text-light
            />
          </span>
          <!-- 返回首页 -->
          <NuxtLink
            v-if="menu.includes('home')"
            to="/"
            hover:scale-90
            transition-300
            key="home"
            class="shadow-[var(--el-color-primary)] shadow-opacity-40 shadow-md btn"
            p-1
            mt-3
            rounded-4em
            style="background-color: var(--el-color-primary)"
            w-3rem
            h-3rem
            flex-row-c-c
          >
            <i
              p-2.6
              i-solar:home-smile-outline
              text-light
            />
          </NuxtLink>
          <!-- 客服 -->
          <div
            key="service"
            class="w-3rem h-3rem cursor-pointer flex-row-c-c shadow-lg p-2.4 transition-300 hover:scale-90 bg-[var(--el-color-info)] rounded-1/2 mt-3 btn"
            v-if="menu.includes('service') && user.isLogin"
          >
            <el-tooltip
              effect="dark"
              content="客服"
              :offset="20"
              placement="left"
            >
              <ElIconService
                style="width: 80%; height: 80%"
                text-light-600
              />
            </el-tooltip>
          </div>
          <!-- 购物车 -->
          <MenuShopCartBar
            class="mt-3 w-3rem h-3rem"
            v-if="menu.includes('shopcart') && user.isLogin"
            key="shopcart"
          />
        </div>
        <ElIconMenu
          class="fold w-3rem z-1 h-3rem p-3 transition-300 group-hover:-rotate-90 hover:scale-105 cursor-pointer text-light bg-[var(--el-color-primary)] rounded-1/2"
          style="box-shadow: 1px 1px 6px var(--el-color-primary-light-3)"
        />
      </div>
    </KeepAlive>
  </ClientOnly>
</template>
<style scoped lang="scss">
.btns {
  z-index: 999;
  position: fixed;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  bottom: 1vw;
  right: 1vw;
  padding: 1rem;
  transition: $transition-delay;
}

:deep(.el-backtop) {
  position: static;
  background-color: var(--el-color-info);
  color: #fff;
  font-size: 2em;
}
.btn-group {
  transition: all 0.4s;
  position: relative;
  align-items: center;
  .btn {
    opacity: 0;
    transform: translateY(100%) scale3d(0, 0, 0.4);
    width: 0;
    height: 0;
    z-index: 0;
    transition: 0.3s $animate-cubic-bount;
  }
}
.btns:hover .btn-group {
  .btn {
    opacity: 1;
    width: 3rem;
    height: 3rem;
    transform: translateY(0) scale(1);
  }
}
</style>
