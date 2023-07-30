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
	<div>
		<NuxtLayout name="default">
			<div class="layout-default">
				<div flex flex-col>
					<IndexTopMenu w-full />
					<div flex flex-col md:flex-row pt-4 w-full>
						<!-- 轮播图 -->
						<IndexSwiperList mb-6 w-full md:mr-a md:w="620px" h-300px md:h="420px" />
						<!-- 热门商品 -->
						<IndexHotGoodsList mx-0 md:m-0 />
					</div>
				</div>
				<div class="bottom" overflowx-hidden>
					<div mt-6>
						<!-- 热门商品分类 -->
						<IndexCategoryLine />
						<!-- 商品列表tabs -->
						<IndexGoodsTabs class="mt-6" />
					</div>
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
