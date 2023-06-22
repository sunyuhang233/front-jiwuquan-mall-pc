<script lang="ts" setup>
import { type GoodsVO } from '~/types/goods';
import { BaseUrlImg } from '~/composables/utils/useFetchUtil';
const { goods } = defineProps<{
	goods: GoodsVO;
}>(); 
</script>
<template>
	<div class="card" flex-row-bt-c cursor-pointer p-1>
		<ClientOnly>
			<ElImage
				hover:transform-scale-110
				transition-300
				:src="BaseUrlImg + goods.images[0]"
				style="width: 6em; height: 6em; border: 1px solid #eee; border-radius: 4px"
				fit="cover"
			/>
		</ClientOnly>
		<div px-4 style="width: 76%; height: 100%" group flex flex-col items-start justify-between>
			<h3 tracking-1px max-w-12em md:max-w-16em class="overflow-hidden truncate ...">
				{{ goods.name }}
			</h3>
			<!-- 中下 -->
			<p font-700 color-red-6 mt-1 mb-5>
				￥{{ goods.price?.toFixed(2) }}
				<small color-coolgray text-0.4em style="text-decoration: line-through">￥{{
					goods.costPrice.toFixed(2)
				}}</small>
			</p>
			<!-- 下 -->
			<p flex-row-bt-c class="w-1/1">
				<small opacity-80>浏览：{{ goods.views }}</small>
				<small opacity-80>销量：{{ goods.sales }}</small>
				<slot name="btn" :goods="goods"></slot>
			</p>
		</div>
	</div>
</template>
<style scoped lang="scss"></style>