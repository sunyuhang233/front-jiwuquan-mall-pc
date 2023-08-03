<script lang="ts" setup>
const { address } = defineProps<{
	address: {
		name: string;
		phone: string;
		address: string;
		city: string;
		county: string;
		postalCode: string;
		province: string;
	};
}>();
</script>
<template>
	<div class="flex flex-col">
		<!-- <h4 mb-2>
			收货地址
			<ElDivider style="margin: 0.7rem 0" opacity-40 />
		</h4> -->
		<div class="flex flex-wrap items-center px-2 leading-1.6em">
			<i
				class="i-solar:map-point-bold-duotone p-5 mx-3 bg-[var(--el-color-danger-light-3)]"
			/>
			<div class="flex p-3 flex-col">
				<strong>
					{{ address.name }}
					<small font-500 opacity-80>{{ address.phone }}</small>
				</strong>
				<small>
					{{ address.province }} {{ address.city }}
					{{ address.county }}
				</small>
				<small text-0.6em>
					{{ address.address }}
					{{ address.postalCode }}
				</small>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss"></style>
