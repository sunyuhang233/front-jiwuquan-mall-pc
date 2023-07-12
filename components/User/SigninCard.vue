<script lang="ts" setup>
const user = useUserStore();
const points = toRef<number>(user.userWallet.points || 0);
const getLeave = computed(() => {
	let leave = 0;
	if (points.value > 0 && points.value < 3000) {
		leave = 0;
	} else if (points.value < 10000) {
		leave = 1;
	} else if (points.value < 20000) {
		leave = 1;
	} else if (points.value < 30000) {
		leave = 3;
	} else if (points.value < 40000) {
		leave = 4;
	} else if (points.value < 50000) {
		leave = 5;
	}
	return leave;
});
</script>
<template>
	<div class="py-6 px-10 rounded-4px min-w-360px max-w-500px v-card">
		<div class="flex justify-between">
			<!-- 积分 -->
			<strong class="opacity-90 hover:scale-110 transition-300 cursor-pointer flex-row-c-c">
				<small text-1em mr-4>积分</small>
				<h2 inline-block v-incre-up-int="points"></h2>
			</strong>
			<!-- 等级 -->
			<div flex flex-col w-6em >
				<small pb-3>等级：lv.{{ getLeave }}</small>
				<el-progress :percentage="getLeave * 10" :show-text="false" striped />
			</div>
		</div>
		<!-- 签到按钮 -->
		<div class="btn my-4">
			<el-button type="info"> 签 到 </el-button>
			<small opacity-80 ml-3>每日签到+100积分</small>
		</div>
		<el-tooltip content="1、通过每日签到" placement="bottom">
			<small cursor-pointer text-blueGray underline
				>如何获取积分? <i p-2 ml-2 text-blueGray i-solar:dollar-linear></i
			></small>
		</el-tooltip>
	</div>
</template>
<style scoped lang="scss"></style>
