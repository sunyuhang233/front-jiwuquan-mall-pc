<script lang="ts" setup>
import { GoodsSkuVO, getGoodsSkuByIds } from '~/composables/api/goods/sku';
import { appName } from '~/constants';
const route = useRoute();
// 1、订单子项
const order = useOrderStore();
// @ts-ignore
// 2、查询属性信息
const skuIdList: string[] = [];
order.pushOrderItems?.forEach((p) => {
	skuIdList.push(p.skuId);
});
const skuList = ref<GoodsSkuVO[]>([]);
// 加载属性购物列表
useAsyncData(async()=>{
	const {data,code} = await getGoodsSkuByIds(skuIdList)


})

// 中间件
definePageMeta({
	middleware: [
		(to, from) => {
			const user = useUserStore();
			if (!user.isLogin) {
				return navigateTo(from.path || "/");
			}
		},
	],
});

// 定义当前页面
useHead({
	title: appName + ' - 订单',
	meta: [
		{
			name: 'description',
			content: '极物圈-我的订单',
		},
	],
});
</script>
<template>
	<NuxtLayout>
		<div layout-default w-700px>
			<div class="top" border-default border-0 border-b="2px">
				<h3 mb-4>提交订单</h3>
			</div>
			<div >
				<label my-4>收货地址：</label>
				<div class="address"></div>
			</div>
		</div>
	</NuxtLayout>
</template>
<style scoped lang="scss"></style>
