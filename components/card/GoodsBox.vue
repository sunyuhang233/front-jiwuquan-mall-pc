<script lang="ts" setup>
import { BaseUrlImg } from '~/composables/utils/useFetchUtil';
import { GoodsVO } from '~/types/goods';
// 商品参数
const props = defineProps<{
	goods: GoodsVO;
}>();
const p = props.goods;
const isLoading = ref<boolean>(true);

isLoading.value = false;
</script>
<template>
	<div class="goods-card-box">
		<el-skeleton style="width: 260px" animated :throttle="200" :loading="isLoading">
			<template #template>
				<div
					opacity-90
					border-1
					border-solid
					dark:border-dark-200
					border-gray-200
					rounded-4px
					overflow-hidden
				>
					<el-skeleton-item variant="image" style="width: 260px; height: 160px" />
					<div p-2>
						<el-skeleton-item variant="p" style="width: 90%; height: 0.9em" />
						<el-skeleton-item variant="text" style="width: 60%" class="mt-1" />
					</div>
				</div>
			</template>
			<template #default>
				<!-- 商品 -->
				<div
					dark:border-dark-200
					border-gray-200
					rounded-2px
					shadow-sm
					class="flex flex-col w-1/1"
					cursor-pointer
				>
					<ClientOnly>
						<ElImage
							hover:transform-scale-110
							transition-300
							rounded-2px
							class="w-260px h-180px"
							:src="BaseUrlImg + p.images[0]"
							fit="cover"
						/>
					</ClientOnly>
					<h4 px-3 py-2 class="w-260px truncate ...">
						{{ p.name }}
					</h4>
					<p color-red-6 px-2 pb-4>
						￥{{ goods.price?.toFixed(2) }}
						<small color-coolgray text-0.4em style="text-decoration: line-through">{{
							goods.costPrice.toFixed(2)
						}}</small>
						<!-- 加入购物车 -->
					</p>
				</div>
			</template>
		</el-skeleton>
	</div>
</template>
<style scoped lang="scss"></style>
