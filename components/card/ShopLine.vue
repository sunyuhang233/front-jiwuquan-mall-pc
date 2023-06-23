<script lang="ts" setup>
import { BaseUrlImg } from '~/composables/utils/useFetchUtil';
import { ShopcartVO, updateShopcart } from '~/composables/api/shopcart';
import { GoodsSkuVO, getGoodsSkuByGid } from '~/composables/api/goods/sku';
const { shopCart } = defineProps<{
	shopCart: ShopcartVO;
}>();
const user = useUserStore();
const isUpdateLoading = ref<boolean>(false);
const isLoading = ref<boolean>(true);
// 获取分页信息
const skuList = ref<GoodsSkuVO[]>([]);
const selectSkuId = ref<string>(shopCart.id);

// 改变规格
watch(
	shopCart,
	(vo: ShopcartVO) => {
		changeUpdateShopcart(vo.skuId, vo.quantity);
	},
	{ deep: true }
);

const changeUpdateShopcart = async (skuId: string, quantity: number) => {
	if (isUpdateLoading.value) return;
	isUpdateLoading.value = true;
	const data = await updateShopcart(
		selectSkuId.value,
		{
			skuId,
			quantity,
		},
		user.getToken
	);
	if (data.code != StatusCode.SUCCESS) {
		ElMessage.closeAll();
		ElMessage.error('修改失败，稍后重试！');
	} else {
		shopCart.skuId = skuId;
		shopCart.quantity = quantity;
	}

	const timer = setTimeout(() => {
		isUpdateLoading.value = false;
		clearTimeout(timer);
	}, 300);
};

// 加载规格列表
const loadGoodSkuList = async (val: boolean) => {
	if (val && isLoading.value) {
		const { data } = await getGoodsSkuByGid(shopCart.goodsId);
		setTimeout(() => {
			data.value?.data.forEach((p) => skuList.value.push(p));
			isLoading.value = false;
		}, 300);
	}
};
// 计算规格全部属性
const getSkuProps = (goodsSku: GoodsSkuVO) => {
	return (goodsSku.size || '') + ' ' + (goodsSku.color || '') + ' ' + (goodsSku.combo || '');
};

// 用户
const getProps = computed({
	get() {
		if (skuList.value.length > 0) {
			const p = skuList.value.find((p) => p.id === shopCart.skuId);
			if (p) {
				return (p.size || '') + ' ' + (p.color || '') + ' ' + (p.combo || '');
			}
		}
		return (shopCart.size || '') + ' ' + (shopCart.color || '') + ' ' + (shopCart.combo || '');
	},
	set(skuId: string) {
		selectSkuId.value = skuId;
	},
});

// 跳转详情页
const router = useRouter();
const toGoodsView = (gid: string) => {
	setTimeout(() => {
		router.push({
			path: `/goods/detail/${gid}`,
		});
	}, 300);
};
</script>
<template>
	<div
		v-loading="isUpdateLoading"
		class="card"
		flex-row-bt-c
		cursor-pointer
		p-4
		rounded-6px
		mt-2
		mb-3
		transition-300
		border-2px
		hover:shadow
		hover:border="solid violet-6"
		hover:bg="gray-1"
		dark:hover:bg="dark-1"
		border-dashed
		border-default
	>
		<ClientOnly>
			<ElImage
				@click="toGoodsView(shopCart.goodsId)"
				hover:transform-scale-110
				transition-300
				:src="BaseUrlImg + shopCart.image"
				style="width: 8em; height: 8em; border: 1px solid #eee; border-radius: 4px"
				fit="cover"
			/>
		</ClientOnly>
		<div px-4 style="width: 78%; height: 100%" group flex flex-col items-start justify-between>
			<h3 tracking-1px max-w-12em md:max-w-16em class="overflow-hidden truncate ...">
				{{ shopCart.name }}
			</h3>
			<!-- 中下 -->
			<p font-700 color-red-6 mt-1 mb-5>
				￥{{ shopCart.price?.toFixed(2) }}
				<small color-coolgray text-0.4em style="text-decoration: line-through"
					>￥{{ shopCart.costPrice.toFixed(2) }}</small
				>
			</p>
			<!-- 下 -->
			<p flex-row-bt-c class="w-1/1">
				<ClientOnly>
					<el-select
						no-data-text="暂无其他规格！"
						@visible-change="loadGoodSkuList"
						loading-text="加载中..."
						:loading="isLoading"
						v-model="getProps"
						:placeholder="getProps"
						collapse-tags-tooltip
						size="small"
						class="mr-2"
					>
						<el-option
							v-for="p in skuList"
							:key="p.id"
							:label="getSkuProps(p)"
							:value="p.id"
							:disabled="p.stock === 0"
						/>
					</el-select>
				</ClientOnly>
				<!-- 数量 -->
				<el-input-number :min="1" :max="99" v-model="shopCart.quantity" size="small" />
			</p>
		</div>
		<slot name="btn"></slot>
	</div>
</template>
<style scoped lang="scss">
:deep(.el-input-number) {
	.el-input__inner {
		width: 1em;
	}
}
</style>
