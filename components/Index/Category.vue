<template>
  <ClientOnly>
    <el-scrollbar overflow-scroll p-4
    border="1px dashed gray-200" dark:border="1px dashed dark-200"
    max-h-400px
      rounded-6px  class="category animate-delay-100 animate__animated animate__fadeIn" tracking-0.1em w-360px min-h-380px
      flex="col wrap">
      <h3>商品分类
        <i i-solar:bag-3-bold bg-yellow-4 p-3 ml-2></i>
      </h3>
      <p my-4 type="warning" v-for="(p) in categoryList" :key="p.id">
      <h4 class="first" @click="toView(k)" inline-block mr-2 style="line-height: 100%;">{{ p.name }}</h4>
      <el-button @click="toView(k)" type="primary" plain v-for="(k) in p?.children" :key="k.id"
        style="margin: 0.2em 0.5em 0.2em 0; padding: 0 0.8em; cursor: pointer;">
        {{ k.name }}
      </el-button>
      </p>
    </el-scrollbar>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { getGoodsCategoryList, type Category } from '~/composables/api/goods/category';
const categoryList = ref<Category[]>([]);
const data = await getGoodsCategoryList();
data.data?.forEach((p) => categoryList.value.push(p))
const router = useRouter()
const toView = (item: Category) => {
  router.push({
    path: '/search',
    query: {
      categotyId: item.id
    }
  })
}
</script>

<style scoped lang="scss"></style>