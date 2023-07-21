<script lang="ts" setup>
import { BillsInfoVO, getBillsPage } from "@/composables/api/user/bills";
import type { CalendarDateType, CalendarInstance } from "element-plus";
// 数据
const user = useUserStore();
const selectDay = ref<Date>(new Date());
const isNowDay = ref<boolean>(false); // 是否本月
const selectDayFormat = computed(() => {
	return useDateFormat(selectDay.value, "YYYY年M月DD日").value;
});
// 选中的月份开始和结束时间
const monthStartEndStr = computed((): string[] => {
	return getMonthStartEnd(selectDay.value).map(
		(p) => useDateFormat(p, "YYYY-MM-DD hh:mm:ss").value
	);
});

// 实例
const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
	if (!calendar.value) return;
	calendar.value.selectDate(val);
};
// 账单数据分页
const isLoading = ref<boolean>(false);
const page = ref<number>(-1);
const size = ref<number>(6);
const billsList = ref<BillsInfoVO[]>([]);
const billsPage = useAsyncData(
	"jiwuquan_billsPage",
	async () => {
		return await getBillsPageApi();
	},
	{
		lazy: true,
	}
).data;
/**
 * 请求api
 */
const getBillsPageApi = async () => {
	isLoading.value = true;
	// 1、页数+1
	page.value++;
	const dto = isNowDay
		? {
				startTime: useDateFormat(selectDay.value, "YYYY-MM-DD hh:mm:ss").value,
				endTime: useDateFormat(
					selectDay.value.getTime() + 36000 * 24,
					"YYYY-MM-DD hh:mm:ss"
				).value,
		  }
		: { startTime: monthStartEndStr.value[0], endTime: monthStartEndStr.value[1] };
	// 2、请求
	const { data, code } = await getBillsPage(page.value, size.value, { ...dto }, user.getToken);
	setTimeout(() => {
		isLoading.value = false;
	}, 500);

	// 3、结果
	if (code === StatusCode.SUCCESS) {
		if (data.records.length > 0) {
			billsList.value.push(...data.records);
		}
		return data;
	} else {
		return {
			records: [],
			total: -1,
			pages: -1,
			size: -1,
			current: -1,
		};
	}
};
// 重新加载
const reloadBills = () => {
	billsList.value = [];
	billsPage.value = {
		records: [],
		total: -1,
		pages: -1,
		size: -1,
		current: -1,
	};
	size.value = 6;
	page.value = -1;
	getBillsPageApi();
};
const noMore = computed(() => billsList.value.length >= (billsPage.value?.total || 0));
watch(selectDay, (val) => {
	if (isLoading.value) {
		return;
	} else {
		reloadBills();
	}
});
</script>
<template>
	{{ billsList.length }}
	<div class="shadow p-5 bg-light-3 dark:bg-dark-3 border-none grid grid-cols-1 rounded-14px">
		<div class="top">
			<!-- 头部 -->
			<h3 class="mb-3" text-center>
				<i i-solar:calendar-broken p-2.6 mr-2></i>
				账单日历
			</h3>
			<!-- 日历 -->
			<div class="select-none caledar shadow-sm dark:shadow-md rounded-12px">
				<el-calendar v-model="selectDay" ref="calendar">
					<template #header="{ date }">
						<div class="flex-row-bt-c w-full cursor-pointer">
							<i
								class="i-solar:alt-arrow-left-line-duotone p-3 hover:scale-110"
								@click="selectDate('prev-month')"
							/>
							<h3 text-center w-full mt-1>
								{{ selectDayFormat }}
							</h3>
							<i
								class="i-solar:alt-arrow-right-line-duotone p-3 hover:scale-110"
								@click="selectDate('next-month')"
							/>
						</div>
					</template>
				</el-calendar>
			</div>
		</div>
		<!-- 账单列表 -->
		<div clas="bottom  overflow-hidden" v-loading="isLoading">
			<div class="my-4 text-center opacity-90" v-show="!isNowDay">
				{{ selectDay.getMonth() + 1 }}月的账单
			</div>
			<div class="my-4 text-center opacity-90" v-show="isNowDay">
				{{ selectDayFormat }}的账单
			</div>
			<div class="bills-list relative mt-2 bg-white v-card rounded-14px p-3">
				<div class="btns">
					<el-checkbox-button v-model="isNowDay" :label="isNowDay ? '按日' : '按月'" />
				</div>
				<!-- 滚动 -->
				<el-scrollbar
					height="20rem"
					v-infinite-scroll="getBillsPageApi"
					:infinite-scroll-delay="400"
				>
					<transition-group name="fade-list">
						<UserWalBillsCard v-for="p in billsList" :key="p.id" :data="p" />
					</transition-group>
					<small class="block opacity-80 text-center my-2 w-full select-none">
						{{ noMore ? "没有更多数据了" : "加载中..." }}
					</small>
				</el-scrollbar>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
.caledar {
	$item-height: 2em;

	:deep(.el-calendar) {
		overflow: hidden;
		border-radius: 12px;
		border: none;

		.el-calendar__body {
			padding: 0 0.8rem 0.8rem 0.8rem;
			.el-calendar-table {
				thead {
					opacity: 0.5;
				}

				.el-calendar-day {
					display: flex;
					align-items: center;
					justify-content: center;
					text-align: center;
					// border-radius: 50%;
					overflow: hidden;
					border-radius: 50%;
					height: 2.3em;
					padding: 0;
					transition: $transition-delay;
					background-color: transparent;
				}
				.current {
					span {
						transition: 0.2s;
						width: $item-height;
						height: $item-height;
						line-height: $item-height;
						border-radius: 50%;
					}
					span:hover {
						background-color: var(--el-color-info);
						color: #fff;
					}

					&.is-selected {
						background-color: transparent;
						span {
							background-color: var(--el-color-info);
							color: #fff;
						}
					}
					&.is-today {
						background-color: transparent;
						span {
							background-color: var(--el-color-info-light-5);
							color: #fff;
						}
					}
				}
			}
		}
		* {
			border: none;
		}
	}
}

:deep(.el-checkbox) {
	transform: scale(1.1);
}
:deep(.el-scrollbar) {
	height: auto;
}
</style>
