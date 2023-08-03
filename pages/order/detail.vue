<script lang="ts" setup>
import {
	OrdersStatus,
	pushOrdersItems,
	payOrders,
	PayType,
	cancelOrders,
	refundOrders,
	checkDeliveryOrders, // 确认收货
	deleteOrders, // 删除订单
	toOrdersComment, // 去评论
	type PushOrdersItemDTO,
} from "~/composables/api/orders";
import { GoodsSkuMdVO, getGoodsSkuByIds } from "~/composables/api/goods/sku";
import { appName } from "~/constants";
import currency from "currency.js";

// 1、订单内容store
const order = useOrderStore();
const address = useAddressStore();
const user = useUserStore();
await order.reloadOrderInfo(order.orderId);

// 订单状态
const ordersTitle = computed(() => {
	let banner: string = "";
	let submitText: string = "";
	let type: any = "";
	let btnType: any = "";
	switch (order.status) {
		case OrdersStatus.READY:
			banner = "提交订单";
			submitText = "提交订单";
			type = "primary";
			btnType = "primary";
			break;
		case OrdersStatus.UN_PAID:
			banner = "待付款";
			submitText = "立即付款";
			type = "danger";
			btnType = "danger";
			break;
		case OrdersStatus.PAID:
			banner = "已付款，等待发货... 📦";
			submitText = "催发货";
			type = "primary";
			btnType = "primary";
			break;
		case OrdersStatus.DELIVERED:
			banner = "已发货，请等待物流";
			submitText = "确认收货";
			type = "info";
			type = "info";
			btnType = "primary";
			break;
		case OrdersStatus.RECEIVED:
			banner = "已确认收货，期待你的评价！";
			submitText = "去评论";
			type = "info";
			btnType = "info";
			break;
		case OrdersStatus.COMMENTED:
			banner = "已完成评论，欢迎下次光临！";
			submitText = "再来一单";
			type = "success";
			btnType = "success";
			break;
		case OrdersStatus.CANCELED:
			banner = "订单已取消...";
			submitText = "再来一单";
			type = "primary";
			btnType = "primary";
			break;
		case OrdersStatus.DELAY_CANCELED:
			banner = "订单已超时自动取消...";
			submitText = "再来一单";
			type = "primary";
			btnType = "primary";
			break;
		case OrdersStatus.REFUND:
			banner = "发起退款中，等等卖家处理...";
			submitText = "等待中，请稍后";
			type = "warning";
			btnType = "warning";
			break;
		case OrdersStatus.REFUND_SUCCESS:
			banner = "退款成功，请注意到账！";
			submitText = "再来一单";
			type = "info";
			btnType = "info";
			break;
	}
	return {
		banner,
		submitText,
		type,
		btnType,
	};
});
// 状态
const isEdit = ref<boolean>(false); // 是否编辑
const isUpdate = ref<boolean>(order.status === OrdersStatus.READY); // 是否可更新 （地址|留言）
const isLoading = ref<boolean>(false);
const isLoadAddressList = ref<boolean>(false);
if (address.addressList.length === 0) {
	address.resetRequestList(user.getToken);
}
watch(isEdit, (val) => {
	if (val) {
		selectPointsVal.value = 0;
	}
});
const orderItems = ref<(GoodsSkuMdVO & PushOrdersItemDTO)[]>([]);
// 2、查询属性信息
const skuIdList: string[] = [];
order.pushOrderItems?.forEach((p) => {
	skuIdList.push(p.skuId);
});
// 3、加载属性购物列表和选中规格
const loadSkuItems = async () => {
	if (skuIdList.length === 0) return;
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
};
await loadSkuItems();

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
const remark = ref<string>(order.orderInfo.remark);

/**
 * 订单处理（提交、付款、修改订单）
 * @param status
 */
