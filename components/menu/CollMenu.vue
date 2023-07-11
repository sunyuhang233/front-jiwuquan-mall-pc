<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_userisFold", true);
// 路由
const route = useRoute();
</script>
<template>
	<div class="menu bg-light dark:bg-dark-5 backdrop-blur-30 h-1/1">
		<!-- 菜单 -->
		<el-menu
			:router="true"
			:default-active="route.path"
			class="sticky h-90vh"
			:collapse="isFold"
		>
			<!-- 顶部 -->
			<div class="w-1/1 flex-row-c-c px-5 pr-4 py-4 hover:bg-transparent">
				<div class="mr-a home c-hidden">
					<NuxtLink to="/" flex-row-c-c class="group">
						<i class="i-solar:home-2-broken"></i>
					</NuxtLink>
				</div>
				<div class="c-hidden ml-a mr-2 float-left">
					<BtnBell />
				</div>
				<span
					@click="isFold = !isFold"
					class="border-default p-1 rounded-1 hover:bg-[var(--el-color-primary-light-8)] transition-300"
				>
					<i class="i-solar:hamburger-menu-line-duotone"></i>
				</span>
			</div>
			<!-- 个人信息 -->
			<el-menu-item index="/user/info">
				<i class="i-solar:user-broken" v-show="route.fullPath !== '/user/info'"></i>
				<i class="i-solar:user-bold-duotone" v-show="route.fullPath === '/user/info'"></i>
				<span class="min-w-10em title ml-3">个人信息</span>
			</el-menu-item>
			<!-- 钱包 -->
			<el-menu-item index="/user/wallet">
				<i class="i-solar:wallet-broken" v-show="route.fullPath !== '/user/wallet'"></i>
				<i
					class="i-solar:wallet-bold-duotone"
					v-show="route.fullPath === '/user/wallet'"
				></i>
				<span class="title ml-3">钱包</span>
			</el-menu-item>
			<!-- 收货地址 -->
			<el-menu-item index="/user/address">
				<i class="i-solar:compass-broken" v-show="route.fullPath !== '/user/address'"></i>
				<i
					class="i-solar:compass-bold-duotone"
					v-show="route.fullPath === '/user/address'"
				></i>
				<span class="title ml-3">收货地址</span>
			</el-menu-item>
			<!-- 账号与安全 -->
			<el-menu-item index="/user/safe" class="group">
				<i class="i-solar:danger-broken" v-show="route.fullPath !== '/user/safe'"></i>
				<i class="i-solar:danger-bold-duotone" v-show="route.fullPath === '/user/safe'"></i>
				<span class="title ml-3">账号与安全</span>
			</el-menu-item>

			<!-- 回到首页 -->
			<el-menu-item class="overflow-x-hidden truncate ..." index="/">
				<i i-solar:square-alt-arrow-left-broken></i>
				<span class="title ml-3">回到首页</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<style lang="scss" scoped>
.menu {
	position: sticky;
	user-select: none;
	top: $top-nav-height;

	:deep(.el-menu) {
		&.el-menu--collapse {
			.c-hidden {
				opacity: 0;
				display: none;
				transition: $transition-delay;
			}
		}
		.el-menu-item {
			padding: 0.8em;
			padding-top: 0px;
			padding-bottom: 0px;
			overflow: hidden;
			text-overflow: clip;
			height: 3em;
			border-radius: 8px;
			margin: 10px;
			transition: $transition-delay;
			border: 1px dashed transparent;
			span {
				transition: $transition-delay;
			}

			&:hover,
			&.is-active:hover,
			&.is-active {
				border: 1px solid;
				color: var(--el-color-primary);
				background-color: var(--el-color-primary-light-9);
				i {
					color: var(--el-color-primary);
				}
			}
			&:hover {
				border: 1px dashed;
			}
		}

		.el-menu-item-group {
			.el-menu-item {
				background-color: #8181811a;
				opacity: 0.9;
				&:hover {
					background-color: #8181811a;
					opacity: 1;
				}
				.second-icon {
					padding: 2px;
				}
			}
			.el-menu-item:hover {
				background-color: transparent;
				color: var(--el-color-primary);
			}

			.el-menu-item-group__title ml-2 {
				display: none;
			}
		}

		// 图标
		i {
			padding: 0.6rem;
			&:hover {
				transition: $transition-delay;
				color: var(--el-color-primary);
			}
		}
		.title {
			margin-left: 0.8em;
		}
	}
}
</style>
