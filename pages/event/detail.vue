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
      {{ route.query.eid }}
    </div>
  </NuxtLayout>
</template>
<style scoped lang="scss"></style>
