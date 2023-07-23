<script lang="ts" setup>
import {
	TimeType,
	getBillsTotalTable,
	BillsType,
	BillsTimeTotalVO,
	BillsTimeTotalDTO,
} from "@/composables/api/user/bills";
// @ts-ignore 引入 vue-echarts 组件
import VChart, { THEME_KEY } from "vue-echarts";
provide(THEME_KEY, useDark().value ? "dark" : "light");
const user = useUserStore();
const selectTime = ref<TimeType>(TimeType.Day);
const isLoading = ref<boolean>(false);
// 参数
const dto = reactive<BillsTimeTotalDTO>({
	currencyType: null,
	type: null,
	timeType: TimeType.Day,
});
// 获取统计信息
const tableData = ref<BillsTimeTotalVO[]>([]);
const inData = computed(() => tableData.value.filter((p) => p.type === BillsType.IN));
const outData = computed(() => tableData.value.filter((p) => p.type === BillsType.OUT));
// 筛选
const timeTypeList = ref([
	{ label: "按日", value: TimeType.Day },
	{ label: "按月", value: TimeType.Month },
	{ label: "按年", value: TimeType.Year },
]);
// echarts配置 图表数据
const option = ref({
	title: {
		text: "账单统计",
	},
	tooltip: {
		trigger: "axis",
	},
	xAxis: {
		boundaryGap: false,
		type: "category",
		data: computed(() => tableData.value.map((p) => p.time)),
	},
	yAxis: {
		type: "value",
	},
	label: {
		// 高亮样式。
		emphasis: {
			itemStyle: {
				// 高亮时点的颜色。
				color: "blue",
			},
			label: {
				show: true,
				// 高亮时标签的文字。
				formatter: "This is a emphasis label.",
			},
		},
	},
	grid: {
		left: "2%",
		right: "2%",
		bottom: "2%",
		containLabel: true,
	},
	legend: {
		data: ["收入", "支出"],
	},
	series: [
		{
			title: "收入",
			name: "收入",
			data: computed(() => inData.value.map((p) => p.total)),
			type: "line",
			smooth: true,
			stack: "Total",
		},
		{
			name: "支出",
			title: "支出",
			data: computed(() => outData.value.map((p) => p.total)),
			type: "line",
			smooth: true,
			stack: "Total",
		},
	],
});
/**
 * 重新加载
 */
const onReload = async () => {
	tableData.value.splice(0);
	const { data, code } = await getBillsTotalTable({ ...dto }, user.getToken);
	if (code === StatusCode.SUCCESS) {
		tableData.value.push(...data);
	}
};
onReload();
</script>
<template>
	<div class="relative w-full" v-loading="isLoading">
		<!-- 排序 -->
		<div class="absolute right-0 z-1">
			<el-select
				@change="onReload"
				v-model="selectTime"
				:placeholder="selectTime || '按日'"
				size="small"
				class="w-6em opacity-90"
			>
				<el-option
					v-for="(p, i) in timeTypeList"
					:key="p.value"
					:label="p.label"
					:value="p.value"
				/>
			</el-select>
		</div>
		<ClientOnly fallback-tag="div">
			<!-- 表格 -->
			<VChart class="w-550px h-450px flex-row-c-c" :option="option" />
		</ClientOnly>
	</div>
</template>
<style scoped lang="scss"></style>
