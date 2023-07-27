<script lang="ts" setup></script>
<template>
	<div>
		<NuxtLayout name="error">
			<ElEmpty>
				<div flex-row-c-c flex-col>
					<h3 mb-5>500, 服务器错误</h3>
					<el-button plain type="primary" @click="clearError({ redirect: '/' })">
						返回主页
					</el-button>
				</div>
			</ElEmpty>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