const onSubmitOrders = async (status: OrdersStatus) => {
	// 1、开启加载 | 保存订单 | 关闭全部编辑
	isEdit.value = false; // 全局编辑
	isUpdate.value = false; // 地址|留言更新
	saveOrdersItems();
	switch (status) {
		case OrdersStatus.READY:
			await pushOrder();
			setTimeout(async () => {
				await payOrder(PayType.WEALLET);
			}, 300);
			break;
		case OrdersStatus.UN_PAID:
			await payOrder(PayType.WEALLET);
			break;
		case OrdersStatus.PAID:
			await toastOrder();
			break;
		case OrdersStatus.REFUND_SUCCESS:
		case OrdersStatus.CANCELED:
		case OrdersStatus.COMMENTED:
		case OrdersStatus.REFUND_SUCCESS:
			await aginPushOrder(order.pushOrderItems);
			break;
	}
};

// 1）提交订单 READY -1
const pushOrder = async () => {
	isLoading.value = true;
	// 配置
	const items: PushOrdersItemDTO[] = orderItems.value.map((p) => {
		return {
			skuId: p.skuId,
			quantity: p.quantity,
			shopId: p.shopId, // 店铺id
			couponId: p.couponId, // 代金卷
			activityId: p.activityId, // 活动id
		};
	});
	const { data, message, code } = await pushOrdersItems(
		selectAddressId.value,
		items,
		useCheckXXSText(remark.value),
		user.getToken
	);
	isLoading.value = false;
	if (code === StatusCode.SUCCESS) {
		ElNotification.success({
			title: "提交成功！",
			message: `提交订单成功，请在24小时内完成付款`,
		});
		order.$patch({
			orderId: data.orderId,
			unPaidVO: data,
			status: OrdersStatus.UN_PAID,
		});
	} else {
		ElNotification.error({
			title: "提交失败，请稍后再试！",
			message: message || "",
		});
	}
};

