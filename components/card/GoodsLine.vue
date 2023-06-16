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
  <div class="card" flex cursor-pointer p-1>
    <ClientOnly>
      <ElImage :src="baseUrlImg + p.images[0]" style="width: 6em; height: 6em; border: 1px solid #eee; border-radius: 4px"
        fit="cover" />
    </ClientOnly>
    <div px-4 style="width: 70%;">
      <h3 tracking-1px max-w-12em md:max-w-16em class="overflow-hidden truncate ...">
        {{ p.name }}
      </h3>
      <p color-red py-2>价格：￥{{ p.price }}</p>
      <small opacity-80 pr-4>浏览量：{{ p.views }}</small>
      <small opacity-80 float-right>销量：{{ p.sales }}</small>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
