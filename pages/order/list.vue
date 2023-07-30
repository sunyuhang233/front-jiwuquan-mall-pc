<script lang="ts" setup>
import { getGoodsSkuByIds } from "~/composables/api/goods/sku";
import { PushOrdersItemDTO } from "~/composables/api/orders";
import { appName } from "~/constants";
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
useHead({
	title: appName + " - 订单",
	meta: [
		{
			name: "description",
			content: "极物圈-我的订单",
		},
	],
});
</script>
<template>
	<div>
		<NuxtLayout>
			<div layout-default w-700px>
				<div class="top" border-default border-0 border-b="2px">
					<h3 mb-4>订单</h3>
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
