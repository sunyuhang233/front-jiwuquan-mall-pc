<template>
  <ClientOnly class="right" flex-col>
    <!-- 下拉框 -->
    <el-popover width="min(435px,38vw)" popper-class="popover" transition="popSliceUpDown" :placement="'bottom-end'"
      :show-after="200" :hide-after="0" :visible="isShowResult" popper-style="box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;border-radius:4px;
                                           height:380px; padding: 1.2em 1.2em;" tabindex="0">
      <template #reference>
        <div class="content" relative>
          <!-- 搜索 -->
          <div class="v-input" flex-row-c-c pb-2>
            <ElInput ref="searchInpRef" @focus="isShowResult = true" input-style="" class="mr-1 lg:mr-2" type="text"
              size="large" clearable autocomplete="off" :prefix-icon="ElIconSearch" minlength="2" maxlength="30"
              v-model.trim="searchKeyWords" :onSearch="onSearch" :placeholder="'搜索商品'" @blur="clearSearch"
              @keyup.esc="clearSearch" @keyup.enter="onSearch" />
            <ElButton type="primary" w-66px @click="onSearch" style="transition: 0.2s;" :loading="isLoading">
              搜索
            </ElButton>
          </div>
          <!-- 搜索历史记录 -->
          <div class="tags" top-40px absolute top-0 cursor-pointer py-1 flex-row flex-wrap>
            <ElTag size="large" v-for="(p, i) in searchHistoryList" :key="p + i" closable @close="handleClose(p)"
              @click="clickTag(p, i)" mr-1 mt-1 hover:opacity-60 transition-300>
              {{ p }}
            </ElTag>
          </div>
        </div>
      </template>
      <!-- 2、搜索结果（商品goods） -->
      <template #default>
        <!-- 标题 -->
        <small v-show="isShowResult" p-2 pb-4>{{ searchPageList.length ? ` 搜索到 ${searchPage.total}
                  条数据` :
          "搜索为空！" }}</small>
        <ElScrollbar>
          <!-- 跳转详情页 -->
          <NuxtLink :to="`/goods/detail?id=${p.id}`" class="mt-2 goods-card animate-fade-in "
            v-for="(p, i) in searchPageList" :key="p.id">
            <div class="card" flex cursor-pointer p-1>
              <ElImage :src="baseUrlImg + p.images[0]"
                style="width: 6em; height: 6em; border: 1px solid #eee; border-radius: 4px" fit="cover" />
              <div px-4 style="width: 70%;">
                  <h3 tracking-1px max-w-12em md:max-w-16em class="overflow-hidden truncate ...">
                  {{ p.name }}
                </h3>
                <p color-red py-2>价格：￥{{ p.price }}</p>
                <small opacity-80 pr-4>浏览量：{{ p.views }}</small>
                <small opacity-80 float-right>销量：{{ p.sales }}</small>
              </div>
            </div>
            <ElDivider dark:opacity-50 v-if="i !== (searchPageList.length - 1)"
              style="width: 100%;margin: 0.6em auto;margin-bottom: 0.8em; overflow: hidden;" />
          </NuxtLink>
        </ElScrollbar>
        <p v-if="noMore" opacity-80 text-center tracking-2px>没有更多了</p>
        <!-- 背景 -->
        <div class="bg">
        </div>
      </template>
    </el-popover>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from "@/composables/api/goods";
import { useStorage } from "@vueuse/core";
// 搜索相关
const searchKeyWords = ref<string>("");
const isSearch = ref<boolean>(false);
const isShowResult = ref<boolean>(false);
let searchPage = reactive<IPage<GoodsVO>>({});
const searchPageList = reactive<GoodsVO[]>([]);
// 分页器
const isLoading = ref<boolean>(false);
const page = ref<number>(1)
const size = ref<number>(8)
const count = ref<number>(0)
const noMore = computed(() => searchPage?.total && searchPage.total > 0 && count.value === searchPage.total)
// 搜索历史 本地存储
let searchHistoryList = useStorage<string[]>("jiwu_index_search", []);
/**
 * 搜索商品
 */
const onSearch = async () => {
  if (isSearch.value) return ElMessage.error("搜索太频繁！")
  if (!searchKeyWords.value) {
    return ElMessage.error({
      message: "搜索内容不能为空！",
    });
  }
  // 1、请求
  isSearch.value = true;
  isShowResult.value = true;
  searchPageList.splice(0);

  const { data } = await getGoodsListByPage(page.value, size.value, { name: searchKeyWords.value });
  const pageData = data.data;

  // 添加记录 
  if (!searchHistoryList.value.includes(searchKeyWords.value) &&
    searchHistoryList.value.length <= 6) {
    searchHistoryList.value.unshift(searchKeyWords.value.trim());
  } else {
    searchHistoryList.value.pop();
  }
  // 结束
  // searchKeyWords.value = ""
  setTimeout(() => {
    isSearch.value = false;
  }, 300);
  // 展示结果
  searchPage = toReactive(pageData);
  pageData.records?.forEach(p => {
    p.images = typeof p.images === "string" ? p.images.split(",") : [];
    searchPageList.push(p);
  });
};
/**
 * 清除
 */
const clearSearch = () => {
  isShowResult.value = false
}

/**
 * 关闭历史标签
 * @param tag
 */
const handleClose = (tag: string) => {
  searchHistoryList.value.splice(searchHistoryList.value.indexOf(tag), 1);
};
const app = useNuxtApp()
let searchInpRef = {};
app.hook("app:mounted", () => {
  searchInpRef = ref("searchInpRef")// dom
  console.dir(searchInpRef);
})
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

.tags {
  :deep(.el-tag) .el-close {
    opacity: 0;
  }

  :deep(.el-tag):hover .el-close {
    opacity: 1;
  }
}

// .bg {
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   transition: $transition-delay;
//   filter: blur(20px);
//   background-color: #ffffff1a;
//   top: 0;
//   left: 0;
//   z-index: -1;
//   box-shadow: 4px 4px -20px rgba(202, 202, 202, 0.274) ;
// }
</style>
