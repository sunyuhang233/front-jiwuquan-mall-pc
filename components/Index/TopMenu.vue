<template>
  <div class="relative flex-row-bt-c flex-col md:flex-row">
    <img
      src="@/assets/images/other/index_bg.png"
      class="w-3/4 absolute top-0 -left-1/12 block dark:hidden"
      alt="背景图"
    />
    <img
      src="https://img.js.design/assets/static/04655ded30771e94bfa72bf9dab3cbbf.png"
      class="w-3/4 absolute top-0 -left-1/12 hidden dark:block"
      alt="背景图"
    />
    <!-- 问候语 -->
    <div class="py-10 select-none title animate__animated animate__fadeInDown">
      <ClientOnly>
        <p class="text-lg py-4 tracking-1 opacity-80">
          {{ useNowDateText(new Date()) }}好，
          <span class="mark1 animatejs">{{ user?.userInfo?.nickname || "你还未登录" }} ！</span>
        </p>
      </ClientOnly>
      <span
        font-600
        text-2xl
        tracking-1
      >
        欢迎来到
        <span class="mark3 animate">极物圈社区</span>
        🎉
      </span>
    </div>
    <ClientOnly>
      <!-- 搜索 -->
      <IndexSearch class="pb-10 min-h-6rem md:min-h-a w-full md:w-470px mt-a" />
    </ClientOnly>
  </div>
</template>
<script lang="ts" setup>
const user = useUserStore();
</script>
