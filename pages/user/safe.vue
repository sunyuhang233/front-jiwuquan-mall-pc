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
	layoutTransition: false,
});
</script>
<template>
	<div>
		<NuxtLayout name="user" :menu="['back']" :footer="false">
			<div class="layout-default flex flex-col mx-a px-2em">
				<div class="title animate__animated animate__fadeInDown" mt-3 mb-6>
					<h2 tracking-1>账户与安全</h2>
				</div>
				<div class="grid md:grid-cols-2 grid-gap-3em">
					<!-- 登录设备 -->
					<UserSafeDevice />
					<!-- 修改信息 -->
					<div class="card">
						<strong block opacity-70 my-4>修改信息</strong>
						<div class="v-card p-5 shadow-sm rounded-14px"></div>
					</div>
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
