<script lang="ts" setup>
const user = useUserStore();
useHead({
	title: "账户与安全 - 个人中心",
	meta: [
		{
			name: "description",
			content: "极物圈-账户与安全",
		},
	],
});
// 页面 
definePageMeta({
	pageTransition: false,
	layoutTransition: false
});
</script>
<template>
	<NuxtLayout name="user" :menu="['back']" :footer="false"> </NuxtLayout>
</template>
<style scoped lang="scss"></style>
