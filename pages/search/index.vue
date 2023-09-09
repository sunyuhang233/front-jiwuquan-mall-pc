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
  const flag = searchHistoryList.value.includes(keyWord.value);
  if (!flag && searchHistoryList.value.length <= 8) {
    searchHistoryList.value.unshift(keyWord.value.trim());
  } else if (flag) {
    searchHistoryList.value.pop();
  }
  // 关键字
  dto.name = keyWord.value;
  isLoading.value = true;
  return setTimeout(() => {
    isLoading.value = false;
    showResult.value = true;
    return Promise.resolve();
  }, 500);
};
// 参数
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
const isShowOrder = ref<boolean>(false);
// list
const goodsListRef = ref();

let searchHistoryList = useStorage<string[]>("jiwu_index_search", []);
const handleClose = (tag: string) => {
  searchHistoryList.value.splice(searchHistoryList.value.indexOf(tag), 1);
};
/**
 * 点击历史标签
 */
const clickTag = (val: string, i: number) => {
  searchHistoryList.value.push(val);
  keyWord.value = val;
  onSearch();
};
definePageMeta({
  key: (route) => route.path,
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout
      name="main"
      :left-menu="false"
      :menu="['shopcart', 'back']"
    >
      <div
        layout-default-se
        min-h-80vh
        flex
        flex-col
        justify-start
      >
        <!-- 搜索栏目 -->
        <div class="flex-row-c-c w-1/1 h-2.6rem">
          <ElInput
            clearable
            ref="searchInpRef"
            input-style="border-radius:1rem;height:2.6rem;font-size:1rem;"
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
            style="width: 10em; height: 100%; font-size: 1.2rem; margin-left: 1em"
            size="large"
          >
            搜 索
          </el-button>
        </div>
        <div class="flex items-start md:h-3rem mt-3">
          <!-- 筛选 -->
          <div
            :class="{ 'h-6rem md:h-3rem': isShowOrder }"
            class="flex-1 h-0 overflow-hidden transition-height transition-300 grid grid-cols-4 md:grid-cols-8 gap-2 opacity-80"
          >
            <el-checkbox
              class="border-default px-2 rounded-4px bg-white dark:bg-dark-5"
              v-model="isNew"
              label="新品"
              style="margin: 0"
            ></el-checkbox>
            <el-checkbox
              class="border-default px-2 rounded-4px bg-white dark:bg-dark-5"
              v-model="isPostage"
              label="免运费"
              style="margin: 0"
            ></el-checkbox>
            <el-select
              v-model="dto.saleSort"
              size="default"
              placeholder="销量排序"
            >
              <el-option
                label="销量升序"
                :value="0"
              />
              <el-option
                label="销量降序"
                :value="1"
              />
            </el-select>
            <el-select
              v-model="dto.priceSort"
              size="default"
              placeholder="价格排序"
            >
              <el-option
                label="价格升序"
                :value="0"
              />
              <el-option
                label="价格降序"
                :value="1"
              />
            </el-select>
            <el-select
              v-model="dto.viewsSort"
              size="default"
              placeholder="浏览量排序"
            >
              <el-option
                label="浏览量升序"
                :value="0"
              />
              <el-option
                label="浏览量降序"
                :value="1"
              />
            </el-select>
            <el-button @click="reset">重置</el-button>
          </div>
          <span
            class="rounded p-2 ml-a flex-row-c-c cursor-pointer"
            @click="isShowOrder = !isShowOrder"
          >
            {{ isShowOrder ? "收起" : "筛选" }}
            <i class="p-2 i-solar:hamburger-menu-line-duotone p-0.8em ml-1" />
          </span>
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
        <p
          opacity-80
          mb-2
          v-show="showResult"
        >
          {{ `搜索结果` }}
          {{ goodsListRef?.goodsList?.length || "0" }}条
        </p>
        <!-- 搜索记录 -->
        <div v-if="showResult">
          <ListGoodsList
            ref="goodsListRef"
            class="grid grid-cols-2 md:grid-cols-4 grid-gap-4"
            :timer="false"
            :dto="dto"
          />
        </div>
        <div
          v-show="!showResult"
          min-h-80vh
        >
          <el-empty
            :image-size="180"
            class="mt-10em"
            description="期待你的搜索 ✨"
          />
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
