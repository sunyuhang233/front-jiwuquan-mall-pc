<script lang="ts" setup>
const route = useRoute();
useSeoMeta({
	title: "极物 " + "",
	description: () => "",
});
</script>
<template>
	<div>
		<NuxtLayout :left-menu="false" :menu="['shopcart', 'back']">
			<template>
				{{ route.query.eid }}
			</template>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
