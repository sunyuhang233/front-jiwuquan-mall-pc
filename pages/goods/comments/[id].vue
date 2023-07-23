<script lang="ts" setup>
const route = useRoute();
</script>
<template>
	<div>
		<NuxtLayout :left-menu="false" :menu="['shopcart', 'back']">
			<h3 class="text-center">{{ route.query.id }}</h3>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
