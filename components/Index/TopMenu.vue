<template>
	<div class="relative flex-row-bt-c flex-col md:flex-row">
		<i
			class="mx-2em mb-4em w-12em h-6em opacity-70 absolute bg-[var(--el-color-primary)] z-0 select-none filter-blur-3em -z-1"
		/>
		<!-- 问候语 -->
		<div class="select-none title animate__animated animate__fadeInDown" mt-3 mb-8>
			<p class="text-lg py-4 tracking-1 opacity-80">
				{{ useNowDateText(new Date()) }}好，
				<span class="mark1 animatejs"
					>{{ user?.userInfo?.nickname || "你还未登录" }} ！</span
				>
			</p>
			<h2 text-2xl tracking-1>欢迎来到<span class="mark3 animate">极物圈社区 </span>🎉</h2>
		</div>
		<!-- 搜索 -->
		<IndexSearch />
	</div>
</template>
<script lang="ts" setup>
const user = useUserStore();
</script>
