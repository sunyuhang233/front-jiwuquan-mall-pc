<template>
  <!-- 搜索框 -->
  <ElInput type="text" clearable :prefix-icon="ElIconSearch" v-model="word" :placeholder="' 搜 一 搜 '"
    class="v-input mx-1 " />
</template>

<script lang="ts" setup>
const router = useRouter()
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

const onSearch = (val: string) => {
  router.push({ path: `/search?q=${val}` })
}

</script>
<style lang="scss" scoped>
$input-width: min(22vw, 260px);
.v-input {
  :deep(.el-input__wrapper) {
    width: $input-width;
    transition: $transition-delay;
    letter-spacing: 0.2em;
    border-radius: 20px;
    height: 36px;
    padding: 0 20px;
    font-size: 14px;

    &.is-focus {
      width: min(30vw, 360px);
    }
  }

  :deep(inp.el-input__inner):focus {
    width: min(30vw, 360px);
  }
}
</style>