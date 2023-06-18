
<template>
  <h3>热门类别</h3>
  <div class="list">
    <ElScrollbar :min-size="30" overflow-x-scroll tracking-0.1em
      class="category animate-delay-100 animate__animated animate__fadeIn" style="width: 100%;">
      <div class="scroll" flex flex-nowrap>
        <div flex flex-row-c-c mr-2 my-4 v-for="(p) in categoryList" :key="p.id" relative>
          <!-- 一级 -->
          <el-button size="large" class="first" @click="toView(k)" inline-block mr-2
            style=" position: relative;display: inline-block;width: 8em;height: 4em; line-height: 100%;" flex-row-c-c>
            <img :src="baseUrlImg + p.icon" :alt="p.name"   opacity-85 rounded-4px style="width:8em;height: 4em;object-fit: cover;" absolute top-0
              left-0 z-0>
            <h3 z-1 text-light>{{ p.name }}</h3>
          </el-button>
          <!-- 二级 -->
          <el-button @click="toView(k)" type="primary" plain v-for="(k) in p?.children" :key="k.id"
            style="position: relative;width: 8em;height: 4em; line-height: 100%;" my-2 mx-0 flex-row-c-c>
            <img :src="baseUrlImg + k.icon" :alt="k.name"   opacity-85 rounded-4px style="width: 100%;height:100%;object-fit: cover;" absolute
              top-0 left-0 z-0>
            <h3 z-1 text-light>{{ k.name }}</h3>
          </el-button>
        </div>
      </div>
    </ElScrollbar>
  </div>
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
      categotyName: item.name,
      categotyId: item.id,
    }
  })
}

// 滚动
const handleMouse = (e: Event) => {

}


</script>

<style scoped lang="scss"></style>