<script lang="ts" setup>
import { getLoginDeviceList, toUserOffline, DeviceInfo } from "@/composables/api/user/safe";
const user = useUserStore();
const isLoading = ref<boolean>(false);
// 信息
const fetchData = useAsyncData(
	async () => {
		const { data } = await getLoginDeviceList(user.getToken);
		data.sort((a, b) => b.isLocal - a.isLocal);
		return data;
	},
	{
		lazy: true,
	}
);
// 刷新
const reload = async () => {
	if (isLoading.value) return;
	isLoading.value = true;
	await fetchData.refresh();
	setTimeout(() => {
		isLoading.value = false;
		ElMessage.success("刷新成功🎉！");
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
				let arr = ua
					? [ua]
					: (fetchData.data.value?.map((p) => p.userAgentString) as string[]);
				const { code, message } = await toUserOffline(arr, user.getToken);
				if (code === StatusCode.SUCCESS) {
					if (fetchData.data.value) {
						for (let i = 0; i < fetchData.data.value.length; i++) {
							fetchData.data.value.splice(i, 1);
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
console.log(fetchData.data);
</script>
<template>
	<div class="card group" v-loading.fullscreen="isLoading">
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
		<div class="v-card p-5 shadow-sm border-default rounded-14px">
			<!-- 列表 -->
			<transition-group name="item-list" tag="div" class="grid grid-cols-3 grid-gap-3">
				<UserSafeDeviceCard :data="p" v-for="p in fetchData.data.value" :key="p.id">
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
