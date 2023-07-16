<script lang="ts" setup>
const user = useUserStore();
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
	layoutTransition: false,
});
</script>
<template>
	<div>
		<NuxtLayout name="user" :menu="['back']" :footer="false">
			<div class="wallet-page flex p-4em" v-if="user.isLogin">
				<div class="wallet-card">
					<UserWalletCard />
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss">
.v-card {
	&::after {
		content: "";
		width: 90%;
		height: 60%;
		transform: rotate(45deg) translate(0%, 130%);
		border-radius: 60%;
		position: absolute;
		top: 0;
		z-index: -1;
		filter: blur(30px);
		background-image: linear-gradient(to right, #5983ff, #ff5aa2 50%, #ff8f67 50%);
	}
}
</style>
