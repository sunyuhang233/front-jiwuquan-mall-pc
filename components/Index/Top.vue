<template>
  <div class="top" flex-row-bt-c>
    <img flex-2 src="@/assets/images/logo/logo_txt.png" w-240px alt="极物圈 logo">
    <div flex-3>
      <!-- <ElInput type="text" clearable :prefix-icon="ElIconSearch" v-model="goodsKeyWord" round :onSearch="onSearch"
      :placeholder="'搜索'" class="mx-1 w-100 rounded  v-input" @change="props.isChange && $emit('onSearch')" /> -->
      <ClientOnly>
        <el-autocomplete v-model="searchKeyWords" :fetch-suggestions="getAllHotSearch" class="inline-input w-50" clearable
          placeholder="搜索商品" @select="handleSelect" />
      </ClientOnly>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getGoodsListByPage } from '@/composables/api/goods';
const searchKeyWords = ref<string>("")
const res = await getGoodsListByPage(1, 8, { name: searchKeyWords.value })
console.log(res.data);
const getAllHotSearch = async () => {

  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
  ]
}
const handleSelect = (val: Record<string, any>) => {
  console.log(val);
}
</script>
<style scoped lang="scss"></style>
