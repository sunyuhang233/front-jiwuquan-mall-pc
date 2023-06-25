<template>
	<div class="search">
		<!-- 顶部导航 -->
		<MenuHeaderMenu />
		<!-- 左侧边导航 -->
		<div flex>
			<!-- 内容 -->
			<slot></slot>
		</div>
		<!-- 页脚 -->
		<MenuFooter v-if="footer" />
	</div>
</template>
<script lang="ts" setup> 
const { footer } = defineProps({
	footer: {
		type: Boolean,
		default: true,
		required: false,
	},
});
</script>
<style scoped lang="scss"></style>
