<script lang="ts" setup>
import { OrdersStatus, PushOrdersDTO, PushOrdersItemDTO } from "~/composables/api/orders";
import { GoodsSkuMdVO, getGoodsSkuByIds } from "~/composables/api/goods/sku";
import { appName } from "~/constants";
import currency from "currency.js";
const app = useNuxtApp();
useHead({
	title: appName + " - 提交订单",
	meta: [
		{
			name: "description",
			content: "极物圈-我的订单",
		},
	],
});
// 订单状态
const ordersStatus = ref<OrdersStatus>(OrdersStatus.READY);
const ordersTitle = computed(() => {
	let banner: string = "";
	let submitText: string = "";
	let type: any = "";
	switch (ordersStatus.value) {
		case OrdersStatus.READY:
			banner = "提交订单";
			submitText = "提交订单";
			type = "primary";
			break;
		case OrdersStatus.UN_PAID:
			banner = "未付款";
			submitText = "立即付款";
			type = "error";
			break;
		case OrdersStatus.PAID:
			banner = "已付款，待发货";
			submitText = "待收货";
			type = "";
			break;
		case OrdersStatus.DELIVERED:
			banner = "已发货，请等待物流";
			submitText = "已发货";
			type = "info";
			break;
		case OrdersStatus.RECEIVED:
			banner = "已发货，请等待物流";
			submitText = "确认收货";
			type = "info";
			break;
		case OrdersStatus.DELAY_CANCELED:
			banner = "已确认收货，期待你的评价";
			submitText = "去评论";
			type = "success";
			break;
		case OrdersStatus.REFUND:
			banner = "发起退款中，等等卖家处理";
			submitText = "等待中，请稍后";
			type = "warning";
			break;
		case OrdersStatus.REFUND_SUCCESS:
			banner = "退款成功，金额将返还到你的账户";
			submitText = "退款成功";
			type = "text";
			break;
		case OrdersStatus.COMMENTED:
			banner = "已完成评论，欢迎下次";
			submitText = "";
			type = "success";
			break;
	}
	return {
		banner,
		submitText,
		type,
	};
});

// 状态
const isEdit = ref<boolean>(false); // 是否编辑
const isUpdate = ref<boolean>(ordersStatus.value === OrdersStatus.READY); // 是否可更新 （地址|留言）
const isLoading = ref<boolean>(false);
const isLoadAddressList = ref<boolean>(false);
// 1、订单内容store
const order = useOrderStore();
const address = useAddressStore();
const user = useUserStore();
if (address.addressList.length === 0) {
	address.resetRequestList(user.getToken);
}
// 2、查询属性信息
const skuIdList: string[] = [];
order.pushOrderItems?.forEach((p) => {
	skuIdList.push(p.skuId);
});
const orderItems = ref<(GoodsSkuMdVO & PushOrdersItemDTO)[]>([]);
// 3、加载属性购物列表和选中规格
const { data, code } = await getGoodsSkuByIds(skuIdList);
if (code === StatusCode.SUCCESS) {
	data.forEach((sku) => {
		const item = order.pushOrderItems.find((p) => p.skuId === sku.id) || {
			skuId: "",
			quantity: 0,
		};
		orderItems.value.push({ ...sku, ...item });
	});
}
// 4、选中地址id
const selectAddressId = ref<string>("");
watch(
	address.addressList,
	(val) => {
		if (!selectAddressId.value && val.length > 0) {
			selectAddressId.value = val.find((p) => p.isDefault === 1)?.id || val[0].id;
		}
	},
	{ deep: true, immediate: true }
);
// 5、选择代金卷
const selectVoucherId = ref<string>("");
const voucherList = ref([]);
// 6、选择积分抵扣
const selectPointsVal = ref<number>(0);
// 7、备注
const remark = ref<string>("");

const toEditGoods = (status: OrdersStatus | number) => {
	if (status !== OrdersStatus.READY) return;
	if (isEdit.value) {
		saveOrdersItems();
		isEdit.value = false;
		return;
	}
	ElMessageBox.alert("提交订单后便不可修改规格数量和优惠", "注意", {
		confirmButtonText: "我已了解",
		autofocus: true,
		center: true,
		callback: (action: string) => {
			if (action === "confirm") {
				isEdit.value = true;
			}
		},
	});
};

