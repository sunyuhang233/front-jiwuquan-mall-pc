<script lang="ts" setup>
const user = useUserStore();
</script>

<template>
  <div class="relative flex-row-bt-c flex-col md:flex-row">
    <img
      src="@/assets/images/other/index_bg.png"
      class="absolute top-0 block w-3/4 -left-1/12 dark:hidden"
      alt="背景图"
      loading="lazy"
    >
    <img
      src="https://img.js.design/assets/static/04655ded30771e94bfa72bf9dab3cbbf.png"
      class="absolute top-0 hidden w-3/4 -left-1/12 dark:block"
      loading="lazy"
      alt="背景图"
    >
    <!-- 问候语 -->
    <div class="title animate__animated animate__fadeInDown select-none py-10">
      <ClientOnly>
        <p class="py-4 text-lg tracking-1 opacity-80">
          {{ useNowDateText(new Date()) }}好，
          <span class="mark1 animatejs">{{ user?.userInfo?.nickname || "你还未登录" }} ！</span>
        </p>
      </ClientOnly>
      <span
        text-2xl font-600 tracking-1
      >
        欢迎来到
        <span class="mark3 animate">极物圈社区</span>
        🎉
      </span>
    </div>
    <ClientOnly>
      <!-- 搜索 -->
      <IndexSearch class="mt-a min-h-6rem w-full pb-10 md:min-h-a md:w-470px" />
    </ClientOnly>
  </div>
</template>
