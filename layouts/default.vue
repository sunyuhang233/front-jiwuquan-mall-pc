<script lang="ts" setup>
const { footer, menu } = defineProps({
	footer: {
		type: Boolean,
		default: true,
		required: false,
	},
	menu: {
		default: ['shopcart'],
		required: false,
	},
});
</script>
<style scoped lang="scss"></style>

<template>
	<div class="defalut min-h-100vh flex flex-col justify-between">
		<MenuHeaderMenu />
		<!-- 左侧边导航 -->
		<div flex flex-1>
			<MenuDrawerMenu />
			<!-- 内容 -->
			<slot></slot>
		</div>
		<!-- 右下角功能区 -->
		<ClientOnly>
			<MenuRightButtons :menu="menu" />
		</ClientOnly>
		<!-- 页脚 -->
		<MenuFooter v-if="footer" />
	</div>
</template>
<style lang="scss" scoped></style>
