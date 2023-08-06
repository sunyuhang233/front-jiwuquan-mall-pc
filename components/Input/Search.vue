<template>
  <ElInput
    type="text"
    @keyup.enter="onSearch"
    @focus="$emit('close')"
    @keyup.esc="$emit('close')"
    text-center
    clearable
    v-model.trim="word"
    placeholder="开启搜索之旅✨"
    class="v-input mx-1"
    :required="true"
  />
</template>

<script lang="ts" setup>
const router = useRouter();
// 搜索
let props = defineProps<{
  modelValue: string;
  isChange?: boolean | false;
}>();
// 实例
const instance = getCurrentInstance();
const word = computed({
  get(): string {
    return props.modelValue;
  },
  set(v: string) {
    instance?.emit("update:modelValue", v);
  },
});

const onSearch = () => {
  navigateTo({
    path: `/search`,
    query: {
      name: word.value.trim(),
    },
  });
};
</script>
<style lang="scss" scoped>
$input-width: 24vw;
.v-input {
  :deep(.el-input__wrapper) {
    width: $input-width;
    transition: width $transition-delay;
    transition-timing-function: $animate-cubic-bount;
    letter-spacing: 0.2em;
    border-radius: 20px;
    font-weight: 600;
    height: 36px;
    padding: 0 20px;
    font-size: 14px;
    input::placeholder {
      transition: width $transition-delay;
      font-weight: 600;
      color: var(--el-color-primary-light-5);
    }
    input:focus::placeholder {
      color: transparent;
    }
    input:focus,
    input:valid,
    &.is-focus {
      width: 34vw;
    }
  }

  :deep(.el-input__inner):focus {
    width: 34vw;
  }
}
.dark .v-input :deep(.el-input__wrapper) {
  background-color: black;
  input::placeholder {
    color: #ffffffb3;
  }
}
</style>
