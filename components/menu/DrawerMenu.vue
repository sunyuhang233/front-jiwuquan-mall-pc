<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_isFold", true);
// 路由
const route = useRoute();
</script>
<template>
	<ClientOnly>
		<!-- 菜单 -->
		<div class="menu-list w-200px" :class="{ 'is-fold': isFold }">
			<el-menu
				style="width: 100%"
				:router="true"
				:default-active="route.path"
				bg=" dark:dark-600"
			>
				<!-- 首页 -->
				<el-menu-item index="/">
					<ElIconHomeFilled />
					<div class="title" mx-4 hidden sm:inline-block>首&emsp;页</div>
				</el-menu-item>
				<!-- 社区 -->
				<el-menu-item index="/community">
					<ElIconSwitchFilled />
					<div class="title" mx-4 hidden sm:inline-block>社&emsp;区</div>
				</el-menu-item>
				<!-- 圈子 -->
				<!-- <el-menu-item index="/quanzi">
					<ElIconGoodsFilled />
					<div class="title" mx-4 hidden sm:inline-block>极物圈</div>
				</el-menu-item> -->
				<el-menu-item index="/setting">
					<ElIconSetting />
					<div class="title" mx-4 hidden sm:inline-block>设&emsp;置</div>
				</el-menu-item>
			</el-menu>
			<!-- 折叠按钮 -->
			<div
				class="collapse flex-row-c-c animate__animated animate__bounceIn"
				@click="isFold = !isFold"
			>
				<ElIconArrowRightBold class="icon is-fold-btn" />
			</div>
		</div>
	</ClientOnly>
</template>

<style lang="scss" scoped>
.menu-list {
	position: sticky;
	top: $top-nav-height;
	left: 0;
	user-select: none;
	z-index: 100;
	height: calc(100vh - $top-nav-height);
	transition: all $transition-delay;

	// 菜单和项
	:deep(.el-menu) {
		width: 100%;
		height: 100%;
		box-shadow: rgba(100, 100, 100, 0.1) 0px 1px 4px;

		.el-menu-item {
			border-radius: 0 3px 3px 0;
			border-right: 3px solid transparent;
			width: 101%;
			transition: 0.3s;
			display: flex;
			overflow: hidden;
			justify-content: center;
			align-items: center;
			text-align: center;
			transition: $transition-delay;
			.title {
				letter-spacing: 0.3em;
			}
			svg {
				width: 1.4em;
				height: 1.4em;
			}
		}

		.el-menu-item.is-active {
			width: 101%;
			background-color: var(--el-color-primary-light-9);
			border-right: 3px solid var(--el-color-primary);
		}
	}
	// 折叠按钮
	.collapse {
		position: absolute;
		z-index: -1;
		bottom: 1em;
		right: -1.8em;
		width: 2em;
		height: 3.2em;
		border-radius: 0 0.3em 0.3em 0;
		background-color: var(--el-color-primary);
		transition: $transition-delay;
		animation-delay: $transition-delay;
		color: white;
		.icon {
			transition: $transition-delay;
		}
		&:hover {
			right: -2em;
		}
	}

	&.is-fold {
		width: 0;
		.el-menu-item {
			overflow: hidden;
			margin: 0;
			padding: 0;
			width: 0;
		}

		.is-fold-btn {
			transition: $transition-delay;
			transform: rotate(-180deg);
		}
	}
}
</style>
