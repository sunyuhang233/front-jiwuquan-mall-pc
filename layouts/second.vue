<template>
	<div class="second" min-h-100vh flex flex-col justify-between>
		<!-- 顶部导航 -->
		<MenuHeaderMenu />
		<!-- 左侧边导航 -->
		<div class="flex-1 animate-fade-slice">
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
<script lang="ts" setup>
const { footer, menu } = defineProps({
	footer: {
		type: Boolean,
		default: true,
		required: false,
	},
	menu: {
		default: ["shopcart", "back"],
		required: false,
	},
});
</script>
<style lang="scss">
.animate-fade-slice {
	animation: fade-slice-anim $transition-delay linear;
}

@keyframes fade-slice-anim {
	0% {
		transform: translateY(10%);
		transition: 0.3s;
		opacity: 0;
	}
}
</style>
