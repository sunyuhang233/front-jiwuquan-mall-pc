<template>
  <i i-solar:sun-2-bold></i>
  <el-switch v-model="isDark" inline-prompt @change="changeTheme"></el-switch>
</template>
<script lang="ts" setup>
import { Icon } from '@iconify/vue';
// 获取主题
const color = useColorMode();
const isDark = ref<boolean>(color.value === 'dark')
// 改变主题
const changeTheme = (val: any): void => {
  if (val) {
    color.preference = 'dark'
  } else {
    color.preference = 'light'
  }
}

</script>
<style scoped lang="scss"> 
</style>
