<script lang="ts" setup>
import { OrdersStatus } from "~/composables/api/orders";
const order = useOrderStore();
const props = defineProps<{
	active: OrdersStatus | number;
	date: string;
}>();
</script>
<template>
	<div class="mb-3 flex flex-col">
		<el-steps
			v-if="props.active > OrdersStatus.READY && props.active < OrdersStatus.CANCELED"
			class="mt-4 cursor-pointer"
			:active="props.active + 1"
			align-center
			:finish-status="'finish'"
		>
			<el-step title="提交订单" :icon="ElIconShoppingCartFull" />
			<el-step :icon="ElIconMoney">
				<template #icon>
					<i
						:class="{
							'text-[var(--el-color-danger)] ': active === OrdersStatus.UN_PAID,
						}"
						p-3.4
						i-solar:sale-broken
					></i>
				</template>
				<template #title>
					<strong
						:class="{
							'text-[var(--el-color-danger)] ': active === OrdersStatus.UN_PAID,
						}"
						>待支付</strong
					>
				</template>
				<template #description>
					<LazyOrderDelayTimer
						:date="new Date(props.date)"
						v-if="active === OrdersStatus.UN_PAID"
						class="font-600 text-[var(--el-color-danger)]"
					/>
				</template>
			</el-step>
			<el-step title="待发货" description="48小时内发货" :icon="ElIconCreditCard" />
			<el-step title="待收货" :icon="ElIconVan" />
			<el-step title="待评价" :icon="ElIconChatDotSquare" />
		</el-steps>
		<!-- 5、6订单取消 -->
		<div
			v-if="
				props.active === OrdersStatus.DELAY_CANCELED ||
				props.active === OrdersStatus.CANCELED
			"
			class="text-[var(--el-color-primary)]"
			flex
			items-center
			leading-2em
			px-3
		>
			<i mx-4 p-4 mr-6 i-solar:clock-circle-broken></i>
			<div class="flex-1 flex flex-col">
				<h3 v-if="props.active === OrdersStatus.DELAY_CANCELED">
					订单已超时 自动取消，欢迎下次选购！
				</h3>
				<h3 v-if="props.active === OrdersStatus.CANCELED">订单已取消，欢迎下次选购！</h3>
				<small>{{ order.orderInfo.updateTime }}</small>
			</div>
		</div>
		<!-- 3发货信息 -->
		<!-- 8、退款成功 -->
		<div v-if="props.active === OrdersStatus.REFUND_SUCCESS">
			<h3 mb-2>退款成功，请注意查收退款金额！</h3>
			<small>退款时间：{{ order.orderInfo.updateTime }}</small>
		</div>
	</div>
</template>
<style scoped lang="scss"></style>
