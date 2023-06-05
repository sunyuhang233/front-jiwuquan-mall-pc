<script lang="ts" setup>
import { ref } from 'vue'
import LogoText from '@/assets/images/logotext.svg'
// 登录表单
let showForm = ref<boolean>(false)
const onLogin = (type: number) => {
  if (type === 1) {
    showForm.value = true
  } else {
    showForm.value = false
  }
  showForm.value = !showForm.value
}
</script>
<template>
    <!-- 左侧 -->
    <div class="nav" flex-row-bt-c min-w-screen py-4 px-6 text-m bg="white" dark:text="light" dark:bg-black shadow>
    <div class="left">
      <OtherSvgIcon :name="'logo.text'"/>
      <img :src="LogoText" alt="">
      <span tracking-2 font-700 text-xl>极物圈</span>
    </div>
    <!-- 右侧 -->
    <div class="right" flex flex-items-center>
      <!-- 切换主题 -->
      <BtnSwitch/>
      <span px-2 cursor-pointer @click="onLogin(1)">登 录</span>
      &nbsp;|&nbsp;
      <span px-2 cursor-pointer @click="onLogin(2)">注 册</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.nav {
  background-image: radial-gradient(transparent 1px, $theme-bg-color2 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(10px);
}

.dark .nav {
  background-image: radial-gradient(transparent 1px, $theme-bg-color 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(10px);
}
</style>