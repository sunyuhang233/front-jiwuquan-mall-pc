<script lang="ts" setup>
useHead({
	title: "极物圈",
	meta: [
		{
			name: "description",
			content: "极物圈-主页 开启你的极物之旅！",
		},
	],
});
</script>
<template>
	<NuxtLayout>
		<div class="layout-default" flex flex-col>
			<IndexTopMenu min-h-160px w-full />
			<div flex flex-col md:flex-row pt-4 w-full>
				<!-- 轮播图 -->
				<div class="flex-1" flex-row-c-c>
					<IndexSwiper />
				</div>
				<!-- 热门商品 -->
				<IndexHotGoodsList />
			</div>
		</div>
		<div class="bottom" overflowx-hidden>
			<div layout-default mt-6>
				<!-- 热门商品分类 -->
				<IndexCategoryLine />
				<!-- 商品列表tabs -->
				<IndexGoodsTabs class="mt-6" />
			</div>
		</div>
	</NuxtLayout>
</template>
<style scoped lang="scss"></style>
