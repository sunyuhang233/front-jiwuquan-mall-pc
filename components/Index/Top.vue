<template>
  <div class="top" flex-row-bt-c>
    <img flex-2 src="@/assets/images/logo/logo_txt.png" w-240px alt="极物圈 logo">
    <div flex-3>
      <ElInput type="text" clearable :prefix-icon="ElIconSearch" v-model="searchKeyWords" round :onSearch="onSearch"
        :placeholder="'搜索商品'" class="mx-1 rounded  v-input" @keyup.enter="onSearch"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from '@/composables/api/goods';
const searchKeyWords = ref<string>("")

const onSearch = async () => {
  const {data} = await getGoodsListByPage(1, 8, { name: searchKeyWords.value })
  const page =  data.data

  console.log(page);
  
}
</script>
<style scoped lang="scss"></style>
