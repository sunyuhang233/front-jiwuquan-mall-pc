<script lang="ts" setup>
const user = useUserStore() 
useAsyncData(async ()=>{

})
 
// 定义当前页面
useHead({
	title: '账户与安全',
	meta: [
		{
			name: 'description',
			content: '极物圈-账户与安全',
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
