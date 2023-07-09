<script lang="ts" setup>
import { Sort, isTrue } from '@/types/result';
const r = useRoute();
const isLoading = ref<boolean>(false);
const onSearch = () => {
	if (isLoading.value) {
		return ElMessage.warning('搜索太频繁了');
	}
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 300);
};

const dto = reactive<GoodsPageDTO>({
	name: r.query?.name as string,
	cid: r.query?.cid as string,
	isPostage: undefined,
	priceSort: undefined,
	viewsSort: undefined,
	saleSort: undefined,
	isNew: undefined,
});


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
	<NuxtLayout name="second">
		<div layout-default-se w-860px flex flex-col justify-center>
			<!-- 搜索栏目 -->
			<div class="flex-row-c-c">
				<ElInput
					clearable
					ref="searchInpRef"
					input-style="border-radius:20px;;height:52px;font-size:1.1em;font-weight:700;"
					type="text"
					size="large"
					class="shadow-md"
					autocomplete="off"
					:prefix-icon="ElIconSearch"
					minlength="2"
					maxlength="30"
					v-model.lazy="dto.name"
					:onSearch="onSearch"
					:placeholder="'搜索商品'"
					@keyup.enter="onSearch"
				/>
				<el-button
					@click="onSearch"
					type="info"
					shadow-md
					style="width: 10em; height: 50px; font-size: 1.1em; margin-left: 1em"
					size="large"
					>搜 索</el-button
				>
			</div>
			<!-- 结果 -->
			<div class="flex pt-4 opacity-80">
				<el-checkbox
					border
					bg-white
					dark:bg-dark-6
					v-model="isNew"
					label="新品"
				></el-checkbox>
				<el-checkbox
					border
					bg-white
					dark:bg-dark-6
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
				<div v-show="isLoading" v-loading="isLoading" p-2em mt-4em></div>
				<ListGoodsList
					ref="GoodsList"
					class="list w-1/1"
					:dto="dto"
				/>
		</div>
	</NuxtLayout>
</template>
<style scoped lang="scss">
:deep(.el-checkbox__inner) {
	border-radius: 4px;
	scale: 1.2;
}
</style>
