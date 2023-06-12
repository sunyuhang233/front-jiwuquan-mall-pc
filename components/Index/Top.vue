<template>
  <div class="top" flex-row-bt-c>
    <!-- 问候语 -->
    <div class="title" mt-4 mb-8>
      <p text-lg py-2 tracking-1 opacity-80>{{ useNowDateText(new Date()) }}好，{{ state?.user?.nickName || "你还未登录！" }}</p>
      <h2 tracking-1>欢迎来到极物圈商城</h2>
    </div>
    <!-- <img flex-2 src="@/assets/images/logo/logo_txt.png" w-240px alt="极物圈 logo"> -->

    <div class="right " flex-col>
      <!-- 搜索 -->
      <div class="v-input" flex-row-c-c pb-2>
        <ElInput style="border-radius: 20px;" class="mx-1" type="text" size="large" clearable :prefix-icon="ElIconSearch"
          :disabled="isSearch" minlength="2" maxlength="30" v-model.trim="searchKeyWords" :onSearch="onSearch"
          :placeholder="'搜索商品'" @keyup.enter="onSearch" />
        <ElButton type="primary" @click="onSearch" hover:shadow-md>搜索</ElButton>
      </div>
      <!-- 搜索记录 -->
      <div class="tags" cursor-pointer w-20vw p-1 absolute flex-row flex-wrap>
        <ElTag v-for="(p, i) in searchHistoryList" :key="i" closable @close="handleClose(p)" @click="clickTag(p, i)" mr-1
          mt-1> {{ p }}</ElTag>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from '@/composables/api/goods';
// 搜索相关
const searchKeyWords = ref<string>("")
const isSearch = ref<boolean>(false)
const searchRes = reactive<IPage<GoodsVO[]>>({});
const searchResList = reactive<GoodsVO[]>([]);


// state
const state = useUserStore()
// 搜索历史
// const local = useStorage()
const searchHistoryList = reactive<string[]>([]);
/**
 * 搜索商品
 */
const onSearch = async () => {
  if (!searchKeyWords.value) {
    return ElMessage.warning({
      message: "搜索内容不能为空！",
    })
  }
  // 1、请求 
  isSearch.value = true
  const { data } = await getGoodsListByPage(1, 8, { name: searchKeyWords.value })
  const page = data.data
  searchResList.concat(page.records || [])
  if (searchHistoryList.length <= 6) {
    searchHistoryList.unshift(searchKeyWords.value.trim())
  } else {
    searchHistoryList.pop()
  }
  // 结束
  searchKeyWords.value = ""
  isSearch.value = false
  // 展示结果

}

/**
 * 关闭标签
 * @param tag 
 */
const handleClose = (tag: string) => {
  searchHistoryList.splice(searchHistoryList.indexOf(tag), 1)
}

/**
 * 点击标签
 */
const clickTag = (val: string, i: number) => {
  searchHistoryList.splice(i, 1)
  searchHistoryList.push(val);
  searchKeyWords.value = val
  onSearch()
}

</script>
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

    &:placeholder-shown,
    &:focus-within,
    &:focus {
      width: min(30vw, 320px);
    }
  }

}
</style>
