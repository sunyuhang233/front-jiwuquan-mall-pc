<script lang="ts" setup>
import { getLoginDeviceList, DeviceIpInfo, toUserOffline } from "@/composables/api/user/safe";
const user = useUserStore();
const isLoading = ref<boolean>(false);

const deviceList = ref<DeviceIpInfo[]>([]);
// 信息
const getDeviceList = async () => {
	const { data } = await getLoginDeviceList(user.getToken);
	let result: DeviceIpInfo[] = data.sort((a, b) => b.isLocal - a.isLocal);
	let getList = [];
	for (const p of result) {
		getList.push(getDeviceIpInfo(p.ip));
	}
	// 获取地址
	const ProList = await Promise.all(getList);
	ProList.forEach((p, i) => {
		result[i] = {
			...p.data,
			...result[i],
		};
	});
	deviceList.value.push(...result);
	return true;
};
useAsyncData(async () => {
	await getDeviceList();
});
// 刷新
const reload = async () => {
	if (isLoading.value) return;
	deviceList.value.splice(0);
	isLoading.value = true;
	const flag = await getDeviceList();
	setTimeout(() => {
		isLoading.value = false;
		ElMessage.success(flag ? "刷新成功🎉！" : "刷新失败，请稍后重试！");
	}, 500);
};

// 用户下线
const exitLogin = (ua?: string) => {
	ElMessageBox.confirm("是否确认下线用户?", "确认选择", {
		cancelButtonText: "取消",
		confirmButtonText: "确认下线",
		confirmButtonClass: "el-button--danger",
	})
		.then(async (action) => {
			if (action === "confirm") {
				let arr = ua ? [ua] : (deviceList.value?.map((p) => p.userAgentString) as string[]);
				const { code, message } = await toUserOffline(arr, user.getToken);
				if (code === StatusCode.SUCCESS) {
					if (deviceList.value) {
						for (let i = 0; i < deviceList.value.length; i++) {
							deviceList.value.splice(i, 1);
						}
					}
					ElMessage.success("下线成功！");
				} else {
					ElMessage.error(message);
				}
			}
		})
		.catch(() => {});
};
</script>
<template>
	<div class="group">
		<strong block opacity-70 my-4>
			<i p-2.5 mr-2 i-solar:devices-outline />
			登录设备
			<i
				@click="reload"
				opacity-0
				transition-300
				group-hover:opacity-100
				class="px-3 float-right hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)]"
			/>
		</strong>
		<div
			class="v-card h-full overflow-hidden group p-5 shadow-sm select-none border-default rounded-14px"
			v-loading="isLoading"
		>
			<!-- 列表 -->
			<transition-group name="item-list" tag="div" class="grid grid-cols-3 grid-gap-3">
				<UserSafeDeviceCard
					class="cursor-pointer hover:border-[var(--el-color-info)]"
					:data="p"
					v-for="p in deviceList"
					:key="p.id"
				>
					<div></div>
					<el-button
						@click="exitLogin(p.userAgentString)"
						v-if="!p.isLocal"
						size="small"
						type="danger"
						style="padding: 0 8px"
						plain
						>下线
					</el-button>
				</UserSafeDeviceCard>
			</transition-group>
		</div>
	</div>
</template>
<style scoped lang="scss">
.bg-btn {
	background-color: var(--el-color-danger);
	border-color: var(--el-color-danger);
}
</style>