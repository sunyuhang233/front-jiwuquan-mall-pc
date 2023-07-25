<script lang="ts" setup>
import { getLoginDeviceList, DeviceInfo } from "@/composables/api/user/safe";
const user = useUserStore();
const diviceList = ref<DeviceInfo[]>([]);
getLoginDeviceList(user.getToken).then(({ data, code }) => {
	if (code === StatusCode.SUCCESS) {
		diviceList.value.push(...data);
	}
});
</script>
<template>
	<div class="card">
		<strong block opacity-70 my-4>登录设备</strong>
		<div class="v-card p-5 shadow-sm rounded-14px">
			<div class="v-card" v-for="(p, i) in diviceList" :key="p.id">
				{{ p }}
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss"></style>
