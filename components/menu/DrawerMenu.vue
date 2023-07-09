<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_isFold", true);
// 路由
const route = useRoute();
</script>
<template>
		<!-- 菜单 -->
		<ClientOnly>
			<transition name="slideInOut">
				<div v-show="!isFold" class="menu-list" w-auto md:w-200px>
					<el-menu :router="true" :default-active="route.path" bg=" dark:dark-600">
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
						<el-menu-item index="/quanzi">
							<ElIconGoodsFilled />
							<div class="title" mx-4 hidden sm:inline-block>极物圈</div>
						</el-menu-item>
						<el-menu-item index="/setting">
							<ElIconSetting />
							<div class="title" mx-4 hidden sm:inline-block>设&emsp;置</div>
						</el-menu-item>
					</el-menu>
					<!-- 折叠按钮 -->
					<div class="collapse" flex-row-c-c p-2 duration-300 @click="isFold = !isFold">
						<ElIconArrowLeftBold skew-y-2 />
					</div>
				</div>
			</transition>
			<!-- 折叠按钮 -->
			<div
				v-show="isFold"
				class="collapse animate__animated animate__bounceIn collapse2"
				flex-row-c-c
				p-l-3
				duration-300
				@click="isFold = !isFold"
			>
				<ElIconArrowRightBold />
			</div>
		</ClientOnly>
</template>

<style lang="scss" scoped>
.menu-list {
	position: fixed;
	user-select: none;
	left: 0;
	z-index: 99;
	height: calc(100vh - $top-nav-height);
	transition: $transition-delay;

	// 菜单和项
	.el-menu {
		height: 100%;
		box-shadow: rgba(100, 100, 100, 0.1) 0px 1px 4px;

		.el-menu-item {
			width: calc(100% + 3px);
			border-right: 3px solid transparent;
			transition: 0.3s;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			padding: 20px 20px;

			.title {
				letter-spacing: 0.3em;
			}

			svg {
				width: 1.4em;
				height: 1.4em;
			}

			NuxtLink {
				transition: $transition-delay;
			}
		}

		.el-menu-item.is-active {
			transition: 0.3s;
			border-radius: 4px;
			background-color: var(--el-color-primary-light-9);
			border-right: 3px solid var(--el-color-primary);
		}
	}
}

// 折叠按钮
.collapse {
	position: absolute;
	z-index: 129;
	bottom: 1em;
	right: 0;
	width: 3em;
	height: 3em;
	cursor: pointer;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	transform: translate(50%, -50%);
	background-color: var(--el-color-primary);
	color: white;
	border-radius: 50%;
	// border-radius: 0% 100% 100% 0% / 50% 50% 50% 50% ;
	// clip-path: ellipse(70% 50% at 0% 50%);

	.icon {
		object-fit: contain;
	}
}
.collapse:hover {
	transform: translate(50%, -50%) scale(0.9);
}
.collapse.dark {
	background-color: var(--el-color-primary);
}

.collapse2 {
	position: fixed;
	left: -1em;
	bottom: 2.5em;
	width: 2.5em;
	height: 3.2em;
	border-radius: 0 0.3em 0.3em 0;
	transition: $transition-delay;
	animation-delay: $transition-delay;
}
.collapse2:hover {
	background-color: $loading-color2;
	left: -0.5em;
}
</style>
