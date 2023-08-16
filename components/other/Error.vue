<script lang="ts" setup>
const { msg } = defineProps<{ msg: string }>();
</script>
<template>
  <ElEmpty description=" ">
    <div
      flex-row-c-c
      flex-col
    >
      <h3 mb-5>{{ msg }}</h3>
      <div class="flex-row-bt-c opacity-90 w-9rem">
        <el-button
          plain
          type="primary"
          @click="$router.back()"
        >
          返回
        </el-button>
        <el-button
          type="primary"
          @click="clearError({ redirect: '/' })"
        >
          主页
        </el-button>
      </div>
    </div>
  </ElEmpty>
</template>
<style scoped lang="scss"></style>
