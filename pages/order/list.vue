<script lang="ts" setup>
import { OrdersPageDTO } from "~/composables/api/orders";
import { appName } from "~/constants";
useHead({
	title: appName + " - 订单",
	meta: [
		{
			name: "description",
			content: "极物圈-我的订单",
		},
	],
});
const dto = ref<OrdersPageDTO>({
	name: undefined,
	id: undefined,
	shopId: undefined,
	endTime: undefined,
	startTime: undefined,
});

// 内容
const activeMenu = ref<string>("all");
</script>
<template>
	<div>
		<NuxtLayout name="user" :leftMenu="false" :menu="['back', 'shopcart', 'service']">
			<div layout-default>
				<div class="top">
					<h3 mb-4>我的订单</h3>
				</div>
				<el-tabs class="min-h-50vh" name tab-position="top" v-model="activeMenu">
					<!-- 全部 -->
					<el-tab-pane name="all" class="mt-2" label="全 部">
						<OrderInfoList :is-all="true" :dto="dto" />
					</el-tab-pane>
				</el-tabs>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
