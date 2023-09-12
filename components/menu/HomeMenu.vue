<script lang="ts" setup>
import { useStorage } from "@vueuse/core";

// 是否折叠  本地状态
const isFold = useStorage<boolean>("jiwu_userisFold", true);
// 路由
const route = useRoute();
</script>

<template>
  <div class="menu h-1/1 bg-light backdrop-blur-30 dark:bg-dark-5">
    <ClientOnly>
      <!-- 菜单 -->
      <el-menu :router="true" :default-active="route.path" class="sticky" :collapse="isFold">
        <!-- 顶部 -->
        <div class="w-1/1 flex-row-c-c flex-wrap px-5 transition-300 hover:bg-transparent">
          <div class="home mt-6 transition-300">
            <NuxtLink to="/" flex-row-c-c class="group">
              <i class="i-solar:home-2-broken" />
            </NuxtLink>
          </div>
          <div class="float-left ml-a ml-a mt-6">
            <BtnBell />
          </div>
          <span class="mt-6 p-1 transition-300" @click="isFold = !isFold">
            <i class="i-solar:hamburger-menu-line-duotone" />
          </span>
        </div>
        <div class="mx-a my-4 w-5/6 border-0 border-b-1px border-default" />
        <!-- 个人信息 -->
        <el-menu-item index="/user/info">
          <i v-show="route.path !== '/user/info'" class="i-solar:user-broken" />
          <i v-show="route.path === '/user/info'" class="i-solar:user-bold-duotone" />
          <span class="title ml-3 min-w-10em">个人信息</span>
        </el-menu-item>
        <!-- 钱包 -->
        <el-menu-item index="/user/wallet">
          <i v-show="route.path !== '/user/wallet'" class="i-solar:wallet-broken" />
          <i
            v-show="route.path === '/user/wallet'"
            class="i-solar:wallet-bold-duotone"
          />
          <span class="title ml-3">钱包</span>
        </el-menu-item>
        <!-- 收货地址 -->
        <el-menu-item index="/user/address">
          <i v-show="route.path !== '/user/address'" class="i-solar:compass-broken" />
          <i
            v-show="route.path === '/user/address'"
            class="i-solar:compass-bold-duotone"
          />
          <span class="title ml-3">收货地址</span>
        </el-menu-item>
        <!-- 账号与安全 -->
        <el-menu-item index="/user/safe" class="group">
          <i v-show="route.path !== '/user/safe'" class="i-solar:danger-broken" />
          <i v-show="route.path === '/user/safe'" class="i-solar:danger-bold-duotone" />
          <span class="title ml-3">账号与安全</span>
        </el-menu-item>
        <!-- 回到首页 -->
        <el-menu-item class="... overflow-x-hidden truncate" index="/">
          <i i-solar:square-alt-arrow-left-broken />
          <span class="title ml-3">回到首页</span>
        </el-menu-item>
      </el-menu>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.menu {
	position: sticky;
	user-select: none;
	top: $top-nav-height;
	height: calc(100vh - $top-nav-height);

	:deep(.el-menu) {
		height: 100%;
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
				overflow: hidden;
				text-overflow: ellipsis;
				transition: 100ms;
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
