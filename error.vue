<script lang="ts" setup>
const route = useRoute();
</script>
<template>
	<div>
		<NuxtLayout name="error">
			<ElEmpty>
				<div flex-row-c-c flex-col>
					<h3 mb-5>500, 服务器错误</h3>
					<NuxtLink :to="route.redirectedFrom">
						<el-button plain type="primary"> 返回 </el-button>
					</NuxtLink>
				</div>
			</ElEmpty>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
