<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
definePageMeta({
  layout: 'default'
})
</script>
<template>
  <NuxtLayout>
    <div>
      搜索详情页
      {{ route.params.eid }}
    </div>
  </NuxtLayout>
</template>
<style scoped lang="scss"></style>
