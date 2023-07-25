<script lang="ts" setup>
import { DeviceInfo } from "@/composables/api/user/safe";
const { data } = defineProps<{
	data: DeviceInfo;
}>();
</script>
<template>
	<div
		class="v-card flex flex-col leading-1.5em p-4 border-default-dashed border-2px rounded-14px"
	>
		<small class="font-600 mb-3 flex-row-bt-c"
			>IP：{{ data.ip }}
			<el-tag type="info" size="small" v-if="data.isLocal" plain>本机</el-tag>
		</small>
		<small opacity-80 text-0.7em>系统：{{ data.operatingSystem }}</small>
		<small opacity-80 text-0.7em>浏览器：{{ data.browser }}</small>
		<div class="btns flex-row-bt-c mt-1 opacity-0 transition-300 group-hover:opacity-100">
			<slot></slot>
		</div>

		{{}}
	</div>
</template>
<style scoped lang="scss"></style>
