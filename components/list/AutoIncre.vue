<script lang="ts" setup>
const props = withDefaults(defineProps<{
  noMore?: boolean
  immediate?: boolean
  delay?: number
}>(), {
  noMore: false,
  immediate: true,
  delay: 400,
});
const emit = defineEmits(["load"]);
// 停止加载
const loadMoreRef = ref();
let timer: any = 0;
// 刷新
const { stop } = useIntersectionObserver(
  loadMoreRef,
  ([obj]) => {
    if (obj.isIntersecting) {
      timer = setInterval(() => {
        if (props.noMore)
          timer && clearInterval(timer);
        emit("load");
      }, props.delay);
    }
    else {
      timer && clearInterval(timer);
    }
  },
);


onMounted(() => {
  if (props.immediate)
    emit("load");
});
onUnmounted(() => {
  clearInterval(timer);
});


watch(() => props.noMore, (val) => {
  if (val)
    stop && stop();
});

defineExpose({
  stop,
  loadMoreRef,
});
</script>

<template>
  <slot name="default" />
  <div v-if="!noMore" ref="loadMoreRef" key="loadMoreRef">
    <slot name="load">
      <p h-2 w-full opacity-0 />
    </slot>
  </div>
</template>
