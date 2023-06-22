<script lang="ts" setup>
import { GoodsInfoVO } from '~/composables/api/goods';
import { GoodsSkuVO } from '~/composables/api/goods/sku';
const user = useUserStore();
const app = useNuxtApp();
// emits
const emit = defineEmits(['setActiveItem']);
// props
const { goodsInfo, goodsSku } = defineProps<{
	goodsInfo?: GoodsInfoVO;
	goodsSku?: GoodsSkuVO[];
}>();

// 表单
const form = reactive({
  skuId:"",
  number:"",
	size: "",
	color: "",
	combo: "",
});

// 尺寸
const sizeList = ref<
	{
		id: string;
		name: string;
	}[]
>([]);
// 颜色
const colorList = ref<
	{
		id: string;
		name: string;
		image: string;
	}[]
>([]);
// 版本
const comboList = ref<
	{
		id: string;
		name: string;
	}[]
>([]);

const initSku = () => {
	goodsSku?.map((p) => {
		if (p.size && !sizeList.value.find((k) => k.name === p.size)) {
			sizeList.value?.push({
				id: p.id,
				name: p.size,
			});
		}
		if (p.color && !colorList.value.find((k) => k.name === p.color)) {
			colorList.value?.push({
				id: p.id,
				name: p.color,
				image: p.image,
			});
		}
		if (p.combo && !comboList.value.find((k) => k.name === p.combo)) {
			comboList.value?.push({
				id: p.id,
				name: p.combo,
			});
		}
	});
};
initSku();

// 设置预览图片
const setActiveItem = (image: string) => {
	emit('setActiveItem', image);
};


// 添加到购物车 

interface skuItem {
	skuId: string;
	name: string;
	stock: number;
	price: number;
}
const text = ref<string>("")
</script>
<template>
	<el-card class="sku-card" px-6 pt-8>
		<el-form label-position="top" class="group">
			<!-- 顶部 -->
			<div class="top opacity-90" flex-row-bt-c mt-2 :model="form">
				<!-- 商品标签 -->
				<div class="left">
					<el-tag class="mx-1" effect="dark" type="danger" v-if="goodsInfo?.isNew"
						>新品</el-tag
					>
					<el-tag class="mx-1" effect="light" type="info" v-if="goodsInfo?.postage === 0"
						>免运费</el-tag
					>
				</div>
				<!-- 收藏 -->
				<BtnCollectGoods :gid="goodsInfo?.id || ''" />
			</div>
			<div class="sku-list" tracking-0.1em flex flex-col leading-1.4em pt-6>
				<!-- 顶部 -->
				<h3 tracking-0.1em mb-4>{{ goodsInfo?.name }}</h3>
				<div flex-row-bt-c my-1>
					<small opacity-90 float-left>销售价（元）：</small>
					<div class="righjt">
						<span font-700 text-1.4em text-red-5 >￥{{ goodsInfo?.price.toFixed(2) }}</span>
						<small
							style="text-decoration: line-through; opacity: 0.9"
							text-bluegray-3
							text-0.6em
							>￥{{ goodsInfo?.costPrice.toFixed(2) }}</small>
					</div>
				</div>
				<!-- 规格 -->
				<div class="card">
					<h4 pt-3 pb-2 v-if="sizeList.length">规 格</h4>
					<el-form-item prop="size" v-if="sizeList.length">
						<el-radio-group v-model="form.size" size="default">
							<el-radio-button :label="p.name" v-for="p in sizeList" :key="p.name" />
						</el-radio-group>
					</el-form-item>
				</div>
				<!-- 颜色 -->
				<div class="card">
					<h4 pt-3 pb-2 v-if="colorList.length">颜 色</h4>
					<el-form-item prop="color" v-if="colorList.length">
						<el-radio-group v-model="form.color" size="default">
							<el-radio-button
								border
								v-for="p in colorList"
								:key="p.name"
								:label="p.name"
								style="height: auto; border-radius: 6px"
								@click="setActiveItem(p.image)"
								class="flex flex-col color-group mr-4"
							>
								<img
									class="sku-img"
									:src="BaseUrlImg + p.image"
									rounded-4px
									overflow-hidden
									z-0
								/>
								<div text-center py-2 z-5 class="tip">{{ p.name }}</div>
							</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</div>
				<!-- 套餐 -->
				<div class="card">
					<h4 pt-3 pb-2 v-if="comboList.length">套 餐</h4>
					<el-form-item prop="combo" v-if="comboList.length">
						<el-radio-group v-model="form.combo" size="default">
							<el-radio-button :label="p.name" v-for="p in comboList" :key="p.name" />
						</el-radio-group>
					</el-form-item>
				</div>
			</div>
			<!-- 购物车|立即购买 -->
			<el-form-item>
				<div class="w-1/1 flex justify-between py-3">
					<el-button
						size="large"
						style="
							flex: 1;
							transition: 300ms;
							font-size: 1.2em;
							padding: 0.8em 1em;
							letter-spacing: 0.1em;
							margin-right: 0.6em;
							font-weight: 700;
						"
						plain
						>加入购物车</el-button
					>
					<el-button
						size="large"
						style="
							flex: 1;
							margin-right: 0.6em;
							transition: 300ms;
							font-size: 1.2em;
							font-weight: 600;
							padding: 0.8em 1em;
							letter-spacing: 0.1em;
						"
						type="info"
						>立即购买</el-button
					>
				</div>
			</el-form-item>
		</el-form>
	</el-card>
</template>
<style scoped lang="scss">
.card {
	h3 {
		padding-left: 0.1em;
	}
}
.color-group {
	.sku-img {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 4px;
		opacity: 0.8;
	}

	.tip {
		transition: $transition-delay;
		transform: translateY(0%);
		font-weight: 800;
		font-size: 1.1em;
		color: #fff;
		text-shadow: 1px 1px #464646;
	}
	.is-checked .tip,
	&:hover .tip {
		transform: translateY(110%);
		color: var(--el-color-primary);
		text-shadow: 1px 1px #96969696;
	}
}
</style>
