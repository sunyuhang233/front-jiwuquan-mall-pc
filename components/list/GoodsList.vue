<script lang="ts" setup>
import { type GoodsPageDTO } from "@/composables/api/goods";
import { getGoodsListByPage } from "@/composables/api/goods";
import { IPage } from "~/types";
import { GoodsVO } from "~/types/goods";

// props
const props = defineProps<{
	dto: GoodsPageDTO;
	limit?: number;
	load?: boolean;
}>();

const isLoading = ref<boolean>(false);
// 商品列表
const goodsList = ref<GoodsVO[]>([]);
// 分页器
const page = ref<number>(0);
const size = ref<number>(props.limit || 10);
// 查询页信息
let pageInfo = reactive<IPage<GoodsVO>>({
	records: [],
	total: -1,
	pages: -1,
	size: -1,
	current: -1,
});
const isNot = ref<boolean>(false);
const isNoMore = computed<boolean>({
	get() {
		return goodsList.value.length === pageInfo?.total;
	},
	set(val: boolean) {},
});

const loadGoodsPage = async () => {
	if (isLoading.value) return;
	isLoading.value = true;
	page.value++;
	const { data } = await getGoodsListByPage(page.value, size.value, props.dto);

	// 没有更多
	if (isNoMore.value || data?.total === -1) {
		return (isLoading.value = false);
	}
	// 展示结果
	pageInfo = toReactive({ ...data });
	let timer: NodeJS.Timeout | null;
	if (!data?.records || data?.records.length === 0) {
		isNot.value = true;
		return (isLoading.value = false);
	} else {
		isNot.value = false;
	}
	for await (const p of data.records) {
		await new Promise((resolve) => {
			timer = setTimeout(() => {
				p.images = typeof p.images === "string" ? p.images.split(",") : [];
				goodsList.value.push(p);
				clearTimeout(timer ?? undefined);
				timer = null;
				isLoading.value = false;
				return resolve(true);
			}, 50);
		});
	}
};
loadGoodsPage(); // 加载一次
const clearResult = () => {
	goodsList.value.splice(0);
	pageInfo = reactive({
		records: [],
		total: -1,
		pages: -1,
		size: -1,
		current: -1,
	});
};
const router = useRouter();
const toGoodsView = (id: string) => {
	router.push({
		path: `/goods/detail/${id}`,
	});
};
// 条件筛选
const dto = toReactive(props.dto);
watch(
	dto,
	() => {
		clearResult();
		loadGoodsPage();
	},
	{ deep: true, immediate: true }
);

defineExpose({
	clearResult, // 清除
	loadGoodsPage,
	goodsList,
	pageInfo,
});
</script>
<template>
	<div class="goods-list min-h-80vh" style="overflow: auto">
		<ClientOnly>
			<transition-group
				tag="div"
				name="fade-list"
				v-infinite-scroll="loadGoodsPage"
				:infinite-scroll-disabled="isNoMore || !isLoading || props.limit"
				:infinite-scroll-delay="300"
				class="flex flex-wrap relative overflow-x-hidden"
			>
				<!-- 商品卡片 -->
				<CardGoodsBox
					@click="toGoodsView(p.id)"
					class="mr-5 mt-8 transition-300"
					element-loading-background="transparent"
					:goods="p"
					:key="p.id"
					v-for="p in goodsList"
				>
					<small float-right mt-2px text-blueGray>销量：{{ p.sales }}</small>
				</CardGoodsBox>
			</transition-group>
		</ClientOnly>
		<p class="w-1/1 pt-2" text-blueGray tracking-1 text-center v-show="isNoMore">
			暂无更多商品
		</p>
		<p class="w-1/1 pt-2" text-blueGray tracking-1 text-center v-show="isNot">暂无商品</p>
		<div class="loading w-1/1" v-loading="isLoading" p-5em></div>
	</div>
</template>
<style scoped lang="scss">
:deep(.el-loading-mask) {
	background-color: transparent;
}
</style>
