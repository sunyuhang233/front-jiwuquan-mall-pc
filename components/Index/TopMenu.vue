<template>
  <div class="top " overflow-hidden flex-row-bt-c flex-col md:flex-row>
    <!-- bg -->
    <img absolute bg-color-indigo-6 z-0 flex-2 src="@/assets/images/logo/logo_txt.png" filter-blur-30 w-240px
      alt="极物圈 logo">
    <!-- 问候语 -->
    <div class="title animate__animated animate__fadeInDown" mt-4 mb-8>
      <ClientOnly>
        <p text-lg py-2 tracking-1 opacity-80>
          {{ useNowDateText(new Date()) }}好，
          <mark class="mark1">{{ state?.userInfo?.nickname || "你还未登录" }} ！</mark>
        </p>
      </ClientOnly>
      <h2 tracking-1>欢迎来到<mark class="mark1 animatejs">极物圈社区 </mark>🎉</h2>
    </div>
    <!-- 搜索 -->
    <div class="animate__animated animate__pulse" animate-delay-500 p-2>
      <IndexSearch />
    </div>
  </div>
</template>
<script lang="ts" setup>
// state
const state = useUserStore()


</script>
<style lang="scss"></style>