// 2）支付订单 UN_PAID 0
const payOrder = async (payType: PayType) => {
	if (order.status !== OrdersStatus.UN_PAID) return;
	// 确认支付
	const str = payType === PayType.WEALLET ? "钱包" : "其他";
	try {
		const action = await ElMessageBox.confirm(
			`${str}确认支付 ￥${getFinalPrice.value}？`,
			"确认支付",
			{
				confirmButtonText: "支 付",
				confirmButtonClass: "el-button--info border-default shadow-sm",
				cancelButtonText: "取 消",
				center: true,
			}
		);
		if (action === "confirm") {
			isLoading.value = true;
			// 支付订单
			const { data, message, code } = await payOrders(
				order.orderId || order.orderInfo.id,
				PayType.WEALLET,
				selectPointsVal.value,
				selectVoucherId.value,
				user.getToken
			);
			if (code === StatusCode.SUCCESS) {
				ElNotification.success({
					title: "付款成功！",
					message: `支付成功，共花费${data}元`,
				});

				order.status = OrdersStatus.PAID;
				order.orderInfo.status = OrdersStatus.PAID;
			} else {
				ElNotification.error({
					title: "支付失败，请稍后再试！",
					message: message,
				});
			}
		}
		isLoading.value = false;
	} catch (e) {
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
};

// 3）待发货（催发货）
const toastOrder = () => {
	ElMessageBox.alert("我们已收到您的订单，将尽快处理并安排发货！", "提 醒", {
		confirmButtonText: "明 白",
		center: true,
	}).catch();
};
// 4）取消订单 CANCLEL
const cancelOrder = async (orderId: string) => {
	if (order.status !== OrdersStatus.UN_PAID) return;
	try {
		const action = await ElMessageBox.confirm(`是否确认取消订单？`, "取消提示", {
			confirmButtonText: "确 认",
			confirmButtonClass: "el-button--primary is-plain border-default ",
			cancelButtonText: "取 消",
			center: true,
		});
		if (action === "confirm") {
			isLoading.value = true;
			// 发起退款
			const { message, code } = await cancelOrders(
				order.orderId || order.orderInfo.id,
				user.getToken
			);
			isLoading.value = false;
			// 成功
			if (code === StatusCode.SUCCESS) {
				order.orderInfo.updateTime = useDateFormat(
					Date.now(),
					"YYYY-MM-DD HH:mm:ss"
				).value.toString();
				order.status = OrdersStatus.CANCELED;
				order.orderInfo.status = OrdersStatus.CANCELED;
				ElNotification.success({
					title: "取消成功 🎟",
					message: "订单取消成功，优惠卷等优惠也将原路退回！",
				});
			} else {
				// 失败
				ElNotification.error({
					title: "订单取消失败，请稍后再试！",
				});
			}
		}
	} catch (e) {
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
};
// 5）修改订单 update
const updateOrder = async (orderId: string) => {
	if (order.status !== OrdersStatus.UN_PAID && order.status !== OrdersStatus.PAID) return;
	isUpdate.value = false;
	isLoading.value = true;
	if (selectAddressId.value === "") {
		ElMessage.warning("请选择修改地址！");
		return;
	}
	const { message, code } = await updateOrders(
		orderId,
		selectAddressId.value,
		remark.value || order.orderInfo.remark,
		user.getToken
	);
	isLoading.value = false;

	if (code === StatusCode.SUCCESS) {
		order.orderInfo.updateTime = useDateFormat(
			Date.now(),
			"YYYY-MM-DD HH:mm:ss"
		).value.toString();
		let vo = address.addressList.find((p) => p.id === selectAddressId.value);
		if (vo) {
			order.orderInfo.name = vo.name;
			order.orderInfo.phone = vo.phone;
			order.orderInfo.province = vo.province;
			order.orderInfo.city = vo.city;
			order.orderInfo.county = vo.county;
			order.orderInfo.address = vo.address;
			order.orderInfo.postalCode = vo.postalCode;
			order.orderInfo.remark = remark.value;
		}
		ElNotification.success({
			title: "修改订单成功！",
		});
	} else {
		ElNotification.error({
			title: "修改失败，请稍后再试！",
			message: message,
		});
	}
	isUpdate.value = false;
};
// 6）发起退款订单 CANCLEL
const pushRefundOrder = async (orderId: string) => {
	if (
		order.status !== OrdersStatus.PAID &&
		order.status !== OrdersStatus.RECEIVED &&
		order.status !== OrdersStatus.DELIVERED
	)
		return;
	try {
		const action = await ElMessageBox.confirm(`确认发起退款？😢`, "退款提示", {
			confirmButtonText: "退 款",
			confirmButtonClass: "el-button--danger border-default shadow-sm",
			cancelButtonText: "取 消",
			center: true,
		});
		if (action === "confirm") {
			isLoading.value = true;
			// 发起退款
			const { message, code } = await refundOrders(
				order.orderId || order.orderInfo.id,
				user.getToken
			);
			isLoading.value = false;
			if (code === StatusCode.SUCCESS) {
				order.orderInfo.updateTime = useDateFormat(
					Date.now(),
					"YYYY-MM-DD HH:mm:ss"
				).value.toString();
				// 发起退款
				if (order.status === OrdersStatus.RECEIVED) {
					order.status = OrdersStatus.REFUND;
					order.orderInfo.status = OrdersStatus.REFUND;
					ElNotification.success({
						title: "发起退款成功",
						message: message,
					});
				} else {
					// 未发货，直接退款
					order.status = OrdersStatus.REFUND_SUCCESS;
					order.orderInfo.status = OrdersStatus.REFUND_SUCCESS;
					ElNotification.success({
						title: "发起退款成功",
						message: "未发货，正在自动退款，请等待！",
					});
				}
			} else {
				ElNotification.error({
					title: "发起退款失败，请稍后再试！",
				});
			}
		}
	} catch (e) {
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
};
// 8）再来一单
const aginPushOrder = async (items: PushOrdersItemDTO[]) => {
	if (!items || items.length === 0) return;
	isLoading.value = true;
	const pushOrderItems = [...items];
	order.clearOrderItems();
	order.$patch({
		pushOrderItems,
	});
	isUpdate.value = true;
	isEdit.value = false; // 全局编辑
	setTimeout(() => {
		isLoading.value = false;
	}, 500);
};
//--------------------- 统计 计算 -----------------------
// 商品总价 +++
const getAllCoastPrice = computed(() => {
	let price = currency(0);
	orderItems.value.forEach((p) => {
		price = price.add(currency(p.price).multiply(p.quantity));
	});
	return price;
});
// 商品运费 +++
const getAllPostage = computed(() => {
	let price = currency(0);
	orderItems.value.forEach((p) => {
		price = price.add(currency(p.postage));
	});
	return price;
});
// 计算最大额度 --- (最后)
const getPointMax = computed(() => {
	let price = getAllCoastPrice.value.add(getAllPostage.value);
	return price.intValue > 10000 ? 10000 : price.intValue;
});
// 计算最大额度 --- (最后)
const getFinalPrice = computed(() => {
	return getAllCoastPrice.value
		.add(getAllPostage.value)
		.subtract((selectPointsVal.value || 0) / 100);
});

// --------------------- 订单 ------------------------

// 选择地址
const updateAddressId = (id: string) => {
	if (isUpdate.value) {
		selectAddressId.value = id;
	}
};
// -------------------- 功能 -----------------------
/**
 * 打开编辑状态
 * @param status
 */
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

// -------------------- 其他 -----------------------

// 地址刷新
const reloadAddress = async () => {
	if (isLoadAddressList.value) return;
	isLoadAddressList.value = true;
	await address.resetRequestList(user.getToken);
	setTimeout(() => {
		isLoadAddressList.value = false;
	}, 300);
};

// useNuxtApp().hook("link:prefetch", () => {
// 	order.clearOrderItems();
// });

useHead({
	title: appName + " - " + ordersTitle.value.banner,
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
					v-if="user.isLogin && order.pushOrderItems.length > 0"
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
							style="border-width: 2px; border-radius: 10px; margin: 0 1.6rem"
						/>
						<lazy-el-text
							flex
							style="font-weight: 700; font-size: 1.2rem"
							:type="ordersTitle.type || 'primary'"
							>{{ ordersTitle.banner }}
							<!-- 超时计时器 -->
							<div v-if="order.status === OrdersStatus.UN_PAID">
								，剩余:
								<OrderDelayTimer :date="new Date(order.orderInfo.createTime)" />
							</div>
						</lazy-el-text>
						<BtnSwitch class="ml-a mr-0 opacity-0 group-hover:opacity-90" />
					</div>
					<!--------------- 地址+状态 ---------------->
					<div
						v-loading="isLoadAddressList"
						class="v-card group opacity-90 border-default flex flex-col border-t-[var(--el-color-primary)] dark:border-t-[var(--el-color-primary)]"
						border-t="0.5rem solid "
						:style="{ borderTopColor: `var(--el-color-${ordersTitle.type})` }"
					>
						<!-- 订单-状态 -->
						<OrderStatusSteps
							class="mt-2"
							:active="order.status"
							:date="order.orderInfo.createTime"
							v-if="order.status > OrdersStatus.READY"
						/>
						<!-- 选择-收货地址 -->
						<div class="w-full flex flex-col" v-if="isUpdate">
							<h4 tracking-0.2em mb-2>
								收货地址：
								<i
									@click="reloadAddress"
									opacity-0
									v-show="isUpdate"
									group-hover:opacity-100
									class="px-3 float-right hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)]"
								/>
							</h4>
							<ElDivider style="margin: 0.7rem 0" opacity-40 />
							<el-radio-group v-model="selectAddressId" :disabled="!isEdit">
								<el-scrollbar>
									<transition-group
										name="item-list"
										tag="div"
										class="flex w-800px md:w-full pb-3"
									>
										<OrderAddressBoxSe
											@click="updateAddressId(p.id)"
											v-for="p in address.addressList"
											:address="p"
											:key="p.id"
											class="overflow-hidden opacity-80 dark:opacity-70 transition-200 flex-shrink-0 w-220px"
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
										</OrderAddressBoxSe>
										<NuxtLink
											:key="'/user/address'"
											target="_blank"
											to="/user/address"
											class="flex-shrink-0 hover:scale-96 hover:border-solid flex-row-c-c cursor-pointer transition-300 mr-3 mt-2 w-240px min-h-160px p-3.4 relative border-default-dashed border-2px rounded-8px rounded-6px opacity-90 flex flex-col leading-1.2em group"
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
					</div>
					<!-- 订单-地址 -->
					<OrderAddressInfo
						v-show="order.status > OrdersStatus.READY"
						class="v-card border-default"
						:address="order.orderInfo"
					/>
					<!-------------- 商品列表 -------------->
					<div class="v-card border-default order-item flex flex-col">
						<h4 mb-2>
							选购商品
							<el-text
								v-if="order.status === OrdersStatus.READY"
								@click="toEditGoods(order.status)"
								class="cursor-pointer ml-a float-right"
								plain
								:type="isEdit ? 'danger' : 'primary'"
								szie="small"
								>{{ isEdit ? "确定修改" : "修改" }}</el-text
							>
							<ElDivider style="margin: 0.7rem 0" opacity-40 />
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
						<ElDivider class="opacity-40" style="margin: 0.8em 0" />
						<!-- 积分抵扣 -->
						<div
							class="flex-row-bt-c border-0"
							v-if="
								order.status === OrdersStatus.READY ||
								order.status === OrdersStatus.UN_PAID
							"
						>
							<span>
								积分抵扣
								<small opacity-80>100积分低1元（每单上限10000积分）</small>
							</span>
							<!-- 积分选择 -->
							<OrderSelectPoints
								v-model="selectPointsVal"
								:getPointMax="getPointMax"
								:getFinalPrice="getFinalPrice"
								v-if="user.userWallet.points > 0"
							/>
							<small opacity-40 font-600 v-else>暂无积分</small>
						</div>
					</section>
					<!---------------- 备注 ---------------->
					<section class="v-card border-default flex-row-bt-c">
						备注
						<div class="w-10rem md:w-14rem flex justify-end">
							<el-input
								v-if="order.status < OrdersStatus.DELIVERED"
								:disabled="!isUpdate"
								class="remark"
								type="textarea"
								rows="1"
								:minlength="0"
								:maxlength="40"
								v-model.lazy="remark"
								placeholder="给卖家的备注（选填）"
							/>
							<small text-right v-else>{{
								order.orderInfo.remark || "暂无备注"
							}}</small>
						</div>
					</section>
					<!---------------- 订单-信息 ---------------->
					<section
						v-if="order.status !== OrdersStatus.READY"
						class="v-card opacity-80 leading-2em border-default flex flex-col"
					>
						<h4 tracking-0.2em>
							订单信息
							<ElDivider style="margin: 0.7rem 0" opacity-40 />
						</h4>
						<!-- 订单号 -->
						<small
							v-copying.toast="order.orderInfo.id"
							class="flex-row-bt-c w-full cursor-pointer"
						>
							订单号
							<span
								class="transition-300 hover:underline hover:text-[var(--el-color-info)]"
							>
								{{ order.orderInfo.id }}
								<i class="p-2 opacity-60" i-solar:copy-outline />
							</span>
						</small>
						<!-- 支付时间 -->
						<small flex-row-bt-c w-full v-show="order.orderInfo.paidTime">
							支付时间
							<span>{{ order.orderInfo.paidTime }}</span>
						</small>
						<!-- 更新时间 -->
						<small flex-row-bt-c w-full>
							更新时间
							<span>{{ order.orderInfo.updateTime }}</span>
						</small>
						<!-- 下单时间 -->
						<small flex-row-bt-c w-full>
							下单时间
							<span>{{ order.orderInfo.createTime }}</span>
						</small>
					</section>
					<!---------------- 总计 ---------------->
					<section class="v-card leading-2em border-default flex flex-col">
						<h4 tracking-0.2em>合计</h4>
						<ElDivider style="margin: 0.6rem 0" opacity-40 />
						<!-- 原价 -->
						<small opacity-80 flex-row-bt-c w-full>
							原总价
							<span>￥{{ getAllCoastPrice }}</span>
						</small>
						<!-- 运费 -->
						<small opacity-80 flex-row-bt-c w-full>
							运费
							<span>
								{{ getAllPostage.value > 0 ? "￥" + getAllPostage : "￥0.00" }}
							</span>
						</small>
						<!-- 代金卷 -->
						<small
							opacity-80
							flex-row-bt-c
							w-full
							v-show="selectVoucherId !== '' && order.status <= OrdersStatus.UN_PAID"
						>
							代金卷优惠
							<span> {{ voucherList.length ? selectVoucherId : 0 }}元 </span>
						</small>
						<!-- 积分抵扣 -->
						<small
							class="opacity-80 flex-row-bt-c w-full"
							v-show="selectPointsVal > 0 && order.status <= OrdersStatus.UN_PAID"
						>
							积分抵扣
							<span class="text-[var(--el-color-error)]">
								-{{ "￥" + currency(selectPointsVal / 100) }}
							</span>
						</small>
						<ElDivider style="margin: 0.6rem 0" opacity-30 />
						<!-- 总价 -->
						<div flex-row-bt-c w-full>
							总计
							<h3 class="text-[var(--el-color-error)] flex">
								￥<strong block>{{ getFinalPrice }}</strong>
							</h3>
						</div>
					</section>
					<!---------------- 提交 ---------------->
					<section class="v-card border-default flex-row-bt-c shadow-lg sticky bottom-6">
						<!-- 左侧菜单 -->
						<div class="menu">
							<el-text>
								<i p-.8em i-solar:dialog-2-broken mr-2></i>
								客服</el-text
							>
						</div>
						<!-- 左侧菜单 -->
						<div class="submit cursor-pointer">
							<!-- 取消订单 -->
							<el-button
								size="default"
								plain
								v-if="order.status === OrdersStatus.UN_PAID"
								@click="cancelOrder(order.orderId)"
								>取消订单</el-button
							>
							<!-- 修改订单 -->
							<el-button
								size="default"
								:type="isUpdate ? 'danger' : ''"
								plain
								v-if="
									order.status === OrdersStatus.UN_PAID ||
									order.status === OrdersStatus.PAID
								"
								@click="isUpdate = !isUpdate"
								>{{ isUpdate ? "取消修改" : "修改订单" }}</el-button
							>
							<!-- 申请退款 -->
							<el-button
								size="default"
								type="danger"
								plain
								v-if="
									order.status === OrdersStatus.PAID ||
									order.status === OrdersStatus.RECEIVED ||
									order.status === OrdersStatus.DELIVERED
								"
								@click="pushRefundOrder(order.orderId)"
								>申请退款</el-button
							>
							<!-- 提交 -->
							<el-button
								@click="
									isUpdate && order.status !== OrdersStatus.READY
										? updateOrder(order.orderInfo.id)
										: onSubmitOrders(order.status)
								"
								size="default"
								shadow-md
								min-w-8em
								style="font-weight: 600"
								v-if="ordersTitle.submitText"
								:type="ordersTitle.btnType || 'primary'"
							>
								{{
									isUpdate && order.status !== OrdersStatus.READY
										? "确 认"
										: ordersTitle.submitText
								}}
							</el-button>
						</div>
					</section>
				</div>
				<div flex-row-c-c h-90vh w-full v-else>
					<el-empty description="参数错误">
						<h3 my-4>401，参数错误</h3>
						<el-button @click="$router.back()" type="primary">返 回</el-button>
					</el-empty>
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
.remark {
	:deep(.el-textarea__inner) {
		box-shadow: none;
		&:focus,
		&:hover {
			box-shadow: none;
		}
		border-bottom: 1px solid var(--el-border-color);
		padding: 1px;
		background-color: transparent;
		border-radius: 0;
		&.is-disable {
			background-color: transparent;
		}
	}
}

.order-item :deep(.el-input.is-disabled) {
	.el-input__inner {
		color: black;
		font-weight: 600;
		-webkit-text-fill-color: black;
	}
}
.dark .order-item :deep(.el-input.is-disabled) {
	.el-input__inner {
		color: white;
		font-weight: 600;
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
.submit {
	:deep(.el-button) {
		transition: $transition-delay;
		padding: 1.15em 1.15em;
		font-size: 1rem;
		letter-spacing: 0.1em;
	}
}
</style>
