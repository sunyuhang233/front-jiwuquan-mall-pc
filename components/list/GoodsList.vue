<script lang="ts" setup>
import { type GoodsPageDTO } from '@/composables/api/goods';
import { getGoodsListByPage } from '@/composables/api/goods';
import { IPage } from '~/types';
import { GoodsVO } from '~/types/goods';

// props
const props = defineProps<{
	dto: GoodsPageDTO;
}>();

const isLoading = ref<boolean>(false);
// 商品列表
const goodsList = ref<GoodsVO[]>([]);
// 分页器
const page = ref<number>(0);
const size = ref<number>(10);
// 查询页信息
let pageInfo = reactive<IPage<GoodsVO>>({
	records: [],
	total: -1,
	pages: -1,
	size: -1,
	current: -1,
});
const isNoMore = computed<boolean>(() => goodsList.value.length === pageInfo?.total);

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
	if (!data?.records) return;
	for await (const p of data.records) {
		await new Promise((resolve) => {
			timer = setTimeout(() => {
				p.images = typeof p.images === 'string' ? p.images.split(',') : [];
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
	goodsList.value = [];
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
</script>
<template>
	<div class="goods-list" overflow-hidden flex style="overflow: auto" flex-wrap>
		<ClientOnly>
			<transition-group name="popup">
				<!-- 商品卡片 -->
				<CardGoodsBox
					@click="toGoodsView(p.id)"
					class="mr-5 my-5 transition-300"
					:goods="p"
					:key="p.id"
					v-infinite-scroll="loadGoodsPage"
					:infinite-scroll-disabled="isNoMore || !isLoading"
					element-loading-background="transparent"
					v-for="p in goodsList"
				>
					<small float-right mt-2px text-blueGray>销量：{{ p.sales }}</small>
				</CardGoodsBox>
			</transition-group>
			<p class="w-1/1 pt-2" text-blueGray tracking-1 text-center v-show="isNoMore">
				暂无更多商品
			</p>
			<div class="loading w-1/1" v-loading="isLoading" p-5em></div>
		</ClientOnly>
	</div>
</template>
<style scoped lang="scss">
:deep(.el-loading-mask) {
	background-color: transparent;
}
</style>
