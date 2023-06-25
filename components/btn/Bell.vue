<script lang="ts" setup>
const noticeTip = ref<number>(0);
</script>
<template>
	<el-popover trigger="click" >
		<template #reference>
			<el-badge :value="noticeTip > 0 ? noticeTip : ''" cursor-pointer hover:animate-swing>
				<i p-3  mx-1 i-solar:bell-outline w-1.4em h-1.4em > </i>
			</el-badge>
		</template>
    <template #default>
    <small text-center class="w-1/1">暂无消息</small>
    </template>
	</el-popover>
</template>
<style scoped lang="scss"></style>
