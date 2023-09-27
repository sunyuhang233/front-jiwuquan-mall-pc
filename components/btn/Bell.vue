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
            class="transition-100 hover:(i-solar:bell-bold bg-[var(--el-color-warning)])"
            i-solar:bell-outline mx-1 block h-1.2em w-1.2em px-0.7em
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
