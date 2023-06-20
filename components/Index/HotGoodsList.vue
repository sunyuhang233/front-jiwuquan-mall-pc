<template>
	<div
		class="hot-list"
		min-h-420px
		h-420px
		p-4
		mx-a
		md:ma-0
		rounded-4px
		min-w-420px
		border="1px solid gray-200"
		dark:border="1px solid dark-200"
	>
		<h3 px-1 pb-4>
			热门商品
			<span p-3 bg-red-6 mx-2 i-solar:fire-bold></span>
		</h3>
		<!-- 骨架屏 -->
		<el-skeleton animated :loading="isLoading" :throttle="300" class="ske">
			<template #template>
				<div flex p-2 opacity-80>
					<el-skeleton-item
						style="width: 5.6em; height: 5.6em; border-radius: 2px"
						variant="image"
					/>
					<div flex-1 px-2 flex flex-col justify-around>
						<el-skeleton-item style="opacity: 0.8" variant="p" />
						<el-skeleton-item style="width: 50%" variant="text" />
						<el-skeleton-item style="width: 60%" variant="text" />
					</div>
				</div>
			</template>
		</el-skeleton>
		<!-- 商品列表 -->
		<ClientOnly>
			<el-scrollbar
				v-if="!isLoading"
				height="88%"
				style="background: linear-gradient(var(--el-bg-color), #) bottom center"
			>
				<NuxtLink
					:to="`/goods/detail?id=${p.id}`"
					class="mt-2 animate__animated animate__fadeIn"
					v-for="(p, i) in hotGoodsList"
					:key="p.id"
				>
					<!-- 商品卡片 -->
					<CardGoodsLine :goods="p" :key="p.id" class="card">
						<template #btn>
							<!-- 立即购买 -->
							<div opacity-0 class="item" float-right>
								<el-button
									group:hover:block
									type="danger"
									style="padding: 0 1em; margin-left: 2em"
									><nuxt-link to="" style="font-size: 10px"
										>前往购买</nuxt-link
									></el-button
								>
							</div>
						</template>
					</CardGoodsLine>
					<ElDivider
						dark:opacity-50
						v-if="i !== hotGoodsList.length - 1"
						style="width: 100%; margin: 0.6em auto; margin-bottom: 0.8em"
					/>
				</NuxtLink>
				<p v-show="searchPage.total < hotGoodsList.length" @click="">加载更多</p>
			</el-scrollbar>
		</ClientOnly>
	</div>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from '@/composables/api/goods';
import { GoodsVO } from '~/types/goods';
// 分页器
const page = ref<number>(1);
const size = ref<number>(6);

// 骨架屏
const isLoading = ref<boolean>(true);
const { data } = await getGoodsListByPage(page.value, size.value, {
	viewsSort: Sort.DESC,
	saleSort: Sort.DESC,
});
// 展示结果
const searchPage = reactive(
	data || {
		records: [{}],
		total: 0,
		pages: 0,
		size: 0,
		current: 0,
	}
);
const hotGoodsList = ref<GoodsVO[]>([]);
data?.records.forEach((p: GoodsVO) => {
	p.images = typeof p.images === 'string' ? p.images.split(',') : [];
	hotGoodsList.value.push(p);
});
isLoading.value = false;
</script>

<!-- 样式scss -->
<style scoped lang="scss">
.card {
	.item {
		opacity: 0;
		float: right;
		transform: translateY(40%);
	}

	&:hover {
		.item {
			transition: $transition-delay;
			transform: translateY(0%);
			opacity: 1;
		}
	}
}

.dark .hot-list {
	background-color: rgba(17, 17, 17, 0.712);
}

.hot-list {
	background-color: #ffffff;
	position: relative;
	backdrop-filter: blur(20px);


}
</style>
