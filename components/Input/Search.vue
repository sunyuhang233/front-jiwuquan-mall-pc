<script lang="ts" setup>
// 搜索
const props = defineProps<{
  modelValue: string
  isChange?: boolean | false
}>();

defineEmits(["open", "close"]);
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

function onSearch() {
  navigateTo({
    path: "/search",
    query: {
      name: word.value.trim(),
    },
  });
}
</script>

<template>
  <ElInput
    v-model.trim="word"
    type="text"
    clearable
    text-center
    placeholder="开启搜索之旅✨"

    class="v-input mx-1" :required="true"
    @keyup.enter="onSearch"
    @focus="$emit('open')"
    @blur="$emit('close')"
    @keyup.esc="$emit('close')"
  />
</template>

<style lang="scss" scoped>
$input-width: min(40vw, 360px);
$scle-input-width: min(68vw, 520px);
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
      width: $scle-input-width;
    }
    .el-input__suffix {
      position: absolute;
      right: 3%;
    }
  }

  :deep(.el-input__inner):focus {
    width: $scle-input-width;
  }
}
.dark .v-input :deep(.el-input__wrapper) {
  background-color: black;
  input::placeholder {
    color: #ffffffb3;
  }
}
</style>
