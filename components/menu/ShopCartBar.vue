<script lang="ts" setup>
import { deleteBatchShopcartByIds, getUserShopCartPage } from "~/composables/api/shopcart";
import { PushOrdersItemDTO } from "~/composables/api/orders";
import currency from "currency.js";
const shop = useShopStore();
const user = useUserStore();
const isLoading = ref<boolean>(false);
const isShow = ref<boolean>(false);
// 查询页信息
const isNoMore = computed<boolean>(() => shop.shopcartList.length === shop.pageInfo?.total);
/**
 * 加载购物车
 */
const loadShopcartList = async () => {
	if (!user.isLogin || isLoading.value) return;
	if (shop.pageInfo.pages > 0 && shop.shopcartList.length < shop.pageInfo.total) {
		return;
	}
	isLoading.value = true;
	shop.page++;
	const { data } = await getUserShopCartPage(shop.page, shop.size, user.getToken);
	// 没有更多
	if (isNoMore.value || data?.total === -1) {
		return (isLoading.value = false);
	}
	// 展示结果
	shop.pageInfo = toReactive({ ...data });
	data.records.forEach((p) => {
		shop.shopcartList.push(p);
	});
};

// 没有更多
const notMore = computed(() => {
	return (
		shop.shopcartList.length >= shop.pageInfo.total ||
		shop.pageInfo.current === shop.pageInfo.pages
	);
});

// 1、选中的购物车商品
const isEdit = ref<boolean>(false);
const selectIds = ref<string[]>([]);
const deleteBatchShopcart = (text: string = "删除") => {
	ElMessageBox({
		title: `${text}提示！`,
		message: `确定要${text}吗？`,
		type: "warning",
		showClose: false,
		center: true,
		customClass: "text-center",
		showCancelButton: true,
		cancelButtonText: "取 消",
		confirmButtonText: "删 除",
	})
		.then(async (res) => {
			if (res === "confirm") {
				if (res === "confirm") {
					const { code } = await deleteBatchShopcartByIds(selectIds.value, user.getToken);
					if (code === StatusCode.SUCCESS && shop.deleteBatchShopCart(selectIds.value)) {
						selectIds.value.splice(0);
						ElMessage.success(text + "成功！");
					} else {
						ElMessage.error("删除失败，请稍后再试试看！");
					}
				}
			}
		})
		.catch((err) => {});
};

