<script lang="ts" setup>
import { IPage } from "types";
import {
	getAllOrderPage,
	getOrderPageByDTO,
	OrdersStatus,
	type OrderInfoVO,
	type OrdersPageDTO,
} from "~/composables/api/orders";
// props
const props = withDefaults(
	defineProps<{
		dto?: OrdersPageDTO;
		status?: OrdersStatus;
		isAll?: boolean;
	}>(),
	{
		dto: () => {
			return {};
		},
		status: () => OrdersStatus.UN_PAID,
		isAll: () => false,
	}
);
// store
const user = useUserStore();
const isLoading = ref<boolean>(false);
// 列表
const list = ref<OrderInfoVO[]>([]);
// 分页器
const page = ref<number>(0);
const size = ref<number>(10);
// 查询页信息
const pageInfo = ref({
	total: -1,
	pages: -1,
	current: -1,
});
// 计算
const isNotMore = computed(() => {
	return page.value === pageInfo.value.pages;
});
const isNothing = computed(() => {
	return pageInfo.value.total === 0;
});

// 加载数据
const loadOrdersPage = async () => {
	if (isNotMore.value || isNotMore.value || isLoading.value) return;
	isLoading.value = true;
	// 翻页
	page.value++;
	const { data, code } = props.isAll
		? await getAllOrderPage(page.value, size.value, props.dto || {}, user.getToken)
		: await getOrderPageByDTO(
				props.status,
				page.value,
				size.value,
				props.dto || {},
				user.getToken
		  );
	if (code === StatusCode.SUCCESS) {
		if (data.records.length) {
			list.value.push(...data.records);
		}
		pageInfo.value = {
			total: data.total,
			pages: data.pages,
			current: data.current,
		};
	} else {
		ElMessage.error("获取失败，请稍后再试！");
	}
};
loadOrdersPage();
</script>
<template>
	<ClientOnly fallback-tag="div" class="w-full h-full">
		<!-- 列表 -->
		<transition-group
			name="fade"
			tag="div"
			calss="flex
			flex-col"
			v-infinite-scroll="loadOrdersPage"
			:infinite-scroll-delay="600"
			:infinite-scroll-distance="50"
		>
			<OrderInfoLine :order="p" v-for="p in list" :key="p.id" />
			<p class="w-1/1 py-4" text-blueGray tracking-1 text-center v-show="isNotMore">
				暂无更多订单
			</p>
			<p class="w-1/1 py-4" text-blueGray tracking-1 text-center v-show="isNothing">
				暂无订单，快去下单吧 ~
			</p>
		</transition-group>
	</ClientOnly>
</template>
<style scoped lang="scss"></style>
