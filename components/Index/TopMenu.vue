<template>
  <div class="top animate__animated animate-fadeIn" overflow-hidden flex-row-bt-c flex-col md:flex-row>
    <!-- bg -->
    <img absolute bg-color-indigo-6 z-0 flex-2 src="@/assets/images/logo/logo_txt.png" filter-blur-40 w-240px alt="极物圈 logo">
    <!-- 问候语 -->
    <div class="title" mt-4 mb-8 >
      <p text-lg py-2 tracking-1 opacity-80>{{ useNowDateText(new Date()) }}好，{{ state?.userInfo?.nickname || "你还未登录！" }}</p>
      <h2 tracking-1  >欢迎来到极物圈商城</h2>
    </div>
    <!-- 搜索 -->
    <IndexSearch />
  </div>
</template>
<script lang="ts" setup>
// state
const state = useUserStore()


</script>
<style scoped lang="scss"></style>