const clearShopcart = () => {
	isSelectAll.value = true;
	deleteBatchShopcart("清空");
};
// 购物车选中项目id
const isSelectAll = ref<boolean>(false);
watch(isSelectAll, (val: boolean) => {
	selectIds.value.splice(0);
	if (val) {
		selectIds.value.push(...shop.shopcartList.map((p) => p.id));
	}
});
// 购物车数量
const getShopCartLength = computed(() => {
	let count = 0;
	for (const p of shop.shopcartList) {
		count += p.quantity;
	}
	return count;
});
// 计算总价
const getAllPrice = computed(() => {
	const selectList = shop.shopcartList.filter((p) => selectIds.value.includes(p.id));
	let count = currency("0.00");
	selectList.forEach((p) => {
		count = count.add(currency(p.price).multiply(p.quantity));
	});
	return count;
});
// 全屏
const fullscreenLoading = ref<boolean>(false);
const router = useRouter();
const order = useOrderStore();
// 前往订单页面付款
const toOrderPage = (ids: string[]) => {
	const dtoList: PushOrdersItemDTO[] = [];
	shop.shopcartList.map((p) => {
		if (ids.includes(p.id)) {
			const { skuId, quantity } = p;
			dtoList.push({ skuId, quantity });
		}
	});

	fullscreenLoading.value = true;
	// 提交订单
	setTimeout(() => {
		fullscreenLoading.value = false;
		order.$patch({
			pushOrderItems: dtoList,
		});
		router.push({
			path: "/order/pay",
		});
	}, 1000);
};
</script>
<template>
	<ClientOnly>
		<div class="shop-cart" v-if="user.isLogin" v-loading.fullscreen.lock="fullscreenLoading">
			<!-- 下拉框 -->
			<ClientOnly>
				<el-popover
					placement="top"
					shadow-lg
					:visible="isShow"
					@keyup.esc="isShow = false"
					width="530px"
					popper-class="popover"
					transition="popSlice"
					:hide-after="0"
					popper-style="box-shadow:rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;border-radius:6px;
    min-height:380px; padding: 1.2em 1em;"
					tabindex="0"
				>
					<template #reference>
						<div
							@click="isShow = true"
							class="icon shadow-[#5d33f9] shadow-opacity-60 shadow-md"
							hover:scale-92
							animate-zoom-in
							animate-duration-600
							cursor-pointer
							flex-row-c-c
							hover:opacity-90
							transition-300
						>
							<span
								class="count animate__animated animate__fadeIn"
								shadow-sm
								v-show="getShopCartLength && getShopCartLength < 99"
								v-incre-up-int="getShopCartLength"
							></span>
							<span
								class="count animate__animated animate__fadeIn"
								shadow-sm
								v-show="getShopCartLength && getShopCartLength > 99"
								>99+</span
							>
							<i i-solar:cart-large-bold-duotone style="width: 60%; height: 60%"></i>
						</div>
					</template>
					<!-- 2、搜索结果（商品goods） -->
					<template #default>
						<div class="content">
							<!-- 登录 -->
							<div class="tologin" flex-row-c-c flex-col v-if="!user.isLogin">
								<h3 text-center mt-10 mb-8>未登录，请登录！</h3>
								<el-button
									@click="user.showLoginForm = true"
									size="large"
									type="primary"
									>立即登录</el-button
								>
							</div>
							<!-- 全局 -->
							<h2
								mb-2
								text-center
								border-0
								border-b-1
								border-default
								tracking-0.1em
								pb-4
							>
								<span
									style="
										font-size: 0.6em;
										position: absolute;
										right: 2em;
										top: 2em;
									"
									cursor-pointer
									select-none
									@click="isEdit = !isEdit"
									:plain="!isEdit"
									class="transition-300"
									>{{ !isEdit ? "管理" : "取消" }}</span
								>
								购物车
							</h2>
							<el-scrollbar height="500px" mb-2>
								<ul
									class="overflow-auto"
									v-infinite-scroll="loadShopcartList"
									:infinite-scroll-delay="1000"
									:infinite-scroll-disabled="notMore"
									style="overflow: auto"
								>
									<!-- 购物车项 -->
									<el-checkbox-group v-model="selectIds" size="large">
										<li v-for="(p, i) in shop.shopcartList" :key="p.id">
											<CardShopLine :shop-cart="p">
												<template #btn>
													<el-checkbox
														:label="p.id"
														:disabled="!p.stock"
													></el-checkbox>
												</template>
											</CardShopLine>
										</li>
									</el-checkbox-group>
								</ul>
							</el-scrollbar>

							<!-- 下方按钮 -->
							<div
								class="bottom"
								style="width: 100%"
								px-2
								flex
								justify-between
								items-center
								border-default
								rounded-6px
								border-2px
							>
								<el-checkbox
									v-model="isSelectAll"
									mx-2
									size="large"
									label="全 选"
								/>
								<div flex-row-bt-c>
									<h3 class="mx-4">
										<small>总计：￥</small>
										<span text-red-5 v-incre-up="getAllPrice"></span>
									</h3>
									<el-button
										v-if="isEdit && selectIds.length"
										class="fadeInOut flex-1"
										style="padding: 0em 1em"
										type="danger"
										plain
										:disabled="selectIds.length === 0 && !isEdit"
										round
										@click="deleteBatchShopcart('批量删除')"
										>批量删除
										<i i-solar:trash-bin-trash-broken mr-1></i>
									</el-button>
									<el-button
										v-if="isEdit"
										class="fadeInOut flex-1"
										style="padding: 0em 1em"
										type="danger"
										plain
										:disabled="!isEdit"
										round
										@click="clearShopcart"
									>
										<i i-solar:trash-bin-trash-broken mr-1></i>
										清空
									</el-button>
									<el-button
										class="fadeInOut flex-1"
										style="padding: 0em 2em"
										type="info"
										round
										:disabled="selectIds.length === 0"
										@click="toOrderPage(selectIds)"
										tracking-0.1em
										>去结算</el-button
									>
								</div>
							</div>
						</div>
					</template>
				</el-popover>
			</ClientOnly>
			<!-- 蒙版 -->
			<div
				class="shop-cart-mock"
				w-100vw
				h-100vh
				bg-dark-300
				dark:bg-dark-200
				transition-200
				opacity-40
				v-show="isShow"
				@click="isShow = false"
				@keyup.esc="isShow = false"
				style="position: fixed; top: 0; left: 0; z-index: -1"
			></div>
		</div>
	</ClientOnly>
</template>
<style scoped lang="scss">
.shop-cart {
	position: relative;
	transition: $transition-delay;
	z-index: 999;
	border-radius: 50%;
	width: 50px;
	height: 50px;

	.icon {
		width: 100%;
		height: 100%;
		background-color: var(--el-color-primary);
		border-radius: 50%;

		i {
			color: #fff;
		}

		.count {
			background-color: var(--el-color-danger);
			color: #fff;
			border-radius: 50%;
			font-size: 0.8em;
			min-width: 2.2em;
			min-height: 2.2em;
			aspect-ratio: 1/1;
			display: flex;
			justify-content: center;
			align-items: center;
			line-height: 2em;
			text-align: center;
			position: absolute;
			right: -20%;
			top: -20%;
		}
	}

	:deep(.badge__content) {
		background-color: $loading-color;
	}

	.popover {
		position: absolute;
	}
}

:deep(.el-checkbox-group) {
	font-size: 1em;
	line-height: 1.1em;

	.el-checkbox__label {
		display: none;
	}
}

:deep(.el-checkbox__inner) {
	border-radius: 4px;
	transform: scale(1.5);
}

// 蒙版
.shop-cart-mock {
	animation: fadeInOut 0.24s ease-in-out;
}

@keyframes fadeInOut {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 0.4;
	}
}
</style>
