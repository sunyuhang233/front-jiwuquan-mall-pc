<script setup lang="ts">
const router = useRouter()
onMounted(() => {
})
</script>

<template>
  <main p="x4 y10" text="center teal-700 dark:gray-200">
    <div text-4xl>
      <div i-carbon-warning inline-block />
    </div>
    <div text-5xl py-2>404 Not found</div>
    <div text-4xl >没有找到对应页面!</div>
    <div>
      <NuxtLink to="/" p-2 bg-yellow-4 text-white  m="3 t8" >
        返回主页
      </NuxtLink>
    </div>
  </main>
</template>
