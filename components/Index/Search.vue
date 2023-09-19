<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { getGoodsListByPage } from "@/composables/api/goods";
import type { IPage } from "~/types";
import type { GoodsVO } from "~/types/goods";

// 搜索相关
const searchKeyWords = ref<string>("");
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
const size = ref<number>(1);
const noMore = computed(() => searchPage.total > 0 && searchPageList.length === searchPage.total);
// 搜索历史 本地存储
const searchHistoryList = useStorage<string[]>("jiwu_index_search", []);
/**
 * 搜索商品
 */
async function onSearch() {
  if (isSearch.value)
    return ElMessage.error("搜索太频繁！");
  if (!searchKeyWords.value) {
    return ElMessage.error({
      message: "搜索内容不能为空！",
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
    p.images = typeof p.images === "string" ? p.images.split(",") : [];
    searchPageList.push(p);
  });
  // 添加记录
  if (
    !searchHistoryList.value.includes(searchKeyWords.value)
    && searchHistoryList.value.length <= 6
  )
    searchHistoryList.value.unshift(searchKeyWords.value.trim());
  else
    searchHistoryList.value.pop();

  // 结束
  // searchKeyWords.value = ""
  setTimeout(() => {
    isLoading.value = false;
    isSearch.value = false;
  }, 800);
}

async function onLoadMore() {
  if (page.value < searchPage.pages) {
    page.value += 1;
    const data = await getGoodsListByPage(page.value, size.value, {
      name: searchKeyWords.value,
    });
    const pageData = data.data;
    // 展示结果
    searchPage = toReactive({ ...pageData });
    pageData.records?.forEach((p) => {
      p.images = typeof p.images === "string" ? p.images.split(",") : [];
      searchPageList.push(p);
    });
  }
}

/**
 * 清除
 */
function closeSearch() {
  setTimeout(() => {
    isShowResult.value = false;
    searchKeyWords.value = "";
    reactive<IPage<GoodsVO>>({
      records: [],
      total: 0,
      pages: 0,
      size: 0,
      current: 0,
    });
  }, 10);
}
// watch(isShowResult, (val) => {
//   if (val) {
//     const cWidth = document.body.clientWidth || document.documentElement.clientWidth;// 页面可视区域宽度
//     const iWidth = window.innerWidth;// 浏览器窗口大小
//     document.body.style.paddingRight = `${iWidth - cWidth}px`;
//     document.body.style.overflowY = "hidden";
//   }
//   else {
//     document.body.style.overflowY = "auto";
//     document.body.style.paddingRight = "0px";
//   }
// });
// useNuxtApp().hook("page:transition:finish", () => {
//   if (document) {
//     document.body.style.overflowY = "auto";
//     document.body.style.paddingRight = "0px";
//   }
// });
/**
 * 关闭历史标签
 * @param tag
 */
function handleClose(tag: string) {
  searchHistoryList.value.splice(searchHistoryList.value.indexOf(tag), 1);
}
/**
 * 点击历史标签
 */
function clickTag(val: string, i: number) {
  searchHistoryList.value.splice(i, 1);
  searchHistoryList.value.push(val);
  searchKeyWords.value = val;
  onSearch();
}
</script>

<template>
  <div v-window-lock="isShowResult" relative>
    <!-- 下拉框 -->
    <el-popover
      width="100%"
      popper-class="relative popover"
      :teleported="false"
      transition="popup"
      placement="bottom-end"
      :show-after="200"
      :hide-after="0"
      trigger="click"
      :visible="isShowResult"
      popper-style="box-shadow:rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;border-radius:4px; height:395px; padding: 1.2em 1.2em;"
      tabindex="0"
    >
      <template #reference>
        <div
          class="content z-1"
          relative
        >
          <transition name="fade">
            <div
              v-show="isShowResult"
              class="#7d7d7d] bg-[ fixed left-0 top-0 h-100vh w-full overflow-hidden backdrop-blur-8px"
              @click="closeSearch"
            />
          </transition>
          <!-- 搜索 -->
          <div
            class="v-input"
            flex-row-c-c
            pb-2
          >
            <ElInput
              v-model.trim="searchKeyWords"
              class="mr-2"
              type="text"
              size="large"
              clearable
              autocomplete="off"
              :prefix-icon="ElIconSearch"
              minlength="2"
              maxlength="30"
              :on-search="onSearch"
              placeholder="搜索商品"
              @focus="isShowResult = true"
              @keyup.esc="closeSearch"
              @keyup.enter="onSearch"
            />
            <ElButton
              type="primary"
              w-66px
              style="transition: 0.2s; position: relative"
              :loading="isLoading"
              @click="onSearch"
            >
              搜索
            </ElButton>
          </div>
          <!-- 搜索历史记录 -->
          <ClientOnly>
            <div
              v-show="!isShowResult"
              class="animate__animated tags animate__headShake"
              absolute top-0 top-40px z-0 flex flex-nowrap cursor-pointer items-center overflow-hidden py-1
            >
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
        </div>
      </template>
      <!-- 2、搜索结果（商品goods） -->
      <!-- 标题 -->
      <span
        v-show="searchPageList.length > 0"
        px-2
        py-4
        pb-8
      >
        {{ ` 搜索到 ${searchPage.total} 条数据` }}
      </span>
      <ElIconCloseBold
        width="1.6em"
        style="color: var(--el-color-primary)"
        absolute right-1em top-1em cursor-pointer rounded-4px shadow shadow-inset transition-300 active:transform-scale-80
        @click="closeSearch"
      />
      <ElScrollbar
        v-loading="isLoading"
        class="flex-col overflow-hidden pb-6 pr-2 pt-2"
        element-loading-background="transparent"
        @scroll="onLoadMore"
      >
        <transition-group
          tag="div"
          name="fade-bt-list"
          class="relative"
        >
          <!-- 跳转详情页 -->
          <NuxtLink
            v-for="(p, i) in searchPageList"
            :key="p.id"
            :to="`/goods/detail/${p.id}`"
            class="animate__animated animate__fadeIn mt-2"
          >
            <!-- 商品卡片 -->
            <CardGoodsLine
              :key="p.id"
              :goods="p"
            />
            <ElDivider
              v-if="i !== searchPageList.length - 1"
              dark:opacity-50
              style="width: 100%; margin: 0.6em auto; margin-bottom: 0.8em"
            />
          </NuxtLink>
        </transition-group>
        <ElEmpty
          v-show="searchPageList.length <= 0"
          mt-10
          :image-size="80"
          description="没有找到商品"
        />
      </ElScrollbar>
      <p
        v-show="noMore"


        mb-4 py-4 text-center tracking-2px opacity-80
      >
        没有更多了
      </p>
    </el-popover>
  </div>
</template>

<!-- 样式scss -->
<style scoped lang="scss">
$height: 2.6rem;
.v-input {
  :deep(.el-button) {
    padding: 0 30px;
    letter-spacing: 0.2em;
    height: $height;
    margin-right: 0;
  }

  :deep(.el-input__wrapper) {
    height: $height;
    transition: $transition-delay;
    letter-spacing: 0.2em;

    &.is-focus {
      backdrop-filter: blur(20px);
    }
  }
}

// 弹出框
.popover {
  display: flex;
  flex-direction: column;
  align-items: center;

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
