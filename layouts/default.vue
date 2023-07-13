<template>
	<div class="min-h-100vh flex flex-col justify-between">
		<MenuHeaderMenu />
		<div class="flex">
			<!-- 左侧边导航 -->
			<ClientOnly>
				<MenuDrawerMenu v-if="leftMenu" />
			</ClientOnly>
			<!-- 内容 -->
			<div class="flex-1">
				<slot></slot>
			</div>
		</div>
		<!-- 右下角功能区 -->
		<ClientOnly>
			<MenuRightButtons :menu="menu" />
		</ClientOnly>
		<!-- 页脚 -->
		<ClientOnly>
			<MenuFooter v-if="footer" />
		</ClientOnly>
	</div>
</template>
<script lang="ts" setup>
const { footer, menu, leftMenu } = defineProps({
	footer: {
		type: Boolean,
		default: true,
		required: false,
	},
	leftMenu: {
		type: Boolean,
		default: true,
		required: false,
	},
	menu: {
		default: ["shopcart"],
		required: false,
	},
});
</script>
