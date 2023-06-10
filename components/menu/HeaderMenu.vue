
<template>
  <ElAffix>
    <!-- 左侧 -->
    <div class="nav" flex-row-bt-c py-4 px-6 text-m bg="white" dark:text="light" dark:bg-black shadow>
      <div class="left" flex-row-c-c>
        <NuxtLink ml-2 to="/" flex-row-c-c>
          <img w-34px object-contain src="@/assets/images/logo/logo.svg" class="logo"> <span tracking-2 m-4 font-700
            text-xl>极物圈</span>
        </NuxtLink>
      </div>
      <!-- 右侧 -->
      <div class="right" flex flex-items-center>
        <!-- 搜索框 -->
        <!-- 切换主题 -->
        <BtnSwitch />
        <!-- 登陆注册 -->
        <span px-2 cursor-pointer @click="onLogin(1)">登 录</span>
        &nbsp;|&nbsp;
        <span px-2 cursor-pointer @click="onLogin(2)">注 册</span>
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
</script>
<style lang="scss" scoped> .nav {
   z-index: 999;
   height: $top-nav-height;
   background-image: radial-gradient(transparent 1px, $theme-bg-color2 1px);
   background-size: 4px 4px;
   backdrop-filter: saturate(50%) blur(1.4rem);
 }

 .dark .nav {
   background-image: radial-gradient(transparent 1px, $theme-bg-color 1px);
   background-size: 4px 4px;
   backdrop-filter: saturate(50%) blur(1.4rem);
 }
</style>