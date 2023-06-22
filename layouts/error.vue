<script lang="ts" setup></script>
<template>
	<div flex-row-c-c>
		<ElEmpty>
			<div flex-row-c-c>
				<h3 mb-5>404 页面找不到！</h3>
				<ElButton @click="useRouter().back()" plain type="primary"> 返回 </ElButton>
			</div>
		</ElEmpty>
	</div>
</template>
<style scoped lang="scss"></style>
