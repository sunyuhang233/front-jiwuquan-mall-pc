<script lang="ts" setup>
import { getGoodsIsCollect, toggleGoodsCollectStatus } from '~/composables/api/goods/collect';
const { gid } = defineProps<{
	gid: string;
}>();
const user = useUserStore();

// 查询是否收藏
const isCollect = ref<boolean>(false);
if (user.token) {
	const { data } = await getGoodsIsCollect(gid || '', user.getToken);
	isCollect.value = Boolean(data);
}
// 收藏
const onCollectGoods = async () => {
	const { code, message } = await toggleGoodsCollectStatus(gid || '', user.getToken);
	if (code === StatusCode.SUCCESS) {
		ElMessage.success((isCollect.value ? '取消' : '添加') + '收藏成功');
		isCollect.value = !isCollect.value;
	} else {
		ElMessage.error(message);
	}
};
</script>
<template>
	<el-popconfirm
		style="text-align: center"
		confirm-button-type="danger"
		confirm-button-text="确认"
		cancel-button-text="取消"
		:title="isCollect ? '是否取消收藏?' : '是否添加收藏?'"
		@confirm="onCollectGoods"
	>
		<template #reference >
			<!-- 收藏 -->
			<div cursor-pointer > 
				<span
					class="collect"
					i-solar:stars-minimalistic-bold-duotone
					bg-yellow-5
					p-3
					v-show="isCollect" animate-zoom-in
				></span>
				<span
					class="collect"
					v-show="!isCollect" animate-zoom-in
					i-solar:stars-minimalistic-broken
					p-3
				></span>
			</div>
		</template>
	</el-popconfirm>
</template>
<style scoped lang="scss"></style>
