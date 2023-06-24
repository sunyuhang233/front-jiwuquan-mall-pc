
<script lang="ts" setup>
const activeMenu = ref<string>('Goods');

</script>

<template>
	<el-tabs class="goods-tabs min-h-50vh" tab-position="top" v-model="activeMenu">
		<el-tab-pane name="Goods" class="animate__animated animate__fadeIn" label="热卖好物">
			<ListGoodsList :dto="{ saleSort: Sort.DESC }" />
		</el-tab-pane>
	</el-tabs>
</template>

<!-- 样式scss -->
<style scoped lang="scss">
.goods-tabs {
	:deep(.el-tabs__item) {
		font-size: 1.2em;
		font-weight: 600;
		font-family: sans-serif;
		letter-spacing: 0.1em;
		padding: 1.4em 1.2em;
		margin-right: 1em;
		display: flex;
		justify-content: center;
	}
}
</style>
