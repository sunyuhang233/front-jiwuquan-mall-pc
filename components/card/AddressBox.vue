<script lang="ts" setup>
import { AddressInfoVO } from "~/composables/api/user/address";
const { address } = defineProps<{
	address: AddressInfoVO;
}>();
</script>
<template>
	<div
		m-2
		cursor-pointer
		transition-300
		mt-4
		w-265px
		relative
		h-210px
		border-default
		border-2px
		rounded-8px
		hover:border="solid dark-4"
		dark:hover:border-gray-5
		p-6
		rounded-6px
		my-4
		class="group"
		shadow-sm
		:key="address.id"
		opacity-90
		flex
		flex-col
		leading-1.3em
	>
		<div flex-row-c-c justify-start text-1.2em border-0 border-default-dashed border-b-2px pb-2>
			<p>{{ address.name }}</p>
			<el-tag class="ml-a mr-6" v-if="address.isDefault && address.isDefault === 1" plain
				>默认地址</el-tag
			>
		</div>
		<small pt-2>{{ address.phone }}</small>
		<div opacity-80 mt-1>
			<small pr-1>{{ address.province }}</small>
			<small pr-1>{{ address.city }}</small>
			<small pr-1>{{ address.county }}</small>
		</div>
		<small>{{ address.address }}</small>
		<small> 邮编:{{ address.postalCode }}</small>
		<div class="btns flex-row-bt-c w-1/1 mt-2">
			<slot name="btns"></slot>
		</div>
	</div>
</template>
<style scoped lang="scss"></style>
