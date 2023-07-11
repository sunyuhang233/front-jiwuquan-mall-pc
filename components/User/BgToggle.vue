<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
const bgList = ref<string[]>([
	"kiwi-bg-1.jpg",
	"kiwi-bg-2.jpg",
	"kiwi-bg-3.jpg",
	"kiwi-bg-4.jpg",
	"kiwi-bg-5.jpg",
]);
const bgUrl = useLocalStorage("jiwu_user_bg", "kiwi-bg-4.jpg");
</script>
<template>
	<div class="top-bg relative select-none">
		<!-- 切换按钮 -->
		<el-button
			size="small"
			class="absolute right-1em bottom-1.4em z-1"
			type="info"
			plain
			icon="MoreFilled"
			style="padding: 8px; background-color: rgba(97, 255, 163, 0.1); transition: 0.3s"
		/>
    <el-image  :src="BaseUrlImg + bgUrl" object-cover class="h-300px object-cover w-1/1">
    </el-image>
	</div>
</template>
<style scoped lang="scss"></style>
