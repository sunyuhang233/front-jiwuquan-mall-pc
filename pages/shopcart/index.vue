<script lang="ts" setup>
import {
	ShopcartVO,
	deleteBatchShopcartByIds,
	getUserShopCartPage,
} from '~/composables/api/shopcart';
import { PushOrdersItemDTO } from '~/composables/api/orders';
import currency from 'currency.js';
// 定义当前页面
useHead({
	title: '我的购物车',
	meta: [
		{
			name: 'description',
			content: '极物圈-我的购物车',
		},
		{
			name: 'isPermission',
		},
	],
});
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
	let timer: NodeJS.Timeout | null;
	if (!data?.records) return;
	for await (const p of data.records) {
		await new Promise((resolve) => {
			timer = setTimeout(() => {
				shop.shopcartList.push(p);
				clearTimeout(timer ?? undefined);
				timer = null;
				isLoading.value = false;
				return resolve(true);
			}, 50);
		});
	}
};
if (shop.shopcartList.length === 0) {
	loadShopcartList();
}

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
const deleteBatchShopcart = (text: string = '删除') => {
	ElMessageBox({
		title: `${text}提示！`,
		message: `确定要${text}吗？`,
		type: 'warning',
		showClose: false,
		center: true,
		customClass: 'text-center',
		showCancelButton: true,
		cancelButtonText: '取 消',
		confirmButtonText: '删 除',
	})
		.then(async (res) => {
			if (res === 'confirm') {
				const { code } = await deleteBatchShopcartByIds(selectIds.value, user.getToken);
				if (code === StatusCode.SUCCESS && shop.deleteBatchShopCart(selectIds.value)) {
					selectIds.value.splice(0);
					ElMessage.success(text + '成功！');
				} else {
					ElMessage.error('删除失败，请稍后再试试看！');
				}
			}
		})
		.catch((err) => {});
};
// 2、清空购物车
const clearShopcart = () => {
	selectIds.value.push(...shop.shopcartList.map((p) => p.id));
	deleteBatchShopcart('清空');
};
// 购物车选中项目id
const isSelectAll = ref<boolean>(false);
// 3、修改
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

// 4、前往订单页面付款
const toOrderPage = (ids: string[]) => {
	const dtoList: PushOrdersItemDTO[] = [];
	shop.shopcartList.map((p) => {
		if (ids.includes(p.id)) {
			const { skuId, quantity } = p;
			dtoList.push({ skuId, quantity });
		}
	});
	const order = useOrderStore();
	order.$patch({
		pushOrderItems: dtoList,
	});
	useRouter().push({
		path: '/order/pay',
	});
};
// 计算总价
const getAllNums = ref<number>(0);
const getAllPrice = computed(() => {
	getAllNums.value = 0;
	const selectList = shop.shopcartList.filter((p) => selectIds.value.includes(p.id));
	let count = currency(0);
	selectList.forEach((p) => {
		getAllNums.value += p.quantity;
		count = count.add(currency(p.price).multiply(p.quantity));
	});
	return count.value;
});
</script>
<template>
	<NuxtLayout name="second" :footer="false">
		<ClientOnly>
			<div
				v-if="user.isLogin"
				class="shopcart-list"
				border-default
				rounded-t-10px
				shadow-md
				bg-white
				dark:bg-dark
				p-20px
				min-h-95vh
				relative
				mt-2em
				mx-a
				w-700px
			>
				<h2 mb-2 text-center border-0 border-b-1 border-default tracking-0.1em pb-4>
					<small
						style="font-size: 0.8em; padding-top: 0.2em; position: absolute; right: 1em"
						cursor-pointer
						select-none
						@click="isEdit = !isEdit"
						:plain="!isEdit"
						class="transition-300"
						text-green-5
						>{{ !isEdit ? '管理' : '取消' }}</small
					>
					购物车
				</h2>
				<ClientOnly>
					<div
						mb-2
						v-infinite-scroll="loadShopcartList"
						:infinite-scroll-delay="300"
						:infinite-scroll-disabled="notMore"
						style="overflow: auto"
					>
						<!-- 购物车项 -->
						<el-checkbox-group v-model="selectIds" size="large" class="relative">
							<transition-group tag="div" name="fade-list">
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
							</transition-group>
						</el-checkbox-group>
					</div>
				</ClientOnly>
				<!-- 下方按钮 -->
				<div
					class="bottom"
					mt-4em
					style="width: 660px; position: fixed"
					fixed
					bottom-0
					h-4em
					px-4
					flex
					justify-between
					items-center
					border-default
					rounded-10px
					animate-fade-in-up
					border-2px
					my-4
					shadow-md
					relative
					bg-white
					dark-bg-dark-6
					z-999
				>
					<div
						absolute
						class="-top-3em right-0"
						p-2
						px-4
						w-660px
						flex
						items-end
						justify-between
					>
						<span float-left p-1>共计 {{ getAllNums }} 件</span>
						<div flex items-end>
							<span p-1>总计：￥</span>
							<h2 text-red-5 v-incre-up="getAllPrice"></h2>
						</div>
					</div>
					<el-checkbox v-model="isSelectAll" size="large" label="全 选" />
					<div flex>
						<lazy-el-button
							v-if="selectIds.length"
							class="fadeInOut flex-1"
							style="padding: 0em 1em"
							type="danger"
							plain
							:disabled="selectIds.length === 0"
							round
							@click="deleteBatchShopcart('批量删除')"
							>批量删除
							<i i-solar:trash-bin-trash-broken mr-1></i>
						</lazy-el-button>
						<lazy-el-button
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
						</lazy-el-button>
						<lazy-el-button
							class="fadeInOut flex-1"
							style="padding: 0em 2em"
							type="info"
							round
							:disabled="selectIds.length === 0"
							@click="toOrderPage(selectIds)"
							tracking-0.1em
							>去结算</lazy-el-button
						>
					</div>
				</div>
			</div>
		</ClientOnly>
	</NuxtLayout>
</template>
<style scoped lang="scss">
.shop-cart {
	position: fixed;
	bottom: 3em;
	right: 3em;
	transition: $transition-delay;
	z-index: 999;
	border-radius: 50%;
	.icon {
		width: 3.5em;
		height: 3.5em;
		background-color: var(--el-color-primary);
		border-radius: 50%;
		box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
		i {
			color: #fff;
		}
		.count {
			background-color: var(--el-color-danger);
			color: #fff;
			border-radius: 50%;
			min-width: 1.5em;
			min-height: 1.5em;
			text-align: center;
			line-height: 1.2em;
			position: absolute;
			padding: 0.3em;
			right: -10%;
			top: -10%;
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