/**
 * 订单处理（提交、付款、修改订单）
 * @param status
 */
const onSubmitOrders = (status: OrdersStatus) => {
	// 1、开启加载 | 保存订单 | 关闭全部编辑
	isLoading.value = true;
	saveOrdersItems();
	isEdit.value = false;
	isUpdate.value = false;
	// 2、生成订单信息
	const items: PushOrdersItemDTO[] = orderItems.value.map((p) => {
		return {
			skuId: p.skuId,
			quantity: p.quantity,
			shopId: p.shopId, // 店铺id
			couponId: p.couponId, // 代金卷
			activityId: p.activityId, // 活动id
		};
	});
	const orderInfo: PushOrdersDTO = {
		addressId: selectAddressId.value,
		items,
		remark: useCheckXXSText(remark.value),
	};
	console.log(orderInfo);
};
//--------------------- 统计 计算 -----------------------
const getAllCoastPrice = computed(() => {
	let price = currency(0);
	orderItems.value.forEach((p) => {
		price = price.add(currency(p.price).multiply(p.quantity));
	});
	return price;
});
// 商品运费
const getAllPostage = computed(() => {
	let price = currency(0);
	orderItems.value.forEach((p) => {
		price = price.add(currency(p.postage));
	});
	return price;
});
const getFinalPrice = computed(() => {
	return getAllCoastPrice.value
		.subtract(getAllPostage.value)
		.subtract((selectPointsVal.value || 0) / 100);
});
// --------------------- 订单 ------------------------
// 保存订单信息
const saveOrdersItems = () => {
	const list: PushOrdersItemDTO[] = orderItems.value.map((p) => {
		return {
			skuId: p.skuId,
			quantity: p.quantity,
			shopId: p.shopId, // 店铺id
			couponId: p.couponId, // 优惠卷id
			activityId: p.activityId, // 活动id
		};
	});
	order.$patch({
		pushOrderItems: list,
	});
};
// 选择地址
const updateAddressId = (id: string) => {
	if (isUpdate.value) {
		selectAddressId.value = id;
	}
};
// -------------------- 其他 -----------------------
// 滚轮积分
const onWheelPoints = (e: WheelEvent) => {
	if (ordersStatus.value !== OrdersStatus.READY && ordersStatus.value !== OrdersStatus.UN_PAID)
		return;
	e.stopPropagation();
	if (e.deltaY < 0) {
		// 增加
		if (selectPointsVal.value < 10000) selectPointsVal.value += 100;
	} else {
		// 减少
		if (selectPointsVal.value >= 100) selectPointsVal.value -= 100;
	}
};
// 地址刷新
const reloadAddress = async () => {
	if (isLoadAddressList.value) return;
	isLoadAddressList.value = true;
	await address.resetRequestList(user.getToken);
	setTimeout(() => {
		isLoadAddressList.value = false;
	}, 300);
};
</script>
<template>
	<div>
		<NuxtLayout
			name="second"
			:header="false"
			:left-menu="false"
			:footer="false"
			:menu="['back']"
		>
			<ClientOnly>
				<div
					v-loading.fullscreen.lock="isLoading"
					class="layout-default-se min-h-100vh tracking-0.1em"
					v-if="user.isLogin"
				>
					<!--------------- 头部 ---------------->
					<div class="group flex items-center select-none mt-1rem mb-2rem">
						<el-image
							src="/logo_title.png"
							alt="Design by Kiwi2333 LOGO"
							class="w-10rem"
						/>
						<ElDivider
							direction="vertical"
							style="border-width: 3px; border-radius: 10px; margin: 0 1.4rem"
						/>
						<el-text
							style="font-weight: 700; font-size: 1.2rem"
							:type="ordersTitle.type || ''"
							>{{ ordersTitle.banner }}</el-text
						>
						<BtnSwitch class="ml-a mr-0 opacity-0 group-hover:opacity-90" />
					</div>
					<!--------------- 地址 ---------------->
					<div
						v-loading="isLoadAddressList"
						class="v-card group border-default flex flex-col border-t-[var(--el-color-primary)] dark:border-t-[var(--el-color-primary)]"
						border-t="0.5rem solid "
					>
						<h4 mb-2>
							收货地址：
							<i
								@click="reloadAddress"
								opacity-0
								group-hover:opacity-100
								class="px-3 float-right hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)]"
							/>
						</h4>
						<el-radio-group v-model="selectAddressId" :disabled="!isEdit">
							<el-scrollbar>
								<transition-group
									name="item-list"
									tag="div"
									class="flex flex-row w-800px md:w-full"
								>
									<CardAddressBoxSe
										@click="updateAddressId(p.id)"
										v-for="p in address.addressList"
										:address="p"
										:key="p.id"
										class="overflow-hidden opacity-80 dark:opacity-70 transition-200"
										:class="
											p.id === selectAddressId
												? 'border-[var(--el-color-primary)] dark:border-[var(--el-color-primary)]'
												: ''
										"
									>
										<template #btns>
											<!-- 选中 -->
											<el-radio :label="p.id" />
										</template>
									</CardAddressBoxSe>
									<NuxtLink
										:key="'/user/address'"
										target="_blank"
										to="/user/address"
										class="hover:scale-96 hover:border-solid flex-row-c-c cursor-pointer transition-300 mr-3 mt-2 w-260px min-h-160px p-3.4 relative border-default-dashed border-2px rounded-8px rounded-6px opacity-90 flex flex-col leading-1.2em group"
									>
										<ElIconCirclePlusFilled
											class="transition-300 w-4em h-4em opacity-40"
										/>
										<strong class="mt-2 opacity-40 transition-300">
											添加新地址
										</strong>
									</NuxtLink>
								</transition-group>
							</el-scrollbar>
						</el-radio-group>
					</div>
					<!-------------- 商品列表 -------------->
					<div class="v-card border-default order-item flex flex-col">
						<h4 mb-4>
							选购商品
							<el-text
								@click="toEditGoods(ordersStatus)"
								class="cursor-pointer ml-a float-right"
								plain
								:type="isEdit ? 'danger' : 'primary'"
								szie="small"
								>{{ isEdit ? "确定修改" : "修改" }}</el-text
							>
						</h4>
						<!-- 商品列表 -->
						<section v-for="p in orderItems" :key="p.id">
							<CardOrderSku class="mb-3" :data="p" :disable="!isEdit">
								<template #btn></template>
							</CardOrderSku>
						</section>
					</div>
					<!---------------- 优惠 ---------------->
					<section class="v-card border-default">
						<!-- 代金卷 -->
						<div class="flex-row-bt-c">
							<span>代金卷</span>
							<el-select
								:disabled="voucherList.length === 0 || !isEdit"
								:class="voucherList.length === 0 || !isEdit ? 'w-4.6rem' : 'w-1/5'"
								v-model="selectVoucherId"
								:placeholder="voucherList.length ? '选择代金卷' : '暂无代金卷'"
							>
								<el-option
									v-for="p in voucherList"
									:key="p"
									:label="p"
									:value="p"
								/>
							</el-select>
						</div>
						<ElDivider class="opacity-40" />
						<!-- 积分抵扣 -->
						<div class="flex-row-bt-c border-0">
							<span>
								积分抵扣
								<small opacity-80>100积分低1元（每单上限10000积分）</small>
							</span>
							<div flex items-end v-if="user.userWallet.points > 0">
								<!-- 积分优惠 -->
								<small class="relative flex flex-col">
									<div
										class="flex-row-c-c absolute right-0 bottom-1em ml-a text-[var(--el-color-error)] mb-1"
										v-show="selectPointsVal > 0"
									>
										-
										<span block>{{ selectPointsVal }}</span>
									</div>
									<div flex items-end justify-end>
										积分剩余：
										<div class="flex flex-col">
											<div>{{ user.userWallet.points }}</div>
										</div>
									</div>
								</small>
								<el-input-number
									style="width: 6em"
									@wheel="onWheelPoints($event)"
									class="ml-4 cursor-ns-resize transition-300"
									:class="{ 'opacity-60': selectPointsVal === 0 }"
									:disabled="
										ordersStatus !== OrdersStatus.READY &&
										ordersStatus !== OrdersStatus.UN_PAID
									"
									v-model.lazy="selectPointsVal"
									:step="100"
									:step-strictly="true"
									controls-position="right"
									label="只能以100为倍数"
									:min="0"
									:max="
										user.userWallet.points >= 10000
											? 10000
											: user.userWallet.points
									"
								/>
							</div>
							<small opacity-40 font-600 v-else>暂无积分</small>
						</div>
					</section>
					<!---------------- 备注 ---------------->
					<section class="v-card border-default flex-row-bt-c">
						备注
						<div class="w-10rem md:w-14rem">
							<el-input
								:disabled="!isUpdate"
								class="remark"
								type="textarea"
								rows="1"
								:minlength="0"
								:maxlength="40"
								v-model="remark"
								placeholder="给卖家的留言（选填）"
							/>
						</div>
					</section>
					<!---------------- 总计 ---------------->
					<section class="v-card leading-2em border-default flex flex-col">
						<h3 mb-2>合 计</h3>
						<!-- 原价 -->
						<small opacity-70 flex-row-bt-c w-full>
							原总价：
							<span>￥{{ getAllCoastPrice }}</span>
						</small>
						<!-- 运费 -->
						<small opacity-70 flex-row-bt-c w-full>
							运费：
							<span>
								{{ getAllPostage.value > 0 ? "￥" + getAllPostage : "￥0.00" }}
							</span>
						</small>
						<!-- 代金卷 -->
						<small opacity-70 flex-row-bt-c w-full v-show="selectVoucherId !== ''">
							代金卷优惠：
							<span> {{ voucherList.length ? selectVoucherId : 0 }}元 </span>
						</small>
						<!-- 积分抵扣 -->
						<small opacity-70 flex-row-bt-c w-full v-show="selectPointsVal > 0">
							积分抵扣：
							<span class="text-[var(--el-color-error)]">
								-{{
									selectPointsVal > 0
										? "￥" + currency(selectPointsVal / 100)
										: "￥0.00"
								}}
							</span>
						</small>
						<!-- 总价 -->
						<div flex-row-bt-c w-full>
							总计
							<h3 class="text-[var(--el-color-error)] flex">
								￥<strong block>{{ getFinalPrice }}</strong>
							</h3>
						</div>
					</section>
					<!-------------- 提交区域 --------------->
					<section class="v-card border-default flex-row-bt-c">
						<div class="menu"></div>
						<div class="submit">
							<!-- 提交 -->
							<el-button
								@click="onSubmitOrders(ordersStatus)"
								size="large"
								class="shadow"
								style="
									transition: 300ms;
									font-size: inherit;
									font-weight: 700;
									letter-spacing: 0.2em;
								"
								:type="ordersTitle.type || 'primary'"
							>
								{{ ordersTitle.submitText }}
							</el-button>
						</div>
					</section>
				</div>
			</ClientOnly>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss">
