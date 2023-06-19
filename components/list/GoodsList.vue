<script lang="ts" setup>
const props = defineProps({
  foo: {
    type: String
  }
}) 
</script>
<template>
  <div>
    {{ props }}
  </div>
</template>
<style scoped lang="scss"></style>
