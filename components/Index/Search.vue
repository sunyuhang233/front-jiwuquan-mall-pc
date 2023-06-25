<template>
	<ClientOnly>
		<!-- 下拉框 -->
		<el-popover
			width="min(435px,38vw)"
			popper-class="popover"
			transition="popSliceUpDown"
			:placement="'bottom-end'"
			:show-after="200"
			:hide-after="0"
			trigger="click"
			:visible="isShowResult"
			popper-style="box-shadow:rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;border-radius:4px;
                                          height:380px; padding: 1.2em 1.2em;"
			tabindex="0"
		>
			<template #reference>
				<div class="content" relative>
					<!-- 搜索 -->
					<div class="v-input" flex-row-c-c pb-2>
						<ElInput
							@click="isShowResult = true"
							ref="searchInpRef"
							@focus="isShowResult = true"
							input-style=""
							class="mr-1 lg:mr-2"
							type="text"
							size="large"
							clearable
							autocomplete="off"
							:prefix-icon="ElIconSearch"
							minlength="2"
							maxlength="30"
							v-model.trim="searchKeyWords"
							:onSearch="onSearch"
							:placeholder="'搜索商品'"
							@blur="clearSearch"
							@keyup.esc="clearSearch"
							@keyup.enter="onSearch"
						/>
						<ElButton
							type="primary"
							w-66px
							@click="onSearch"
							style="transition: 0.2s"
							:loading="isLoading"
						>
							搜索
						</ElButton>
					</div>
					<ClientOnly>
						<!-- 搜索历史记录 -->
						<div
							v-show="!isShowResult"
							class="tags animate__animated animate__headShake"
							z-0
							top-40px
							absolute
							top-0
							cursor-pointer
							py-1
							flex-row
							flex-wrap
						>
							<ElTag
								size="large"
								v-for="(p, i) in searchHistoryList"
								:key="p + i"
								closable
								@close="handleClose(p)"
								@click="clickTag(p, i)"
								mr-1
								mt-2
								hover:opacity-60
								transition-300
							>
								<span pr-0.3em>{{ p }}</span>
							</ElTag>
						</div>
					</ClientOnly>
				</div>
			</template>
			<!-- 2、搜索结果（商品goods） -->
			<template #default>
				<!-- 标题 -->
				<span v-show="searchPageList.length > 0" px-2 py-4 pb-8>
					{{ ` 搜索到 ${searchPage.total} 条数据` }}
				</span>
				<ElIconCloseBold
					width="1.6em"
					absolute
					right-1em
					top-1em
					cursor-pointer
					style="color: var(--el-color-primary)"
					shadow
					shadow-inset
					rounded-4px
					active:transform-scale-80
					transition-300
					@click="clearSearch"
				/>
				<ElScrollbar
					@scroll="onLoadMore"
					overflow-hidden
					pt-3
					flex-col
					v-loading="isLoading"
					element-loading-background="transparent"
				>
					<transition-group
						tag="div"
						name="fade-list"
						class="relative"
					>
						<!-- 跳转详情页 -->
						<NuxtLink
							:to="`/goods/detail/${p.id}`"
							class="mt-2 animate__animated animate__fadeIn"
							v-for="(p, i) in searchPageList"
							:key="p.id"
						>
							<!-- 商品卡片 -->
							<CardGoodsLine :goods="p" :key="p.id" />
							<ElDivider
								dark:opacity-50
								v-if="i !== searchPageList.length - 1"
								style="width: 100%; margin: 0.6em auto; margin-bottom: 0.8em"
							/> </NuxtLink
					></transition-group>
					<ElEmpty
						mt-10
						:image-size="80"
						description="没有找到商品"
						v-show="searchPageList.length <= 0"
					/>
					<p
						@click="onLoadMore"
						v-if="searchPageList.length < searchPage.total"
						py-2
						opacity-80
						text-center
						tracking-2px
						cursor-pointer
						:v-loading="true"
					>
						加载更多
					</p>
					<p v-show="noMore" py-2 opacity-80 text-center tracking-2px>没有更多了</p>
				</ElScrollbar>
			</template>
		</el-popover>
	</ClientOnly>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from '@/composables/api/goods';
