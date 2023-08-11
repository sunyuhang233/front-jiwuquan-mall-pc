<script lang="ts" setup>
const noticeTip = ref<number>(0);
</script>
<template>
  <div>
    <el-popover trigger="click">
      <template #reference>
        <el-badge
          :value="noticeTip > 0 ? noticeTip : ''"
          cursor-pointer
          hover:animate-swing
        >
          <i
            p-3
            mx-1
            px-0.7em
            class="transition-100 hover:(bg-[var(--el-color-warning)] i-solar:bell-bold)"
            i-solar:bell-outline
          />
        </el-badge>
      </template>
      <template #default>
        <small
          text-center
          class="w-1/1"
        >
          暂无消息
        </small>
      </template>
    </el-popover>
  </div>
</template>
<style scoped lang="scss"></style>
