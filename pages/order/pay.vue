<script lang="ts" setup>
import { GoodsSkuVO, getGoodsSkuByIds } from "~/composables/api/goods/sku";
import { appName } from "~/constants";
// 定义当前页面
// definePageMeta({
// 	middleware: ["auth"],
// });
useHead({
	title: appName + " - 订单",
	meta: [
		{
			name: "description",
			content: "极物圈-我的订单",
		},
	],
});
// 1、订单子项
const order = useOrderStore();
const address = useAddresStore();
const user = useUserStore();
const router = useRouter();
// 2、查询属性信息
const skuIdList: string[] = [];
order.pushOrderItems?.forEach((p) => {
	skuIdList.push(p.skuId);
});
address.resetRequestList(user.getToken);
const skuList = ref<GoodsSkuVO[]>([]);
// 加载属性购物列表
const { data, code } = await getGoodsSkuByIds(skuIdList);
if (code === StatusCode.SUCCESS) {
	skuList.value.push(...data);
}
// 3、选中地址id
const selectAddressId = ref<string>("");
selectAddressId.value = address.addressList[0]?.id;
</script>
<template>
	<NuxtLayout :left-menu="false" :menu="['shopcart', 'back']">
		<div layout-default w-700px>
			<div class="top" border-default border-0 border-b="2px">
				<h3 mb-4>提交订单</h3>
			</div>
			<ClientOnly>
				<div my-2>
					<!-- 地址 -->
					<label my-4>收货地址：</label>
					
					<!-- 列表 -->
					<div class="address w-1/1 flex flex-wrap p-0">
						<el-radio-group v-model="selectAddressId">
							<CardAddressBox
								v-for="(p, i) in address.addressList"
								:address="p"
								:key="p.id"
							>
								<template #btns>
									<!-- 选中 -->
									<el-radio :label="p.id" />
								</template>
							</CardAddressBox>
						</el-radio-group>
					</div>
				</div>
			</ClientOnly>
		</div>
	</NuxtLayout>
</template>
<style scoped lang="scss">
:deep(.el-radio-group) {
	font-size: medium;
	.el-radio__label {
		display: none;
	}
	.el-radio::after {
		content: "选中";
		width: 2em;
		margin-left:0.5em;
		font-size: 1em;
	}
}
</style>
