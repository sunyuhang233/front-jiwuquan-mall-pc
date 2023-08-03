<script lang="ts" setup>
import { type OrderInfoVO } from "~/composables/api/orders";
const { order } = defineProps<{
	order: OrderInfoVO;
}>();
</script>
<template>
	<div>{{ order.id }}</div>
</template>
<style scoped lang="scss"></style>
