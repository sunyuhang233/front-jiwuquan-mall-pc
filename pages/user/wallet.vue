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
			<div class="layout-default" v-if="user.isLogin">
				<!-- 标题 -->
				<div class="title animate__animated animate__fadeInDown" mt-3 mb-8>
					<h2 text-2xl tracking-1>你的钱包账单</h2>
				</div>
				<!-- 下方 -->
				<div class="grid-content">
					<!-------------1------------>
					<div style="grid-template-columns: 2fr 4fr" grid grid-gap-10 grid-items-start>
						<!-- 钱包 -->
						<div class="flex py-10 w-400px items-center relative overflow-x-hidden">
							<UserWalSwiperCarts />
						</div>
						<!-- 统计卡片 -->
						<div class="total-list min-w-500px">
							<UserWalTotalList class="w-full grid grid-cols-2 grid-gap-8" />
						</div>
						<!-- 套餐 -->
						<div class="combo">
							<UserWalCombo />
						</div>
						<!-- 统计表 -->
						<div class="table"></div>
					</div>
					<!-------------2------------>
					<div>
						<!-- 账单和日历 -->
						<UserWalBillsTab />
					</div>
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss">
.grid-content {
	display: grid;
	grid-template-columns: 8fr 3fr;
	grid-column-gap: 2.4rem;
	justify-items: stretch;
	align-items: stretch;
}
</style>
