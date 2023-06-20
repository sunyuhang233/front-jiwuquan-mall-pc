<script lang="ts" setup>
definePageMeta({
	layout: 'default',
	title: 'Page Title',
  description: 'Page Description',
  keywords: 'Page Keywords'
});

</script>
<template>
	<NuxtLayout>
		<div class="index w-1/1" flex flex-col items-center >
			<div overflow-x-hidden layout-default>
				<!-- 顶部导航 -->
				<IndexTopMenu />
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
			<div class="bottom" overflowx-hidden min-h-80vh>
				<div mt-6 layout-default>
					<!-- 热门商品分类 -->
					<IndexCategoryLine />
					<!-- title -->
					<!-- 商品列表tabs -->
					<IndexGoodsTabs class="mt-6"/>
				</div>
			</div>
			<!-- 购物车 -->
			<div class="shop-card" overflow-hidden>
				<IndexShopCartBar />
			</div>
		</div>
	</NuxtLayout>
</template>

<style scoped lang="scss"></style>
