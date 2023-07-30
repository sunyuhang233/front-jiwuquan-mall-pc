<script lang="ts" setup>
import { AddressInfoVO } from "~/composables/api/user/address";
const { address } = defineProps<{
	address: AddressInfoVO;
}>();
</script>
<template>
	<div
		cursor-pointer
		transition-300
		mr-3
		mt-2
		w-260px
		min-h-160px
		p-3.4
		relative
		border-default
		border-2px
		rounded-8px
		rounded-6px
		opacity-90
		flex
		flex-col
		leading-1.2em
		class="group hover:border-[var(--el-color-primary)] dark:hover:border-[var(--el-color-primary)]"
		:key="address.id"
	>
		<div flex-row-c-c justify-start font-600 border-0 border-default-dashed border-b-2px pb-2>
			<p>{{ address.name }}</p>
			<el-tag class="ml-a" v-if="address.isDefault && address.isDefault === 1" plain
				>默认地址</el-tag
			>
		</div>
		<small pt-2>{{ address.phone }}</small>
		<div opacity-80 mt-1>
			<small pr-1>{{ address.province }}</small>
			<small pr-1>{{ address.city }}</small>
			<small pr-1>{{ address.county }}</small>
		</div>
		<small class="truncate">{{ address.address }}</small>
		<div class="btns flex-row-bt-c w-1/1 mt-a">
			<slot name="btns"></slot>
		</div>
	</div>
</template>
<style scoped lang="scss"></style>
