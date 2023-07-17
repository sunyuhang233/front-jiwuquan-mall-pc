<script lang="ts" setup>
const user = useUserStore();
// 加载
const isWalletLoading = ref<boolean>(false);
// 获取
const reLoadUserWallet = async () => {
	if (isWalletLoading.value) return;
	isWalletLoading.value = true;
	const flag = await user.loadUserWallet(user.getToken);
	if (flag) {
		ElMessage.success("更新成功！");
	} else {
		ElMessage.error("更新失败，请稍后重试！");
	}
	setTimeout(() => {
		isWalletLoading.value = false;
	}, 400);
};
</script>
<template>
	<div
		v-loading="isWalletLoading"
		flex
		flex-col
		w-340px
		h-200px
		p-4
		justify-between
		element-loading-background="rgba(0, 0, 0, 0.6)"
		bg="#2d2a3b"
		class="dark:opacity-90 group v-card relative overflow-hidden border-default border-2px shadow-sm rounded-4 text-white"
	>
		<!-- 顶部 -->
		<div flex-row-bt-c>
			<small opacity-90 font-600>
				<i i-solar:banknote-2-bold-duotone mr-2 p-3 bg-white />
				极物圈</small
			>
			<img
				src="@/assets/images/logo/logo.png"
				alt="LOGO Design By Kiwi23333"
				class="w-2em opacity-95 shadow-lg"
			/>
		</div>
		<!-- 余额： -->
		<div class="blance leading-1.6em">
			<span>余额：</span>
			<h2>
				<small>￥</small><span v-incre-up="user.userWallet.balance" mr-2></span>
				<i
					@click="reLoadUserWallet()"
					opacity-0
					transition-300
					group-hover:opacity-100
					class="inline-block hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)] w-0.8em h-0.8em"
				/>
			</h2>
		</div>
		<small block opacity-70>更新于：{{ user.userWallet.updateTime }}</small>
	</div>
</template>
<style scoped lang="scss"></style>
