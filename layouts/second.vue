<template>
	<div class="min-h-100vh flex flex-col justify-between">
		<!-- 顶部导航 -->
		<MenuHeaderMenu />
		<!-- 左侧边导航 -->
		<div class="flex-1 animate-fade-slice">
			<!-- 内容 -->
			<slot name="default"></slot>
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
<style lang="scss" scoped>
.animate-fade-slice {
	animation: fade-slice-anim $transition-delay;
}

@keyframes fade-slice-anim {
	0% {
		transform: translateY(20%);
		transition: 0.3s;
		opacity: 0;
	}

	100% {
		transform: translateY(0%);
		opacity: 1;
	}
}
</style>
