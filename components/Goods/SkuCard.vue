<script lang="ts" setup>
import { GoodsInfoVO } from '~/composables/api/goods';
import { GoodsSkuVO } from '~/composables/api/goods/sku';
import type { FormInstance, FormRules } from 'element-plus';
import { addShopcart } from '~/composables/api/shopcart';
import { gsap } from 'gsap';
const user = useUserStore();
const app = useNuxtApp();

const isAllCheckSku = ref<boolean>(false);
// emits
const emit = defineEmits(['setActiveItem']);
// props
const { goodsInfo, goodsSku } = defineProps<{
	goodsInfo?: GoodsInfoVO;
	goodsSku?: GoodsSkuVO[];
}>();
// 表单实例
const FormRef = ref<FormInstance>();
// 添加到购物车
const onSubmitShopCart = (formRef: FormInstance | undefined) => {
	formRef
		?.validate(async (valid) => {
			if (valid && user.getToken) {
				const data = await addShopcart(
					{
						skuId: form.skuId,
						quantity: form.quantity,
					},
					user.getToken
				);
				if (data.code === StatusCode.SUCCESS) {
					ElMessage.success('添加成功！');
				} else {
					ElMessage.error('添加失败，请稍后再试！');
				}
			} else {
				ElMessage.closeAll();
				return false;
			}
		})
		.catch((error) => {
			return false;
		});
};
// 购买
const onSubmitBuy = (formRef: FormInstance | undefined) => {
	formRef
		?.validate((valid) => {
			if (valid) {
				ElMessage.success('购买成功！');
			} else {
				ElMessage.closeAll();
				return false;
			}
		})
		.catch((error) => {
			return false;
		});
};
// 表单
const form = reactive<formDTO>({
	skuId: '',
	quantity: 1,
	size: '',
	color: '',
	combo: '',
});
interface formDTO {
	skuId: string;
	quantity: number;
	size?: string;
	color?: string;
	combo?: string;
}
interface skuItem {
	skuId: string;
	name: string;
	stock: number;
	price: number;
}

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
// 初始化规格
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

// 表单监听
watch(
	form,
	(dto: formDTO) => {
		const item = goodsSku?.find((p) => {
			return (
				dto.color === (p.color || '') &&
				dto.combo === (p.combo || '') &&
				dto.size === (p.size || '')
			);
		});
		if (item && item?.id) {
			isAllCheckSku.value = true;
			form.skuId = item?.id;
		}
	},
	{ immediate: true, deep: true }
);

// 计算全部规格总库存
const getMaxStock = computed(() => {
	let count = 0;
	goodsSku?.forEach((p) => {
		count += p.stock;
	});
	return count;
});

// 计算当前规格的库存
const getStock = computed(() => {
	return goodsSku?.find((p) => p.id === form.skuId)?.stock || 0;
});
// 设置预览图片
const setActiveItem = (image: string) => {
	emit('setActiveItem', image);
}; 
</script>
<template>
	<el-card class="sku-card" px-6 pt-8>
		<el-form ref="FormRef" :model="form" label-position="top" class="group">
			<!-- 顶部 -->
			<div class="top opacity-90" flex-row-bt-c mt-2>
				<!-- 商品标签 -->
				<div class="left">
					<ClientOnly>
						<el-tag class="mx-1" effect="dark" type="danger" v-if="goodsInfo?.isNew"
							>新品</el-tag
						>
						<el-tag class="mx-1" effect="light" type="info">{{
							goodsInfo?.postage ? goodsInfo?.postage : '免运费'
						}}</el-tag>
					</ClientOnly>
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
						<span font-700 text-1.4em text-red-5
							>￥
							<span v-incre-up="goodsInfo?.price.toFixed(2)"></span>
						</span>
						<small
							style="text-decoration: line-through; opacity: 0.9"
							text-bluegray-3
							text-0.6em
							>￥
							<span v-incre-up="goodsInfo?.costPrice.toFixed(2)"></span>
						</small>
					</div>
				</div>
				<!-- 规格 -->
				<div class="card" v-if="sizeList.length">
					<h4 pb-2>规 格</h4>
					<el-form-item prop="size" required>
						<template #error>
							<small text-red-5 pl-2>请选择规格</small>
						</template>
						<el-radio-group v-model="form.size">
							<el-radio-button :label="p.name" v-for="p in sizeList" :key="p.name" />
						</el-radio-group>
					</el-form-item>
				</div>
				<!-- 颜色 -->
				<div class="card" v-if="colorList.length" pb-3>
					<h4 pb-2>颜 色</h4>
					<el-form-item prop="color" required>
						<template #error>
							<small text-red-5 pl-2>请选择颜色</small>
						</template>
						<el-radio-group v-model="form.color" size="large">
							<!-- cts -->
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
				<div class="card" v-if="comboList.length">
					<h4 pb-2>套 餐</h4>
					<el-form-item prop="combo" required>
						<template #error>
							<small text-red-5 pl-2>请选择套餐</small>
						</template>
						<el-radio-group v-model="form.combo">
							<el-radio-button :label="p.name" v-for="p in comboList" :key="p.name" />
						</el-radio-group>
					</el-form-item>
				</div>
			</div>
			<!-- 数量 -->
			<div class="card">
				<h4 pb-2>数 量</h4>
				<el-form-item prop="quantity" required>
					<el-input-number
						:disabled="getStock === 0"
						:min="1"
						:max="getStock !== 0 ? 99 : 1"
						v-model="form.quantity"
					/>
					<small v-show="isAllCheckSku"
						>（库存剩余：<span text-red-5>{{ getStock }} </span>件）</small
					>
					<small v-show="!isAllCheckSku">（总库存剩余：{{ getMaxStock }} 件）</small>
				</el-form-item>
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
						@click="onSubmitShopCart(FormRef)"
						>加入购物车
						
					</el-button>

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
						@clikc="onSubmitBuy(FormRef)"
						type="info"
						>立即购买
						<span></span>
					</el-button>
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
