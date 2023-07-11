<script lang="ts" setup>
const user = useUserStore();

// 定义当前页面
// definePageMeta({
// 	middleware: ["auth"],
// });
useHead({
	title: "我的钱包 - 个人中心",
	meta: [
		{
			name: "description",
			content: "个人中心-极物钱包",
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
