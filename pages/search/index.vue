<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import type { isTrue } from "@/types/result";

const r = useRoute();
const showResult = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const keyWord = ref<string>(r.query?.name?.toString() || "");

const isShowOrder = ref<boolean>(false);
// list
const goodsListRef = ref();
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


const searchHistoryList = useStorage<string[]>("jiwu_index_search", []);
interface GoodsPageDTO {
  cid?: string
  name?: string
  isPostage?: isTrue
  priceSort?: isTrue
  viewsSort?: isTrue
  saleSort?: isTrue
  isNew?: isTrue
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

function onSearch() {
  if (isLoading.value)
    return ElMessage.warning("搜索太频繁了");
  else if (!keyWord.value)
    return ElMessage.warning("请输入关键词");

  // 搜索记录
  const flag = searchHistoryList.value.includes(keyWord.value);
  if (!flag && searchHistoryList.value.length <= 8)
    searchHistoryList.value.unshift(keyWord.value.trim());
  else if (flag)
    searchHistoryList.value.pop();

  // 关键字
  dto.name = keyWord.value;
  isLoading.value = true;
  return setTimeout(() => {
    isLoading.value = false;
    showResult.value = true;
    return Promise.resolve();
  }, 500);
}


function handleClose(tag: string) {
  searchHistoryList.value.splice(searchHistoryList.value.indexOf(tag), 1);
}


/**
 * 重置
 */
function reset() {
  showResult.value = false;
  dto.cid = undefined;
  dto.name = undefined;
  dto.isPostage = undefined;
  dto.priceSort = undefined;
  dto.viewsSort = undefined;
  dto.saleSort = undefined;
  dto.isNew = undefined;
  keyWord.value = "";
}
/**
 * 点击历史标签
 */
function clickTag(val: string, i: number) {
  searchHistoryList.value.push(val);
  keyWord.value = val;
  onSearch();
}
definePageMeta({
  key: route => route.path,
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


        min-h-80vh flex flex-col justify-start layout-default-se
      >
        <!-- 搜索栏目 -->
        <div class="h-2.6rem w-1/1 flex-row-c-c">
          <ElInput
            v-model.trim="keyWord"
            clearable
            input-style="border-radius:1rem;height:2.6rem;font-size:1rem;"
            type="text"
            size="large"
            class="shadow-sm"
            autocomplete="off"
            :prefix-icon="ElIconSearch"
            minlength="2"
            maxlength="30"
            :on-search="onSearch"
            placeholder="搜索关键字或商品"
            @keyup.enter="onSearch"
          />
          <el-button
            type="info"
            shadow-md
            style="width: 10em; height: 100%; font-size: 1.2rem; margin-left: 1em"
            size="large"
            @click="onSearch"
          >
            搜 索
          </el-button>
        </div>
        <div class="mt-3 flex items-start md:h-2rem">
          <!-- 筛选 -->
          <div
            :class="{ 'h-6rem md:h-3rem': isShowOrder }"
            class="grid grid-cols-4 h-0 flex-1 gap-2 overflow-hidden opacity-80 transition-300 transition-height md:grid-cols-8"
          >
            <el-checkbox
              v-model="isNew"
              class="rounded-4px bg-white px-2 border-default dark:bg-dark-5"
              label="新品"
              style="margin: 0"
            />
            <el-checkbox
              v-model="isPostage"
              class="rounded-4px bg-white px-2 border-default dark:bg-dark-5"
              label="免运费"
              style="margin: 0"
            />
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
            <el-button @click="reset">
              重置
            </el-button>
          </div>
          <span
            class="ml-a flex-row-c-c cursor-pointer rounded p-2"
            @click="isShowOrder = !isShowOrder"
          >
            {{ isShowOrder ? "收起" : "筛选" }}
            <i class="i-solar:hamburger-menu-line-duotone ml-1 p-0.8em p-2" />
          </span>
        </div>
        <ClientOnly>
          <!-- 搜索历史记录 -->
          <div class="flex flex-nowrap cursor-pointer items-center overflow-hidden py-1 transition-200 transition-margin" :class="isShowOrder ? 'mt-0' : '-mt-3rem'">
            <ElTag
              v-for="(p, i) in searchHistoryList"
              :key="p + i"
              size="large"
              closable
              class="mr-1 mt-2 transition-300"
              @close="handleClose(p)"
              @click="clickTag(p, i)"
            >
              <span pr-0.3em>{{ p }}</span>
            </ElTag>
          </div>
        </ClientOnly>
        <small
          v-show="showResult" my-2
          opacity-80
        >
          {{ `搜索结果` }}
          {{ goodsListRef?.goodsList?.length || "0" }}条
        </small>
        <!-- 搜索记录 -->
        <div v-if="showResult">
          <ListGoodsList
            ref="goodsListRef"
            class="grid grid-cols-2 grid-gap-4 md:grid-cols-4"
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
