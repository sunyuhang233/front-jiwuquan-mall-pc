<template>
  <!-- 搜索框 -->
  <div>
    <ElInput type="text" @keyup.enter="onSearch" text-center clearable v-model="word" placeholder="开启搜索之旅✨"
      class="v-input mx-1 " />
  </div>
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

const onSearch = () => {
  router.push({
    path: `/search`,
    query: {
      name: word.value.trim()
    }
  })
}

</script>
<style lang="scss" scoped>
$input-width: min(22vw, 260px);

.v-input {
  :deep(.el-input__wrapper) {
    width: $input-width;
    transition: 0.4s;
    transition-timing-function: $animate-cubic-bount;
    letter-spacing: 0.2em;
    border-radius: 20px;
    height: 36px;
    padding: 0 20px;
    font-size: 14px;

    &.is-focus {
      width: min(30vw, 360px);
    }
  }

  :deep(.el-input__inner):focus {
    width: min(30vw, 360px);
  }

  :deep(.el-input__inner):focus::placeholder {
    color: var(--el-color-primary-light-7);
  }



  :deep(.el-input__inner)::placeholder {
    transition: 0.3s;
    font-size: 0.9em;
    letter-spacing: 0.4em;
  }
}

.dark :deep(.el-input__inner):focus::placeholder {
  color: #fff;
}
</style>