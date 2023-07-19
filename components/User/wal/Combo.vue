<script lang="ts" setup>
import {
	AddWalletDTO,
	RechangeType,
	WalletComboVO,
	addUserWallet,
	getWalletCombo,
} from "@/composables/api/user/wallet";
import { FormInstance } from "vant";
// 套餐数据
const comboList = useAsyncData(
	"comboList_jiwuquan",
	async () => {
		const { data, code } = await getWalletCombo();
		if (code === StatusCode.SUCCESS) {
			return data;
		} else {
			return [];
		}
	},
	{
		lazy: true,
		server: false,
	}
).data;
const user = useUserStore();
// 是否显示弹窗
const isShow = ref<boolean>(false);
// 是否loading
const isLoading = ref<boolean>(false);

/**
 *充值
 * @param formRef
 */
const onRechange = (formRef: FormInstance | undefined) => {
	formRef?.validate().catch(() => {
		return false;
	});
};
/**
 *充值套餐
 * @param obj 钱包参数
 */
const onRechangeByCombo = (obj: WalletComboVO) => {
	ElMessageBox.confirm(`充值${obj.amount}送${obj.points}积分！`, "确认充值？", {
		confirmButtonText: "确认退出",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async (status) => {
			if (status === "confirm") {
				isLoading.value = true;
				// 请求
				if (await toUserRechange({ type: RechangeType.COMBO, id: `${obj.id}` })) {
					ElMessage.success("充值成功！");
					user.loadUserWallet(user.getToken);
				} else {
					ElMessage.success("充值失败，请稍后重试！");
				}

				isLoading.value = false;
			}
		})
		.catch(() => {});
};
/**
 * 充值api
 */
const toUserRechange = async (dto: AddWalletDTO): Promise<boolean> => {
	const { code } = await addUserWallet({ ...dto }, user.getToken);
	return code === StatusCode.SUCCESS;
};
</script>
<template>
	<div class="cards" v-loading.fullscreen.lock="isLoading">
		<h3 mt-4>
			<i i-solar:gamepad-charge-broken p-3 mr-2 />
			充值套餐
		</h3>
		<small block mt-2 mb-4 px-1 opacity-70>充值对应套餐有优惠 💰</small>
		<div class="grid grid-cols-3 grid-gap-3 grid-content-between">
			<!-- 数据 -->
			<div
				class="cursor-pointer hover:scale-105 transition-300 v-card rounded-12px dark:bg-bluegray-4 p-4 text-bluegray-700 dark:text-bluegray-200 leading-2em"
				v-for="(p, i) in comboList"
				:key="p.id"
				@click="onRechangeByCombo(p)"
			>
				<h3>充值￥{{ p.amount }}</h3>
				<small class="opacity-80">赠送{{ p.points }}积分</small>
			</div>
			<!-- 表单弹窗 -->
		</div>
	</div>
</template>
<style scoped lang="scss">
// background-color: var(--el-color-primary);
// .v-card:nth-of-type(2n) {
// 	background-color: var(--el-color-primary);
// }
// .v-card:nth-of-type(3n) {
// 	background-color: var(--el-color-info);
// }
</style>
