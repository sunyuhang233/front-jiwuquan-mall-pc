
<template>
  <ElScrollbar  mx-a md:mx-0  max-h-400px  overflow-scroll class="category animate-delay-100 animate__animated animate__fadeIn" tracking-0.1em w-16vw mr-4 flex="col wrap">
    <h3>商品类别</h3>
    <p my-4 type="warning" v-for="(p) in categoryList" :key="p.id">
    <h4 class="first" @click="toView(k)" inline-block mr-2 style="line-height: 100%;">{{ p.name }}</h4>
      <div class="second" inline-block my-1>
        <el-button @click="toView(k)" type="primary" plain v-for="(k) in p?.children" :key="k.id"
          style="margin:0 0.3em;padding: 0 0.8em; cursor: pointer;">
          {{ k.name }}
        </el-button>
      </div>
    </p>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { getGoodsCategoryList, type Category } from '~/composables/api/goods/category';
const data = await getGoodsCategoryList();
const categoryList = ref<Category[]>(data.data || []);
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