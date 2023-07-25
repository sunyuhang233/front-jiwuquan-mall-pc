<script lang="ts" setup>
import { GoodsCommentsVO, getGoodsCommentPage } from "~/composables/api/goods/comments";
import { GoodsSkuVO } from "~/composables/api/goods/sku";
import { IPage } from "~/types";
const router = useRouter();
const { goodsId, skuList } = defineProps<{
	goodsId: string;
	skuList?: GoodsSkuVO[];
}>();
const isLoading = ref<boolean>(false);
// 商品列表
const commentList = ref<GoodsCommentsVO[]>([]);
// 分页器
const page = ref<number>(0);
const size = ref<number>(10);
// 查询页信息
let pageInfo = reactive<IPage<GoodsCommentsVO>>({
	records: [],
	total: -1,
	pages: -1,
	size: -1,
	current: -1,
});
const isNoMore = computed<boolean>(() => commentList.value.length === pageInfo?.total);
// 商品规格列表 构建map方便查询
const skuMap = reactive(new Map<string, GoodsSkuVO>());
skuList?.forEach((p) => {
	skuMap.set(p.id, p);
});
const loadGoodsPage = async () => {
	if (isLoading.value) return;
	isLoading.value = true;
	page.value++;
	const res = await getGoodsCommentPage(page.value, size.value, goodsId);
	let data = res.data.value?.data;
	// 没有更多
	if (isNoMore.value || data?.total === -1) {
		return (isLoading.value = false);
	}
	// 展示结果
	pageInfo = data as IPage<GoodsCommentsVO>;
	let timer: NodeJS.Timeout | null;
	if (!data?.records) return;
	for await (const p of data.records) {
		await new Promise((resolve) => {
			timer = setTimeout(() => {
				// @ts-ignore
				p.images = p.images.split(",");
				commentList.value.push(p);
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
	commentList.value.splice(0);
	pageInfo = reactive({
		records: [],
		total: -1,
		pages: -1,
		size: -1,
		current: -1,
	});
};

const toCommentDetailView = (commentId: string) => {
	navigateTo({
		path: `/goods/comment/${commentId}`,
	});
};
</script>
<template>
	<div class="comment-list" v-for="(p, i) in commentList" :key="p.id" style="width: 100%">
		<CardGoodsComment :comment="p" :sku-item="skuMap.get(p.skuId)" />
	</div>
	<div class="comment-list" v-if="!commentList.length">
		<small>暂时没有评论</small>
	</div>
</template>
<style scoped lang="scss"></style>
