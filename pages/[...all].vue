<script lang="ts" setup></script>

<template>
	<div class="error-page">
		<MenuHeaderMenu />
		<div mx-a flex-row-c-c>
			<ElEmpty>
				<div flex-row-c-c flex-col>
					<h3 mb-5>404, 页面找不到</h3>
					<ElButton plain type="primary" @click="useRouter().back()"> 返回 </ElButton>
				</div>
			</ElEmpty>
		</div>
	</div>
</template>

<style scoped lang="scss"></style>