import { useStorage } from '@vueuse/core';
import { IPage } from '~/types';
import { GoodsVO } from '~/types/goods';
// 搜索相关
const searchKeyWords = ref<string>('');
const isSearch = ref<boolean>(false);
const isShowResult = ref<boolean>(false);
let searchPage = reactive<IPage<GoodsVO>>({
	records: [],
	total: 0,
	pages: 0,
	size: 0,
	current: 0,
});
const searchPageList = reactive<GoodsVO[]>([]);
// 分页器
const isLoading = ref<boolean>(false);
const page = ref<number>(1);
const size = ref<number>(6);
const noMore = computed(() => searchPage.total > 0 && searchPageList.length === searchPage.total);
// 搜索历史 本地存储
let searchHistoryList = useStorage<string[]>('jiwu_index_search', []);
/**
 * 搜索商品
 */
const onSearch = async () => {
	if (isSearch.value) return ElMessage.error('搜索太频繁！');
	if (!searchKeyWords.value) {
		return ElMessage.error({
			message: '搜索内容不能为空！',
		});
	}
	isLoading.value = true;

	// 1、请求
	isSearch.value = true;
	isShowResult.value = true;
	// 清空
	page.value = 1;
	size.value = 6;
	searchPageList.splice(0);
	searchPage = toReactive({
		records: [],
		total: 0,
		pages: 0,
		size: 0,
		current: 0,
	});

	const data = await getGoodsListByPage(page.value, size.value, { name: searchKeyWords.value });
	const pageData = data.data;
	// 展示结果
	searchPage = toReactive({ ...pageData });
	pageData.records?.forEach((p) => {
		p.images = typeof p.images === 'string' ? p.images.split(',') : [];
		searchPageList.push(p);
	});
	// 添加记录
	if (
		!searchHistoryList.value.includes(searchKeyWords.value) &&
		searchHistoryList.value.length <= 6
	) {
		searchHistoryList.value.unshift(searchKeyWords.value.trim());
	} else {
		searchHistoryList.value.pop();
	}
	// 结束
	// searchKeyWords.value = ""
	setTimeout(() => {
		isLoading.value = false;
		isSearch.value = false;
	}, 500);
};

const onLoadMore = async () => {
	if (page.value < searchPage.pages) {
		page.value += 1;
		const data = await getGoodsListByPage(page.value, size.value, {
			name: searchKeyWords.value,
		});
		const pageData = data.data;
		// 展示结果
		searchPage = toReactive({ ...pageData });
		pageData.records?.forEach((p) => {
			p.images = typeof p.images === 'string' ? p.images.split(',') : [];
			searchPageList.push(p);
		});
	}
};

/**
 * 清除
 */
const clearSearch = (e: any) => {
	setTimeout(() => {
		isShowResult.value = false;
		reactive<IPage<GoodsVO>>({
			records: [],
			total: 0,
			pages: 0,
			size: 0,
			current: 0,
		});
	}, 10);
};

/**
 * 关闭历史标签
 * @param tag
 */
const handleClose = (tag: string) => {
	searchHistoryList.value.splice(searchHistoryList.value.indexOf(tag), 1);
};
const app = useNuxtApp();
let searchInpRef = {};
app.hook('app:mounted', () => {
	searchInpRef = ref('searchInpRef'); // dom
	console.dir(searchInpRef);
});
/**
 * 点击历史标签
 */
const clickTag = (val: string, i: number) => {
	searchHistoryList.value.splice(i, 1);
	searchHistoryList.value.push(val);
	searchKeyWords.value = val;
	onSearch();
};
</script>

<!-- 样式scss -->
<style scoped lang="scss">
$height: 40px;
$input-width: min(22vw, 260px);

.v-input {
	:deep(.el-button) {
		padding: 0 20px;
		letter-spacing: 0.2em;
		height: $height;
	}

	:deep(.el-input__wrapper) {
		width: $input-width;
		height: $height;
		transition: $transition-delay;
		letter-spacing: 0.2em;

		&.is-focus {
			width: min(30vw, 360px);
		}
	}

	:deep(inp.el-input__inner):focus {
		width: min(30vw, 360px);
	}
}

// 弹出框
.popover {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: min(30vw, 320px);

	&hover {
		width: 100%;
	}

	:deep(.el-popover__title) {
		width: 100%;
		text-align: center !important;
	}
}

.tags .el-tags .el-tag__content {
	:deep(.el-close) {
		opacity: 0;
	}

	:deep(.el-close):hover {
		opacity: 1;
	}
}
</style>
