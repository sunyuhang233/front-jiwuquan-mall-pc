<template> 
  <el-switch v-model="isDark" inline-prompt @change="changeTheme"> 
  </el-switch>
  <OtherMoonSun pl-2/>
</template>
<script lang="ts" setup>
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
<style scoped lang="scss"></style>
