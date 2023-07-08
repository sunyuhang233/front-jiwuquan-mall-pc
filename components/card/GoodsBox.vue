<script lang="ts" setup>
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import { GoodsVO } from "~/types/goods";
// 商品参数
const props = defineProps<{
	goods: GoodsVO;
}>();
const p = props.goods;
const isLoading = ref<boolean>(true);
const getDiscount = computed<number>(() => {
	return +((1 - p.price / p.costPrice) * 100).toFixed(0) ?? "";
});
isLoading.value = false;
</script>
<template>
	<div class="goods-card-box">
		<el-skeleton style="width: 260px" animated :throttle="300" :loading="isLoading">
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
					dark:bg-dark-8
					border-gray-200
					rounded-4px
					shadow-md
					class="flex flex-col w-1/1 group"
					cursor-pointer
				>
					<!-- 商品图片  -->
					<ClientOnly>
						<div class="img relative w-260px h-170px">
							<ElImage
								hover:transform-scale-110
								transition-300
								rounded-2px
								class="w-1/1 h-1/1"
								:src="BaseUrlImg + p.images[0]"
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
					<h4 px-3 py-3 class="w-260px truncate ...">
						{{ p.name }}
					</h4>
					<p color-red-5 px-3 pb-3 class="texts">
						<strong pr-1>￥{{ goods.price?.toFixed(2) }}</strong>
						<small color-coolgray text-0.6em style="text-decoration: line-through"
							>￥{{ goods.costPrice.toFixed(2) }}</small
						>
						<!-- 小标填充 -->
						<slot :goods="goods"></slot>
					</p>
					<slot name="bottom" :goods="goods"></slot>
				</div>
			</template>
		</el-skeleton>
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
