<template>
	<div class="min-h-100vh flex flex-col justify-between">
		<!-- 头部 -->
		<MenuHeaderMenuSe />
		<div class="flex">
			<ClientOnly>
				<!-- 左侧边导航 -->
				<MenuCollMenu />
			</ClientOnly>
			<!-- 内容 -->
			<div class="flex-1 animate-fade-in animate-duration-300">
				<ClientOnly>
					<slot></slot>
				</ClientOnly>
			</div>
		</div>
		<!-- 右下角功能区 -->
		<ClientOnly>
			<MenuRightButtons :menu="menu" />
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
