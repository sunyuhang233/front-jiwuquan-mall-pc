<template>
	<el-tabs class="goods-tabs min-h-50vh" tab-position="top" v-model="activeMenu">
		<!-- 详情 -->
		<el-tab-pane name="detail" class="animate__animated animate__fadeIn mt-2" label="详 情">
			<h3 px-4 mb-2>{{ goodsInfo?.name }}</h3>
			<!-- <v-md-preview-html
				:html="goodsInfo?.description"
				preview-class="vuepress-markdown-body"
			></v-md-preview-html> -->
			<!-- des -->
			<div class="text" leading-2em px-4 border-default-dashed rounded-6px mb-4>
				<small>
					发货地：{{
						(goodsInfo?.province || '') + (goodsInfo?.city || '') + goodsInfo?.district
					}}
				</small>
				<br />
				<small>
					保障：
					<el-text v-if="goodsInfo?.refundTime"
						>{{ goodsInfo?.refundTime }}日无理由退换货</el-text
					>
				</small>
			</div>
			<!-- imgs -->
			<div class="imgs" flex flex-col>
				<el-image
					style="width: 80%; margin: 0.4em 0"
					:src="BaseUrlImg + p"
					v-for="(p, i) in goodsInfo?.images"
					:key="p"
				></el-image>
			</div>
		</el-tab-pane>
		<!-- 评价 -->
		<el-tab-pane name="omments" lazy class="animate__animated animate__fadeIn mt-2" :label="'评 价'">
			<GoodsComments :goods-id="goodsInfo?.id||''" :sku-list="skuList"  />
		</el-tab-pane>
		<!-- 其他 -->
		<el-tab-pane name="other" lazy class="animate__animated animate__fadeIn mt-2" label="其 他">
			<GoodsOtherTmp />
		</el-tab-pane>
	</el-tabs>
</template>
<script lang="ts" setup>
import { GoodsInfoVO } from '~/composables/api/goods';
import { GoodsSkuVO } from '~/composables/api/goods/sku';
// markdown
// @ts-ignore
// import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
const { goodsInfo, skuList } = defineProps<{
	goodsInfo?: GoodsInfoVO;
	skuList?: GoodsSkuVO[];
}>();
const activeMenu = ref<string>('detail');
</script>
<!-- 样式scss -->
<style scoped lang="scss">
.goods-tabs {
	:deep(.el-tabs__item) {
		font-size: 1em;
		font-family: sans-serif;
		letter-spacing: 0.1em;
		padding: 1.4em 1.2em;
		margin-right: 1em;
		display: flex;
		justify-content: center;
	}
}
</style>
