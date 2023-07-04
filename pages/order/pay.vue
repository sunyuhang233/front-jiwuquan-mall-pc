<script lang="ts" setup>
import { GoodsSkuVO, getGoodsSkuByIds } from '~/composables/api/goods/sku';
import { appName } from '~/constants';
// 1、订单子项
const order = useOrderStore();
const address = useAddresStore();
const user = useUserStore();
const router = useRouter();
const route = useRoute();
// 2、查询属性信息
const skuIdList: string[] = [];
order.pushOrderItems?.forEach((p) => {
	skuIdList.push(p.skuId);
});
address.resetRequestList(user.getToken);
const skuList = ref<GoodsSkuVO[]>([]);
// 加载属性购物列表
useAsyncData(async () => {
	const { data, code } = await getGoodsSkuByIds(skuIdList);
	if (code === StatusCode.SUCCESS) {
		skuList.value.push(...data);
	} else {
		router.back();
	}
});

// 3、选中地址id
const selectAddressId = ref<string>(address.addressList[0]?.id || '');

// 中间件
definePageMeta({});

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
		<ClientOnly>
			<div layout-default w-700px>
				<div class="top" border-default border-0 border-b="2px">
					<h3 mb-4>提交订单</h3>
				</div>
				<div>
					<label my-4>收货地址：</label>
					<div class="address w-1/1 flex flex-wrap p-0">
						<el-radio-group v-model="selectAddressId">
							<div
								cursor-pointer
								transition-300
								w-260px
								relative
								h-180px
								border-default
								border-2px
								rounded-8px
								hover:border="solid dark-4"
								dark:hover:border-gray-5
								p-6
								rounded-6px
								opacity-90
								flex
								flex-col
								leading-1.3em
								class="group"
								shadow-sm
								v-for="(p, i) in address.addressList"
								:key="p.id"
							>
								<div
									flex-row-c-c
									justify-start
									text-1.2em
									border-default-dashed
									border-0
									border-b-2px
									pb-1
								>
									{{ p.name }}

									<el-tag
										class="opacity-0 group-hover:opacity-90 ml-2"
										v-if="p.isDefault && p.isDefault === 1"
										plain
										>默认地址{{ p.isDefault }}</el-tag
									>
								</div>
								<small pt-2>{{ p.phone }}</small>
								<div opacity-80 mt-1>
									<small pr-1>{{ p.province }}</small>
									<small pr-1>{{ p.city }}</small>
									<small pr-1>{{ p.county }}</small>
								</div>
								<small> {{ p.address }} 邮编:{{ p.postalCode }} </small>
								<!-- 选中 -->
								<el-radio :label="p.id" />
							</div>
						</el-radio-group>
					</div>
				</div>
			</div>
		</ClientOnly>
	</NuxtLayout>
</template>
<style scoped lang="scss"></style>
