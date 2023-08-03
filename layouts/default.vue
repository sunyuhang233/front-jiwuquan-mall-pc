<template>
	<div class="min-h-100vh flex flex-col">
		<!-- 头部导航 -->
		<MenuHeaderMenu />
		<div class="flex">
			<ClientOnly>
				<!-- 左侧边导航 -->
				<MenuDrawerMenu v-if="leftMenu" />
			</ClientOnly>
			<!-- 内容 -->
			<div class="flex-1 min-h-100vh">
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
