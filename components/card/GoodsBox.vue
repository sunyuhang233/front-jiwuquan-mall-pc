<script lang="ts" setup>
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import { GoodsVO } from "~/types/goods";
// 商品参数
const { goods } = defineProps<{
	goods: GoodsVO;
}>();
const getDiscount = computed<number>(() => {
	return +((1 - goods.price / goods.costPrice) * 100).toFixed(0) ?? "";
});
</script>
<template>
	<div
		class="w-full h-180px md:w-260px md:h-230px border-default cursor-pointer flex flex-col dark:border-dark-200 dark:bg-dark-8 border-gray-200 rounded-4px shadow group"
	>
		<!-- 商品图片  -->
		<ClientOnly>
			<div class="img relative w-1/1 h-2/3">
				<ElImage
					hover:transform-scale-110
					transition-300
					class="w-1/1 h-1/1 rounded-t-4px overflow-hidden"
					:src="BaseUrlImg + goods.images[0]"
					:alt="goods.name"
					fit="cover"
				/>
				<!-- 浏览量 -->
				<small
					class="view w-1/1 py-1 px-3 flex-row-bt-c absolute left-0 bottom-0 z-1 color-light bg-[var(--el-bg-color-primary)] backdrop-blur-2em opacity-0 transition-300"
					group-hover:opacity-80
				>
					<div class="icon">
						<i i-solar:eye-bold p-2 mr-1></i>
						{{ goods.views }}
					</div>
					<strong
						class="dis tracking-0.1em bg-red-5 rounded-2em py-0.2em px-2"
						v-if="+getDiscount"
					>
						{{ `-${getDiscount}%` }}
					</strong>
				</small>
			</div>
		</ClientOnly>
		<div class="flex flex-col h-1/3 py-3 justify-between">
			<h4 class="w-1/1 truncate px-3">
				{{ goods.name }}
			</h4>
			<p color-red-5 class="texts px-3">
				<strong pr-1>￥{{ goods.price?.toFixed(2) }}</strong>
				<small color-coolgray text-0.6em style="text-decoration: line-through"
					>￥{{ goods.costPrice.toFixed(2) }}</small
				>
				<!-- 小标填充 -->
				<slot :goods="goods"></slot>
			</p>
			<slot name="bottom" :goods="goods"></slot>
		</div>
	</div>
</template>
<style scoped lang="scss">
.texts {
	position: relative;
	line-height: 1.2em;
	&:hover > * {
		opacity: 0;
	}
	&::before {
		content: "立即购买";
		background-color: $text-mark-color4;
		position: absolute;
		left: 0;
		width: 100%;
		height: 2em;
		line-height: 2em;
		transform: rotateX(90deg);
		transition: $transition-delay;
		color: #fff;
		text-align: center;
		border-radius: 2px;
	}
	&:hover::before {
		content: "立即购买";
		transform: rotateX(0deg);
		background-color: $text-mark-color4;
		z-index: 1;
	}
}
</style>
