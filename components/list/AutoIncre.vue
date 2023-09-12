<script lang="ts" setup>
const props = withDefaults(defineProps<{
  noMore?: boolean
  immediate?: boolean
}>(), {
  noMore: false,
  immediate: true,
});
const emit = defineEmits(["load"]);
// 停止加载
const loadMoreRef = ref();

// 刷新
const { stop } = useIntersectionObserver(
  loadMoreRef,
  ([obj]) => {
    if (obj.isIntersecting)
      emit("load");
  },
);

onMounted(() => {
  if (props.immediate)
    emit("load");
});


watch(() => props.noMore, (val) => {
  if (val)
    stop && stop();
});
</script>

<template>
  <slot name="default" />
  <span v-if="!noMore" ref="loadMoreRef" h-2 w-full opacity-0 />
</template>
