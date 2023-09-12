<script lang="ts" setup>
const { menu } = defineProps({
  menu: {
    default: ["shopcart"],
    required: false,
  },
});
const user = useUserStore();
const router = useRouter();
function toBack() {
  if (history.length > 1)
    router.back();
  else
    navigateTo("/");
}
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="group btns flex flex-col px-2">
        <div class="btn-group flex flex-col justify-end py-3">
          <!-- 回到顶部 -->
          <el-backtop
            key="backtop"
            style="width: 3rem; height: 3rem; overflow: visible"
            class="btn cursor-pointer rounded-1/2 rounded-1/2 shadow-[#0bdb85] shadow-md shadow-opacity-60 transition-300"
          >
            <i
              class="h-3/5 w-3/5"
              i-solar:alt-arrow-up-bold
              text-light
            />
          </el-backtop>
          <!-- 返回 -->
          <span
            v-if="menu.includes('back')"
            key="back"
            class="btn bg-[var(--el-color-primary)] shadow-[var(--el-color-primary)] shadow-md shadow-opacity-40"
            mt-3
            h-3rem w-3rem flex-row-c-c cursor-pointer rounded-4em p-1 transition-300 @click="toBack()"
          >
            <i
              class="h-2/3 w-2/3"
              i-solar:alt-arrow-left-line-duotone mr-0.5 text-light
            />
          </span>
          <!-- 返回首页 -->
          <NuxtLink
            v-if="menu.includes('home')"
            key="home"
            to="/"
            class="btn shadow-[var(--el-color-primary)] shadow-md shadow-opacity-40"
            style="background-color: var(--el-color-primary)"
            mt-3 h-3rem w-3rem flex-row-c-c rounded-4em p-1 transition-300
          >
            <i
              i-solar:home-smile-outline p-2.6 text-light
            />
          </NuxtLink>
          <!-- 客服 -->
          <div
            v-if="menu.includes('service') && user.isLogin"
            key="service"
            class="btn mt-3 h-3rem w-3rem flex-row-c-c cursor-pointer rounded-1/2 bg-[var(--el-color-info)] p-2.4 shadow-lg transition-300"
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
            v-if="menu.includes('shopcart') && user.isLogin"
            key="shopcart"
            class="mt-3 h-3rem w-3rem"
          />
        </div>
        <ElIconMenu
          class="fold z-1 h-3rem w-3rem cursor-pointer rounded-1/2 bg-[var(--el-color-primary)] p-3 text-light transition-300 hover:scale-105 group-hover:-rotate-90"
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
    width: 3rem;
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
