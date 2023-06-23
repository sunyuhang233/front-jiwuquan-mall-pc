<script lang="ts" setup></script>
<template>
	<div class="defalut min-h-100vh flex flex-col justify-between">
		<MenuHeaderMenu />
		<!-- 左侧边导航 -->
		<div flex flex-1>
			<MenuDrawerMenu />
			<!-- 内容 -->
			<slot></slot>
		</div>
		<!-- 页脚 -->
		<MenuFooter />
	</div>
</template>
<style lang="scss" scoped></style>
