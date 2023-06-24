<template>
	<div class="defalut" min-h-100vh flex flex-col justify-between>
		<!-- 顶部导航 -->
		<MenuHeaderMenu top-class="px-20em"/>
		<!-- 左侧边导航 -->
		<div flex-1>
			<!-- 内容 -->
			<slot></slot>
		</div>
		<!-- 页脚 -->
		<MenuFooter />
	</div>
</template>
<script lang="ts" setup></script>
<style scoped lang="scss"></style>
