<script lang="ts" setup>
import { GoodsCommentsVO } from '~/composables/api/goods/comments';
import { GoodsSkuVO } from '~/composables/api/goods/sku';

const { comment, skuItem } = defineProps<{
	comment: GoodsCommentsVO;
	skuItem: GoodsSkuVO;
}>();

const getPreImages = computed(() => {
	// @ts-ignore
	return [...comment.images.map((p) => (p = BaseUrlImg + p))];
});

const getRateComm = (rate: number): string => {
	let msg = ['很差', '差', '一般', '较满意', '强烈推荐'];
	return msg[Math.floor(rate - 1)];
};

const getProps = (p: GoodsSkuVO): string => {
	return (p?.size || '') + (p?.color || '') + (p?.combo || '');
};
</script>
<template>
	<div
		animate-fade-in
		class="card w-1/1"
		border-default-dashed
		border-2px
		transition-300
		hover:shadow-md
		hover:border="solid purple-5"
		rounded-6px
		p-5
	>
		<ClientOnly>
			<!-- 头像名称 -->
			<div class="top flex justify-between">
				<ElImage
					lazy
					hover:transform-scale-110
					transition-300
					:src="BaseUrlImg + comment.avatar"
					style="width: 3em; height: 3em"
					class="rounded-10em mr-2 border-default-dashed border-1px avatar"
					fit="cover"
				/>
				<div flex flex-col justify-around flex-1>
					<p text-0.9em>{{ comment.isAnonymous ? '匿名用户' : comment.nickName }}</p>
					<div flex-row-c-c justify-start>
						<small mr-4 opacity-80>{{ comment.createTime }}</small>
						<el-rate v-model="comment.rate" disabled allow-half />
						<el-text>{{ getRateComm(comment.rate) }}</el-text>
					</div>
				</div>
				<div class="right" float-right>
					<el-tag v-if="comment.isRecommend">
						<i i-solar:like-bold-duotone p-2 mr-1></i>
						买家推荐</el-tag
					>
				</div>
			</div>
			<!-- 评论内容 -->
			<p class="text text-overflow-2" px-2 mt-2 text-0.9em>
				{{ comment.content }}
			</p>
			<!-- 商品图片 -->
			<el-scrollbar class="scroll flex flex-nowrap m-4">
				<video
					v-if="comment.video && comment.video !== 'default.mp4'"
					hover:transform-scale-110
					transition-300
					:src="BaseUrlVideo + comment.video"
					style="width: 6em; height: 6em"
					class="rounded-4px mr-2 border-default-dashed border-1px"
					fit="cover"
				></video>

				<ElImage
					lazy
					v-for="(p, i) in comment.images"
					:key="p"
					preview-teleported
					:preview-src-list="getPreImages"
					hover:transform-scale-110
					transition-300
					:src="BaseUrlImg + p"
					style="width: 6em; height: 6em"
					class="rounded-4px mr-2 border-default-dashed border-1px"
					fit="cover"
				/>
			</el-scrollbar>
			<!-- 评价商品规格 -->
			<div class="comment-sku" border-default-dashed bg-gray-200 dark:bg-dark-5 border-2px rounded-6px inline-flex items-center ml-4 pr-4 backdrop-blur-3px>
				<ElImage
					v-show="skuItem?.image"
					hover:transform-scale-110
					transition-300
					:src="BaseUrlImg + skuItem?.image"
					style="width: 3em; height: 3em"
					class="rounded-4px mr-2 border-default-dashed border-1px"
					fit="cover"
				/>
				<small >{{ getProps(skuItem) }}</small>
			</div>
			<!-- 底部 -->
			<div class="bottom" px-2 flex-row-bt-c>
				<span></span>
				<el-text type="primary" class="text text-overflow-2" px-2  text-0.9em>
					回复
				</el-text>
			</div>
		</ClientOnly>
	</div>
</template>
<style scoped lang="scss"></style>
