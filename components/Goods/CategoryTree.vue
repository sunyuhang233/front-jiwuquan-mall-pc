<script lang="ts" setup>
import { CategoryVO, getGoodsCategoryByGid } from '~/composables/api/goods/category';
const { gid } = defineProps<{
	gid: string;
	name?: string;
}>();
// 商品分类
const { data } = await getGoodsCategoryByGid(gid.toString());
const category = ref<CategoryVO | null>(data.value?.data || null);
</script>
<template>
	<ClientOnly>
		<div class="category-tree">
			<!-- 生成树 -->
			<el-breadcrumb separator="/" style="letter-spacing: 0.2em; cursor: pointer">
				<el-breadcrumb-item>
					<NuxtLink to="/">主页</NuxtLink>
				</el-breadcrumb-item>
				<el-breadcrumb-item v-show="category?.id">
					<NuxtLink :to="`/search?cid=${category?.id}`">{{ category?.name }}</NuxtLink>
				</el-breadcrumb-item>
				<el-breadcrumb-item v-show="name">
					<p w-14em class="overflow-hidden truncate ...">{{ name }}</p>
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	</ClientOnly>
</template>
<style scoped lang="scss"></style>
