<template>
	<el-tabs class="goods-tabs mt-4 min-h-50vh" tab-position="top" v-model="activeMenu">
		<!-- 帖 子 -->
		<el-tab-pane
			lazy
			class="animate__animated animate__fadeIn mt-2"
			name="帖 子"
			:label="'帖 子'"
		>
		</el-tab-pane>
		<!-- 评 论 -->
		<el-tab-pane
			lazy
			class="animate__animated animate__fadeIn mt-2"
			name="评 论"
			:label="'评 论'"
		>
		</el-tab-pane>
		<!-- 相 关 -->
		<el-tab-pane
			lazy
			class="animate__animated animate__fadeIn mt-2"
			name="相 关"
			:label="'相 关'"
		>
		</el-tab-pane>
	</el-tabs>
</template>
<script lang="ts" setup>
const activeMenu = ref<string>("帖 子");
</script>
<!-- 样式scss -->
<style scoped lang="scss">
.goods-tabs {
	:deep(.el-tabs__item) {
		font-size: 1em;
		padding: 1.4em 1.2em;
		margin-right: 1em;
		user-select: none;
		display: flex;
		justify-content: center;
	}
}
</style>
