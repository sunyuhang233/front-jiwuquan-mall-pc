<template>
	<div class="second" min-h-100vh flex flex-col justify-between>
		<!-- 顶部导航 -->
		<MenuHeaderMenu />
		<!-- 左侧边导航 -->
		<div flex-1>
			<!-- 内容 -->
			<slot></slot>
		</div>

		<div class="btn">
			<span
				@click="router.back()"
				cursor-pointer
				animate-zoom-in-right
				animate-200
				hover:scale-90
				transition-300
				p-2
				rounded-4em
				style="background-color: var(--el-color-primary)"
				fixed
				right-50px
				top-80px
				w-50px
				h-50px
				flex-row-c-c
			>
				<ElIconArrowLeftBold style="width: 1.7em;height: 1.7em;" text-white />
			</span>
			<!-- 回到顶部 -->
			<el-backtop
				cursor-pointer
				hover:scale-90
				transition-300
				animate-zoom-in-right
				animate-200
				style="width: 56px; height: 56px"
				:right="50"
				:bottom="130"
			/>
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

const router = useRouter();
</script>
<style scoped lang="scss">
:deep(.el-backtop) {
	background-color: var(--el-color-info);
	color: #fff;
	font-size: 2em;
}
</style>
