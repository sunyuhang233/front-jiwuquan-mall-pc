<template>
  <!-- 搜索框 -->
  <ElInput type="text" clearable :prefix-icon="ElIconSearch" v-model="word" :onSearch="onSearch" :placeholder="'搜索'"
    class="mx-1  v-input" @change="props.isChange && $emit('onSearch')" />
    
</template>

<script lang="ts" setup>

// 搜索
let props = defineProps<{
  modelValue: string,
  isChange?: boolean | false,
}>()
// 实例
const instance = getCurrentInstance()
const word = computed({
  get(): string {
    return props.modelValue
  },
  set(v: string) {
    instance?.emit("update:modelValue", v)
  }
})

const onSearch = () => {

}

</script>
<style lang="scss" scoped>
.v-input {
  width: 30px;
  border-radius: 20px;
  transition: $transition-delay;

  &:hover,
  input:focus-visible,
  input:hover,
  & {
    min-width: 200px;
  }

  :deep(.el-input__wrapper) {
    width: 100%;
    border-radius: 30px;

  }

}
</style>