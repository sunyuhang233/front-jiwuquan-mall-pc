<script lang="ts" setup>
import { GoodsInfoVO, addGoodsViewsById, getGoodsInfoById } from "~/composables/api/goods";
import { getGoodsSkuByGid } from "~/composables/api/goods/sku";
import { GoodsSkuVO } from "~/composables/api/goods/sku";
const app = useNuxtApp();
const route = useRoute();
const user = useUserStore();
// 商品id
const goodsId = route.params.id;
const isLoading = ref<boolean>(true);
// 商品详细信息
const reqGoodsInfo = getGoodsInfoById(goodsId.toString());
let goodsInfo = ref<GoodsInfoVO>();
useAsyncData(async () => {
	if (user.isLogin) {
		await addGoodsViewsById(goodsId.toString(), user.getToken);
	}
});

// 规格信息
const reqGoodsSku = getGoodsSkuByGid(goodsId.toString());
let goodsSku = ref<GoodsSkuVO[]>();
// 图片列表
const goodsImages = ref<Set<string>>(new Set());
// 请求队列
const reqArr = await Promise.all([reqGoodsInfo, reqGoodsSku]);
const goodsInfoRaw = reqArr[0].data.value?.data;
const goodsSkuRaw = reqArr[1].data.value?.data;
if (!goodsInfoRaw || !goodsSkuRaw) {
	navigateTo("/");
}
// 商品介绍图和处理
if (goodsInfoRaw) {
	if (goodsInfoRaw.images) {
		goodsInfoRaw.images = goodsInfoRaw?.images.toString().split(",");
	}
	goodsInfo = toRef(goodsInfoRaw); // 商品信息
	goodsInfoRaw?.images?.forEach((p) => {
		goodsImages.value.add(p);
	});
	goodsSku = toRef(goodsSkuRaw); // 商品规格
	goodsSkuRaw?.forEach((p) => {
		goodsImages.value.add(p.image);
	});
}
isLoading.value = false;

// 修改轮播图活动页面
const goodsSwiper = ref();
// 设置对应规格图片
const setActive = (name: string) => {
	goodsSwiper?.value?.setActiveItem(name);
};

// 定义当前页面
useHead({
	title: "极物 " + goodsInfo.value?.name,
	meta: [
		{
			name: "description",
			content: goodsInfo.value?.name + " " + goodsInfo.value?.description,
		},
	],
});
definePageMeta({
	key: (route) => route.fullPath,
	keepalive: {
		exclude: [],
	},
	middleware: [
		(to, from) => {
			if (!to.params.id) {
				return navigateTo("/");
			}
		},
	],
});
</script>
<template>
	<div class="goods-detail">
		<NuxtLayout name="second">
			<div layout-default class="goods-detail">
				<div class="top" flex items-center>
					<!-- 树形分类 -->
					<GoodsCategoryTree
						class="left"
						:gid="goodsId.toString()"
						:name="goodsInfo?.name"
					/>
				</div>
				<!-- 内容 -->
				<div class="center" mt-2.2em flex justify-around items-center>
					<!-- 商品轮播图 -->
					<GoodsPreSwiper
						class="swiper ml-0em flex-2 animate__animated animate__fadeIn"
						w-600px
						:images="[...goodsImages]"
						:video="goodsInfo?.video"
						:goods-name="goodsInfo?.name"
						ref="goodsSwiper"
					/>
					<!-- 规格和购物车、购买 -->
					<div class="card flex-1 animate__animated animate__fadeIn" pl-20em pr-4em>
						<GoodsSkuCard
							:goods-info="goodsInfo"
							:goods-sku="goodsSku"
							@set-active-item="setActive"
						/>
					</div>
				</div>
				<!-- 详细介绍 -->
				<div
					flex
					justify-between
					mt-5em
					border-default
					border-0
					border-t="2px solid"
					py-3em
					class="bottom"
				>
					<div class="left">
						<h2 tracking-0.1em>
							<i i-solar:bolt-outline bg-amber p-3.5 mr-2></i>商品介绍
						</h2>
						<GoodsDetailTabs
							class="w-640px detail"
							:goods-info="goodsInfo"
							:sku-list="goodsSku"
							py-1em
							rounded-10px
							dark:opacity-90
							min-h-700px
							shadow-sm
						/>
					</div>
					<!-- 猜你喜欢 -->
					<div class="w-2/5">
						<h2 tracking-0.1em mb-0.8em>
							<i i-solar:bomb-emoji-outline bg-lime p-4 mr-2></i> 猜你喜欢
						</h2>
						<ListGoodsList
							class="w-1/1"
							:dto="{ name: goodsInfo?.name[Math.floor(Math.random())] }"
							:limit="10"
						/>
					</div>
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>

<style scoped lang="scss">
.scale-imgs {
	display: flex;
	width: 100%;
	flex-wrap: nowrap;
	overflow-x: auto;

	.scale-img {
		opacity: 0.8;
		border: 2px solid transparent;
		transition: $transition-delay;
	}
	.scale-img.active,
	.scale-img:hover {
		opacity: 1;
		border: 2px solid var(--el-color-primary);
	}
}
</style>
