<script lang="ts" setup>
const user = useUserStore()
useAsyncData(async ()=>{

})
 
// 定义当前页面
useHead({
	title: '个人主页',
	meta: [
		{
			name: 'description',
			content: '极物圈-个人主页',
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
