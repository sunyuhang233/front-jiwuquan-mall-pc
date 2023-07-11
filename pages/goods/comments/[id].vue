<script lang="ts" setup>
const route = useRoute()
</script>
<template>
	<NuxtLayout :left-menu="false" :menu="['shopcart','back']">
<h3 class="text-center">{{ route.query.id }}</h3>
   </NuxtLayout>
</template>
<style scoped lang="scss">

</style>
