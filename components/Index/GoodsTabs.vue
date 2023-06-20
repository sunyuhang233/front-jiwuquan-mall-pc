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
      <ListGoodsList :dto="{ saleSort: Sort.DESC }" />
    </el-tab-pane>
    <el-tab-pane
      name="isNew"
      :lazy="true"
      label="新品上架"
    >
      <ListGoodsList :dto="{ isNew: isTrue.TRUE }" />
    </el-tab-pane>
    <el-tab-pane
      name="isViews"
      :lazy="true"
      label="多人围观"
    >
      <ListGoodsList :dto="{ viewsSort: Sort.DESC }" />
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
    padding: 1.2em 0.4em;
    margin-right: 1em;
    display: flex;
    justify-content: center;
  }
}
</style>
