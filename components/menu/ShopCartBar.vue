<script lang="ts" setup>
import { getUserShopCartPage } from '~/composables/api/shopcart';
const isShow = ref<boolean>(false);
// 分页器
const page = ref<number>(1);
const size = ref<number>(6);
const user = useUserStore();

const { data } = await getUserShopCartPage(page.value, size.value, user.getToken);


</script>
<template>
	<div class="shop-cart">
		<!-- 下拉框 -->
		<el-popover
			width="420px"
			popper-class="popover"
			transition="popSlice"
			:show-after="300"
			:hide-after="0"
			trigger="hover"
			popper-style="box-shadow:rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;border-radius:4px;
    height:380px; padding: 1.2em 1.2em;"
			tabindex="0"
		>
			<template #reference>
				<el-badge :value="12" class="item">
					<div class="icon" cursor-pointer flex-row-c-c hover:opacity-85 transition-300>
						<i i-solar:cart-large-bold-duotone style="width: 60%; height: 60%"></i>
					</div>
				</el-badge>
			</template>
			<!-- 2、搜索结果（商品goods） -->
			<template #default>
				<h1>内容</h1>
			</template>
		</el-popover>
	</div>
</template>
<style scoped lang="scss">
.shop-cart {
	overflow: hidden;
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

		i {
			color: #fff;
		}
	}

	:deep(.badge__content) {
		position: absolute;
		top: 0;
		background-color: $loading-color;
	}

	.popover {
		position: absolute;
	}
}
</style>