:deep(.el-radio-group) {
	font-size: medium;

	.el-radio {
		position: absolute;
		right: 0;
		bottom: 0;
		.el-radio__input {
			opacity: 0;
		}
		.el-radio__label {
			display: none;
		}
		// 三角形
		&:after {
			content: "选中";
			opacity: 0;
			transition: 300;
			width: 2em;
			margin-left: 0.5em;
			font-size: 1em;
			background: var(--el-color-primary);
			color: #fff;
			width: 6em;
			height: 4em;
			line-height: 2.5em;
			text-align: center;
			transform: rotate(-45deg) translate(22%, 50%);
		}
		&.is-checked:after {
			opacity: 100;
		}
	}
}
// 选择框输入框
:deep(.el-input) {
	&.is-disabled {
		.el-input__wrapper:hover,
		.el-input__wrapper {
			background-color: transparent;
			padding: 0;
			box-shadow: none;
			.el-input__suffix-inner {
				display: none;
			}
		}
	}
}
// 备注
.remark :deep(.el-textarea__inner) {
	box-shadow: none;
	&:focus,
	&:hover {
		box-shadow: none;
	}
	border-bottom: 1px solid var(--el-border-color);
	padding: 1px;
	border-radius: 0;
}

.order-item :deep(.el-input.is-disabled) {
	.el-input__inner {
		color: black;
		font-weight: 600;
		font-size: 1.14em;
		-webkit-text-fill-color: black;
	}
}
.dark .order-item :deep(.el-input.is-disabled) {
	.el-input__inner {
		color: white;
		font-weight: 600;
		font-size: 1.14em;
		-webkit-text-fill-color: white;
	}
}

// 公共
.v-card {
	border-radius: 8px;
	margin-top: 1.2rem;
	padding: 1.2rem;
	background-color: white;
}
.dark .v-card {
	background-color: #111111e1;
}
</style>
