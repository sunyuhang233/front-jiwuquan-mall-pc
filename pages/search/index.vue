<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { isTrue } from "@/types/result";
const r = useRoute();
const showResult = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const onSearch = () => {
	if (isLoading.value) {
		return ElMessage.warning("搜索太频繁了");
	} else if (!keyWord.value) {
		return ElMessage.warning("请输入关键词");
	}
	// 搜索记录
	if (!searchHistoryList.value.includes(keyWord.value) && searchHistoryList.value.length <= 6) {
		searchHistoryList.value.unshift(keyWord.value.trim());
	} else {
		searchHistoryList.value.pop();
	}
	// 关键字
	dto.name = keyWord.value;
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
		showResult.value = true;
	}, 600);
};

const dto = reactive<GoodsPageDTO>({
	name: r.query?.name?.toString(),
	cid: r.query?.cid?.toString(),
	isPostage: undefined,
	priceSort: undefined,
	viewsSort: undefined,
	saleSort: undefined,
	isNew: undefined,
});

const keyWord = ref<string>(r.query?.name?.toString() || "");

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
	showResult.value = false;
	dto.cid = undefined;
	dto.name = undefined;
	dto.isPostage = undefined;
	dto.priceSort = undefined;
	dto.viewsSort = undefined;
	dto.saleSort = undefined;
	dto.isNew = undefined;
	keyWord.value = "";
};

let searchHistoryList = useStorage<string[]>("jiwu_index_search", []);
const handleClose = (tag: string) => {
	searchHistoryList.value.splice(searchHistoryList.value.indexOf(tag), 1);
};
/**
 * 点击历史标签
 */
const clickTag = (val: string, i: number) => {
	searchHistoryList.value.splice(i, 1);
	searchHistoryList.value.push(val);
	keyWord.value = val;
	onSearch();
};
</script>
<template>
	<div>
		<NuxtLayout :left-menu="false" :menu="['shopcart', 'back']">
			<div layout-default-se w-1100px min-h-80vh flex flex-col justify-start>
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
						v-model.trim="keyWord"
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
				</div>
				<!-- 筛选 -->
				<div class="flex pt-4 opacity-80">
					<el-checkbox
						class="border-default px-2 rounded-4px bg-white dark:bg-dark-5"
						v-model="isNew"
						label="新品"
					></el-checkbox>
					<el-checkbox
						class="border-default px-2 rounded-4px bg-white dark:bg-dark-5"
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
				<ClientOnly>
					<!-- 搜索历史记录 -->
					<div class="cursor-pointer py-1 flex items-center flex-nowrap overflow-hidden">
						<ElTag
							size="large"
							v-for="(p, i) in searchHistoryList"
							:key="p + i"
							closable
							@close="handleClose(p)"
							@click="clickTag(p, i)"
							class="mr-1 mt-2 transition-300"
						>
							<span pr-0.3em>{{ p }}</span>
						</ElTag>
					</div>
				</ClientOnly>
				<p opacity-80 mt-4 v-show="showResult">{{ `搜索结果` }}</p>
				<!-- 搜索记录 -->
				<div v-if="showResult">
					<ListGoodsList
						:class="'grid grid-cols-4 grid-gap-5'"
						:timer="false"
						:dto="dto"
					/>
				</div>
				<div v-show="!showResult" min-h-80vh>
					<el-empty :image-size="180" class="mt-10em" description="期待你的搜索 ✨" />
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss">
:deep(.el-checkbox__inner) {
	border-radius: 4px;
	scale: 1;
}
</style>
