<script lang="ts" setup>
useHead({
	title: "信息 - 个人中心",
	meta: [
		{
			name: "description",
			content: "极物圈-个人中心",
		},
	],
});
// 页面
definePageMeta({
	pageTransition: false,
	layoutTransition: false,
});
</script>
<template>
	<div>
		<NuxtLayout name="user" :menu="['back']">
			<div class="userinfo">
				<!-- 壁纸 -->
				<UserBgToggle/>
				<!-- 用户头像 -->
				<div class="mx-4em avatar-card -translate-y-1/3">
					<CardUserLineSe />
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
