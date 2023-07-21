<script lang="ts" setup>
import { BillsTotalVO, getBillsTotal } from "@/composables/api/user/bills";
import { getUserLeave } from "@/composables/utils";
import { LineWalletDataType } from "./TotalCard.vue";
const user = useUserStore();
const isLoading = ref<boolean>(true);
// 账单统计
const totalData = ref<TotalVO>({ totalIn: 0, totalOut: 0, monthTotal: 0 });

interface TotalVO extends BillsTotalVO {
	monthTotal?: number;
}
const monthTime = getMonthStartEnd();
// 获取总消费和总收入
const getAllTotals = async () => {
	const { data, code } = await getBillsTotal(
		{
			currencyType: 0,
		},
		user.getToken
	);
	if (code === StatusCode.SUCCESS) {
		totalData.value.totalIn = data.totalIn;
		totalData.value.totalOut = data.totalOut;
	}
};

// 获取月份的统计
const getMonthTotals = async () => {
	const { data, code } = await getBillsTotal(
		{
			type: 0,
			currencyType: 0,
			startTime: useDateFormat(monthTime[0], "YYYY-MM-DD hh:mm:ss").value,
			endTime: useDateFormat(monthTime[1], "YYYY-MM-DD hh:mm:ss").value,
		},
		user.getToken
	);
	if (code === StatusCode.SUCCESS) {
		// 本月支出
		totalData.value.monthTotal = data.totalOut;
	}
};
const reloadData = async () => {
	isLoading.value = true;
	await getAllTotals();
	await getMonthTotals();
	isLoading.value = false;
};
await reloadData();
// 监听重新查询
watch(
	user.userWallet,
	async () => {
		await reloadData();
	},
	{ deep: true, immediate: true }
);

// 列表配置项
const list = ref<LineWalletDataType[]>([
	{
		title: "总 支 出",
		name: `支出`,
		amount: computed(() => totalData.value.totalOut),
		percentage: computed(() => ((totalData.value.totalOut || 0) / 10000) * 100),
		isIncreAnimate: true,
		isInt: false,
		lightColor: "var(--el-color-error)",
		class: "  dark:bg-#333333 dark:text-bluegray-2",
	},

	{
		title: "总 收 入",
		name: "收入",
		amount: computed(() => totalData.value.totalIn),
		percentage: computed(() => ((totalData.value.totalIn || 0) / 10000) * 100),
		isIncreAnimate: true,
		isInt: false,
		lightColor: "var(--el-color-info)",
		class: "  dark:bg-#333333 dark:text-bluegray-2",
	},
	{
		title: "本月消费",
		name: `${monthTime[0].getMonth() + 1}月`,
		amount: computed(() => totalData.value.monthTotal),
		percentage: (monthTime[0].getMonth() + 1) / 12,
		isIncreAnimate: true,
		isInt: false,
		class: " dark:bg-#333333 dark:text-bluegray-2",
	},
]);
const pointsData = ref({
	title: "积分剩余",
	name: computed(() => {
		return getUserLeave(user.userWallet.points) + "级";
	}),
	amount: user.userWallet.points || 0,
	percentage: computed(() => {
		return (getUserLeave(user.userWallet.points) / 6) * 100;
	}),
	isIncreAnimate: true,
	isInt: true,
	lightColor: "#facc15",
	class: " dark:bg-#333333 dark:text-bluegray-2",
});
</script>
<template>
	<KeepAlive>
		<div class="cards">
			<UserWalTotalCard
				class="w-full hover:scale-104 transition-200 cursor-pointer"
				v-for="p in list"
				:key="p.title"
				:data="p"
			/>
			<!-- 积分 -->
			<UserWalTotalCard
				class="w-full hover:scale-104 transition-200 cursor-pointer"
				:data="pointsData"
			>
				<template #default>
					<el-popover :width="160" trigger="hover">
						<template #reference>
							<small cursor-pointer mt-2 text-blueGray underline
								>如何获取积分?
							</small>
						</template>
						<li>1、通过钱包额度充值</li>
						<li>2、通过每日签到</li>
					</el-popover>
				</template>
			</UserWalTotalCard>
		</div>
	</KeepAlive>
</template>
<style scoped lang="scss"></style>