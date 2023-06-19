<script lang="ts" setup>
const props = defineProps({
  goods: {
    type: Object,
    required: true
  }
})
const p = props.goods
</script>
<template>
  <div class="card" flex-row-bt-c cursor-pointer p-1>
    <ClientOnly>
        <ElImage hover:transform-scale-110 transition-300 :src="baseUrlImg + p.images[0]"
          style="width: 6em; height: 6em; border: 1px solid #eee; border-radius: 4px" fit="cover" />
    </ClientOnly>
    <div px-4 style="width: 76%;height: 100%;" group flex flex-col items-start justify-between>
      <h3 tracking-1px max-w-12em md:max-w-16em class="overflow-hidden truncate ...">
        {{ p.name }}
      </h3>
      <!-- 中下 -->
      <p color-red mt-2>价格：￥{{ p.price }}</p>
      <!-- 下 -->
      <p flex-row-bt-c align-end>
        <small opacity-80 pr-3>浏览量：{{ p.views }}</small>
        <small opacity-80 pr-3>销量：{{ p.sales }}</small>
        <slot name="btn" :goods="p"></slot>
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
