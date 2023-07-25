<template>
  <div class="catgory">
    <!-- 骨架屏 -->
    <el-skeleton :rows="6" animated :loading="isLoading" :throttle="200"/>
    <ClientOnly>
    <!-- 滚动 -->
    <el-scrollbar overflow-scroll p-4 border="1px dashed gray-200" dark:border="1px dashed dark-200" max-h-400px
      rounded-6px class="category animate-delay-100 animate__animated animate__fadeIn" tracking-0.1em w-360px min-h-380px
      flex="col wrap"> 
        <h3>商品分类
          <i i-solar:bag-3-bold bg-yellow-4 p-3 ml-2></i>
        </h3>
        <p my-4 type="warning" v-for="(p) in categoryList" :key="p.id">
        <h4 class="first" @click="toView(p)" block mr-2 style="line-height: 100%;">{{ p.name }}</h4>
        <el-button @click="toView(k)" type="primary" plain v-for="(k) in p?.children" :key="k.id"
          style="margin: 0.2em 0.5em 0.2em 0; padding: 0 0.8em; cursor: pointer;">
          {{ k.name }}
        </el-button>
        </p>  
    </el-scrollbar>
  </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { getGoodsCategoryList, type CategoryVO } from '~/composables/api/goods/category';
// 加载
const isLoading= ref<boolean>(true);

// 分类列表
const {data,refresh} = await getGoodsCategoryList();
const categoryList = ref<CategoryVO[]>(data.value?.data|| []);
isLoading.value=false
// 跳转查询分类
const router = useRouter()
const toView = (item: CategoryVO) => {
  navigateTo({
    path: '/search',
    query: {
      cid: item.id
    }
  })
}
</script>

<style scoped lang="scss"></style>