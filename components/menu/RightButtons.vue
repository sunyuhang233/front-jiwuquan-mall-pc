<script lang="ts" setup>
const user = useUserStore();
const { menu } = defineProps({
	menu: {
		default: ["shopcart"],
		required: false,
	},
});
const router = useRouter();
const route = useRoute();
const toBack = () => {
	if (route) {
		router.back();
	} else {
		router.push("/");
	}
};
</script>
<template>
	<ClientOnly>
		<div class="btns">
			<!-- 回到顶部 -->
			<el-backtop
				style="width: 52px; height: 52px; overflow: auto"
				class="animate-zoom-in-right animate-duration-500 cursor-pointer hover:scale-90 transition-300 rounded-10em shadow-[#0bdb85] shadow-opacity-60 shadow-md"
			/>
			<!-- 返回 -->
			<span
				v-if="menu.includes('back')"
				@click="toBack()"
				cursor-pointer
				animate-zoom-in-right
				animate-delay-200
				animate-duration-600
				hover:scale-90
				transition-300
				class="icon shadow-[var(--el-color-primary)] shadow-opacity-40 shadow-md"
				p-2
				mt-3
				rounded-4em
				style="background-color: var(--el-color-primary)"
				w-52px
				h-52px
				flex-row-c-c
			>
				<ElIconArrowLeftBold style="width: 80%; height: 80%" text-light-600 />
			</span>
			<!-- 购物车 -->
			<div
				animate-delay-400
				animate-duration-600
				class="shop-card mt-3 relative"
				v-if="menu.includes('shopcart') && user.isLogin"
			>
				<MenuShopCartBar />
			</div>
		</div>
	</ClientOnly>
</template>
<style scoped lang="scss">
.btns {
	z-index: 999;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: fixed;
	bottom: 2em;
	right: 2em;
	transition: $transition-delay;
}

:deep(.el-backtop) {
	position: static;
	background-color: var(--el-color-info);
	color: #fff;
	font-size: 2em;
}
</style>
