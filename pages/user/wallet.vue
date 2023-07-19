<script lang="ts" setup>
import { getBillsPage, type BillsInfoVO } from "@/composables/api/user/bills";
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

// 账单数据分页
const isLoading = ref<boolean>(false);
const page = ref<number>(0);
const size = ref<number>(10);
// const billsPage = ref<IPage<BillsInfoVO>>();
const billsPage = useAsyncData(
	"jiwuquan_billsPage",
	async () => {
		const { data, code } = await getBillsPage(page.value, size.value, {}, user.getToken);
		if (code === StatusCode.SUCCESS) {
			return data;
		} else {
			return null;
		}
	},
	{
		lazy: true,
	}
).data;

console.log(billsPage);
</script>
<template>
	<div>
		<NuxtLayout name="user" :menu="['back']" :footer="false">
			<div class="layout-default mt-2em" v-if="user.isLogin">
				<!-- 标题 -->
				<div class="title animate__animated animate__fadeInDown" mt-3 mb-8>
					<p text-lg tracking-1 mb-4>
						{{ useNowDateText(new Date()) }}好，
						<ClientOnly>
							<span class="mark1 animatejs"
								>{{ user?.userInfo?.nickname || "你还未登录" }} ！</span
							>
						</ClientOnly>
					</p>
					<h2 text-2xl tracking-1>你的钱包账单</h2>
				</div>
				<!-------------1------------>
				<div class="grid-content">
					<div
						style="grid-template-columns: 3fr 4fr"
						grid
						grid-gap-3
						grid-content-between
					>
						<!-- 钱包 -->
						<div class="flex py-4 items-center w-450px relative overflow-x-hidden">
							<UserWalSwiperCarts />
						</div>
						<!-- 统计卡片 -->
						<div class="total-list">
							<UserWalTotalList class="px-2 w-full grid grid-cols-2 grid-gap-4" />
						</div>
						<!-- 套餐 -->
						<div class="combo">
							<UserWalCombo />
						</div>
						<!-- 统计表 -->
						<div class="table"></div>
					</div>
					<!-- 日历 -->
					<div>
						<h3>账单</h3>
					</div>
				</div>
				<!-------------2------------>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss">
.grid-content {
	display: grid;
	grid-template-columns: 7fr 3fr;
	grid-template-rows: 1fr;
	grid-column-gap: 1rem;
	grid-row-gap: 2rem;
	justify-items: stretch;
	align-items: stretch;
}
</style>
