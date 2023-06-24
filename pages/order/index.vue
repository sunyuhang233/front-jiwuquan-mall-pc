<script lang="ts" setup>
import { getGoodsSkuByIds } from '~/composables/api/goods/sku';
import { PushOrdersItemDTO } from '~/composables/api/orders';
import { appName } from '~/constants';
const route = useRoute();
// 1、订单子项
// @ts-ignore
const orderItems: PushOrdersItemDTO[] = route.query?.orderItems;
// 2、查询属性信息
const skuIdList: string[] = [];
orderItems.forEach((p) => {
	skuIdList.push(p.skuId);
});
const skuList = await getGoodsSkuByIds(skuIdList);
console.log(skuList);

definePageMeta({
	middleware: [
		(to, from) => {
			if (!to.query.orderItems) {
				return navigateTo(from.path);
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
			<div class="container">
				<label my-4>收货地址：</label>
				<div class="address"></div>
			</div>
		</div>
	</NuxtLayout>
</template>
<style scoped lang="scss"></style>
