<template>
	<div class="category-list">
		<h3 class="title" dark:text-amber-4 pl-1>
			热门分类
			<i i-solar:adhesive-plaster-bold-duotone ml-4 p-3 bg-yellow-4></i>
		</h3>
		<ClientOnly>
			<ElScrollbar
				:min-size="30"
				overflow-x-scroll
				tracking-0.1em
				class="category animate-delay-100 animate__animated animate__fadeIn"
				style="width: 100%"
			>
				<div class="scroll flex flex-nowrap">
					<div flex-row-c-c mr-2 my-4 v-for="p in categoryList" :key="p.id" relative>
						<!-- 一级 -->
						<el-button
							size="large"
							class="first"
							@click="toView(p)"
							inline-block
							mr-2
							style="
								position: relative;
								display: inline-block;
								width: 9em;
								height: 4.6em;
								line-height: 100%;
							"
							flex-row-c-c
						>
							<img
								:src="BaseUrlImg + p.icon"
								:alt="p.name"
								opacity-85
								rounded-4px
								style="width: 9em; height: 4.6em; object-fit: cover"
								absolute
								top-0
								left-0
								z-0
							/>
							<h3 z-1 text-light>{{ p.name }}</h3>
						</el-button>
						<!-- 二级 -->
						<el-button
							@click="toView(k)"
							type="primary"
							plain
							v-for="k in p?.children"
							:key="k.id"
							style="position: relative; width: 9em; height: 4.6em; line-height: 100%"
							my-2
							mx-0
							flex-row-c-c
						>
							<img
								:src="BaseUrlImg + k.icon"
								:alt="k.name"
								opacity-85
								rounded-4px
								style="width: 100%; height: 100%; object-fit: cover"
								absolute
								top-0
								left-0
								z-0
							/>
							<h3 z-1 text-light>{{ k.name }}</h3>
						</el-button>
					</div>
				</div>
			</ElScrollbar>
		</ClientOnly>
	</div>
</template>

<script lang="ts" setup>
import { getGoodsCategoryList, type CategoryVO } from '~/composables/api/goods/category';
import { BaseUrlImg } from '~/composables/utils/useFetchUtil';
const {
	data: { value },
} = await getGoodsCategoryList();
const categoryList = ref<CategoryVO[]>(value?.data || []);
const router = useRouter();
// 跳转对应分类
const toView = (item: CategoryVO) => {
	router.push({
		path: '/search',
		query: {
			cname: item.name,
			cid: item.id,
		},
	});
};
</script>

<style scoped lang="scss"></style>
