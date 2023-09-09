<template>
  <el-tabs
    class="goods-tabs"
    tab-position="top"
    v-model="activeMenu"
  >
    <el-tab-pane
      name="isHot"
      label="热卖好物"
    >
      <ListGoodsList
        :class="'grid grid-cols-2 md:grid-cols-5 grid-gap-6'"
        :dto="{ saleSort: isTrue.TRUE }"
      />
    </el-tab-pane>
    <el-tab-pane
      name="isNew"
      :lazy="true"
      label="新品上架"
    >
      <ListGoodsList
        :class="'grid grid-cols-2 md:grid-cols-5 grid-gap-6'"
        :dto="{ isNew: isTrue.TRUE }"
      />
    </el-tab-pane>
    <el-tab-pane
      name="isViews"
      :lazy="true"
      label="人气商品"
    >
      <ListGoodsList
        :class="'grid grid-cols-2 md:grid-cols-5 grid-gap-6'"
        :dto="{ viewsSort: isTrue.TRUE }"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
const activeMenu = ref<string>("isHot");
</script>

<!-- 样式scss -->
<style scoped lang="scss">
.goods-tabs {
  :deep(.el-tabs__item) {
    font-size: 1.2em;
    font-weight: 600;
    font-family: sans-serif;
    letter-spacing: 0.1em;
    padding: 1.4em 1.2em;
    margin-right: 1em;
    display: flex;
    justify-content: center;
  }
}
</style>
