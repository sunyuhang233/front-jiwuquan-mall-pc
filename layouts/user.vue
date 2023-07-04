<template>
	<div class="second" min-h-100vh flex flex-col justify-between>
		<!-- 顶部导航 -->
		<MenuHeaderMenu />
		<div flex-1>
			<!-- 内容 -->
			<slot></slot>
		</div>
		<!-- 右下角功能区 -->
		<ClientOnly>
			<MenuLeftBottom :menu="menu" />
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
		default: ["back"],
		required: false,
	},
});
</script>
