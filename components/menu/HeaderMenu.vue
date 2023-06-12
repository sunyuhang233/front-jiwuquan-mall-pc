
<template>
  <ElAffix shadow-md>
    <div class="nav un-select" flex-row-bt-c py-4 px-6 text-m dark:text="light">
      <!-- 左侧 -->
      <div class="left" flex-row-c-c>
        <NuxtLink mx-2 to="/" flex-row-c-c class="group">
          <img w-42px object-contain group-hover:opacity-85 transition-300 group-hover:filter-blur-2px src="@/assets/images/logo/logo.png" dark:hidden>
          <img w-42px object-contain group-hover:opacity-85 transition-300 group-hover:filter-blur-2px src="@/assets/images/logo/logo_dark.png" hidden dark:block>
          <span transition-300 group-hover:block   hidden w-32px h-32px i-solar:home-2-bold absolute left-9 style="color: var(--el-text-color-primary);"></span>
          <span tracking-2 m-4 font-700 text-xl>极物圈</span>
        </NuxtLink>
      </div>
      <!-- 右侧 -->
      <div class="right" flex flex-items-center>
        <!-- 搜索框 -->
        <InputSearch v-model="searchWord" :onSerch="onSerch" />
        <!-- 切换主题 -->
        <BtnSwitch />
        <!-- 登陆注册 -->
        <span px-2 mr-2 cursor-pointer @click="onLogin(1)" dark:border-dark-6 border="white b-solid 2" transition-300 py-1
          class="login">登 录</span>
        <ElButton style="border-radius: 30px;" px-2 mr-2 cursor-pointer @click="onLogin(2)">注 册</ElButton>
      </div>
    </div>
  </ElAffix>
</template>

<script lang="ts" setup>
// 搜索
let searchWord = ref<string>("")
// 登录表单
let showForm = ref<boolean>(false)
const onLogin = (type: number) => {
}
const onSerch = (val: string) => {
}
// 搜索
</script>
<style lang="scss" scoped> .nav {
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
</style>