<script lang="ts" setup>
useHead({
	title: '极物圈',
	meta: [
		{
			name: 'description',
			content: '极物圈-主页 开启你的极物之旅！',
		},
	],
}); 
</script>
<template>
	<NuxtLayout name="default">
		<div class="index w-1/1" flex flex-col items-center>
			<div overflow-x-hidden layout-default>
				<IndexTopMenu min-h-160px/>
				<div flex pt-4>
					<!-- 轮播图 -->
					<div class="flex-1" flex-row-c-c>
						<IndexSwiper class="mx-auto" />
					</div>
					<!-- 热门商品 -->
					<div ml-3 class="flex-3">
						<IndexHotGoodsList />
					</div>
				</div>
			</div>
			<div class="bottom" overflowx-hidden>
				<div mt-6 layout-default>
					<!-- 热门商品分类 -->
					<IndexCategoryLine />
					<!-- title -->
					<!-- 商品列表tabs -->
					<IndexGoodsTabs class="mt-6" />
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<style scoped lang="scss"></style>
