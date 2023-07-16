<script lang="ts" setup>
import { Sort, isTrue } from "@/types/result";
const r = useRoute();
const showResult = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const onSearch = () => {
	if (isLoading.value) {
		return ElMessage.warning("搜索太频繁了");
	}
	isLoading.value = true;

	setTimeout(() => {
		isLoading.value = false;
		showResult.value = false;
	}, 600);
};

const dto = reactive<GoodsPageDTO>({
	cid: r.query?.cid as string,
	isPostage: undefined,
	priceSort: undefined,
	viewsSort: undefined,
	saleSort: undefined,
	isNew: undefined,
});

const keyWord = ref<string>("");

interface GoodsPageDTO {
	cid?: string;
	name?: string;
	isPostage?: isTrue;
	priceSort?: isTrue;
	viewsSort?: isTrue;
	saleSort?: isTrue;
	isNew?: isTrue;
}
const isNew = computed({
	get() {
		return Boolean(dto.isNew);
	},
	set(val: boolean) {
		dto.isNew = +val || undefined;
	},
});

// 是否免邮
const isPostage = computed({
	get() {
		return Boolean(dto.isPostage);
	},
	set(val: boolean) {
		dto.isPostage = +val || undefined;
	},
});

/**
 * 重置
 */
const reset = () => {
	dto.cid = undefined;
	dto.name = undefined;
	dto.isPostage = undefined;
	dto.priceSort = undefined;
	dto.viewsSort = undefined;
	dto.saleSort = undefined;
	dto.isNew = undefined;
};
</script>
<template>
	<NuxtLayout :left-menu="false" :menu="['shopcart', 'back']">
		<div layout-default-se w-840px flex flex-col items-center>
			<!-- 搜索栏目 -->
			<div class="flex-row-c-c w-1/1">
				<ElInput
					clearable
					ref="searchInpRef"
					input-style="border-radius:20px;height:52px;font-size:1em;"
					type="text"
					size="large"
					class="shadow-sm"
					autocomplete="off"
					:prefix-icon="ElIconSearch"
					minlength="2"
					maxlength="30"
					v-model.lazy="keyWord"
					:onSearch="onSearch"
					:placeholder="'搜索关键字或商品'"
					@keyup.enter="onSearch"
				/>
				<el-button
					@click="onSearch"
					type="info"
					shadow-md
					style="width: 10em; height: 50px; font-size: 1em; margin-left: 1em"
					size="large"
					>搜 索</el-button
				>
				{{ dto.name }}
			</div>
			<!-- 筛选 -->
			<div class="flex pt-4 opacity-80" v-show="showResult">
				<el-checkbox
					class="border bg-white dark:bg-dark-6"
					v-model="isNew"
					label="新品"
				></el-checkbox>
				<el-checkbox
					class="border bg-white dark:bg-dark-6"
					v-model="isPostage"
					label="免运费"
				></el-checkbox>
				<el-select
					v-model="dto.saleSort"
					size="default"
					class="ml-6 w-120px"
					placeholder="销量排序"
				>
					<el-option label="销量升序" :value="0" />
					<el-option label="销量降序" :value="1" />
				</el-select>

				<el-select
					v-model="dto.priceSort"
					size="default"
					class="ml-6 w-120px"
					placeholder="价格排序"
				>
					<el-option label="价格升序" :value="0" />
					<el-option label="价格降序" :value="1" />
				</el-select>

				<el-select
					v-model="dto.viewsSort"
					size="default"
					class="ml-6 w-120px"
					placeholder="浏览量排序"
				>
					<el-option label="浏览量升序" :value="0" />
					<el-option label="浏览量降序" :value="1" />
				</el-select>
				<el-button @click="reset" class="ml-6">重置</el-button>
			</div>
			<!-- <p opacity-80  mt-2>{{ `搜索结果` }}</p> -->
			<ListGoodsList ref="GoodsList" class="list min-h-60vh w-1/1" :dto="dto" />
		</div>
	</NuxtLayout>
</template>
<style scoped lang="scss">
:deep(.el-checkbox__inner) {
	border-radius: 4px;
	scale: 1.2;
}
</style>
