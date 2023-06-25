<script lang="ts" setup>
const user = useUserStore()




useAsyncData(async ()=>{

})
 
// 定义当前页面
useHead({
	title: '极物钱包',
	meta: [
		{
			name: 'description',
			content: '极物圈-极物钱包',
		},
		{
			name: 'isPermission',
		},
	],
});
</script>
<template>
	<NuxtLayout name="second">
	</NuxtLayout>
</template>
<style scoped lang="scss"></style>
