<script lang="ts" setup>
import { UploadProps } from "element-plus";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import { updateInfoByDTO } from "@/composables/api/user/info";
const user = useUserStore();
const formData = new FormData();
// 表单
const avatarUrl = computed({
	get() {
		return user.userInfo.avatar;
	},
	set(val) {
		user.userInfo.avatar = val;
	},
});
const isLoading = ref<boolean>(false);
/**
 * 上传之前验证类型
 */
const imageTypeList = ref<string[]>(["image/png", "image/jpg", "image/jpeg", "image/svg"]);
const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
	isLoading.value = true;
	if (!imageTypeList.value.includes(rawFile.type)) {
		isLoading.value = false;
		ElMessage.error("文件格式不是图片格式!");
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {
		isLoading.value = false;
		ElMessage.error("头像需要小于2MB!");
		return false;
	}

	// check success
	formData.append("file", rawFile);
	return true;
};
/**
 * 更新
 */
const updateSucess: UploadProps["onSuccess"] = async (data, file) => {
	isLoading.value = false; // check success
	if (data.code === StatusCode.SUCCESS) {
		user.userInfo.avatar = data.data;
		avatarUrl.value = data.data || "";
		ElMessage.success("更换头像成功！");
	} else {
		ElMessage.error("更换头像失败！");
	}
};
// 更新用户基本信息
const userCopy = reactive({
	nickname: "",
	slogan: "",
});
// 是否开启slogan编辑
const isEditSlogan = ref<boolean>(false);

const submitUpdateUser = async (key: string) => {
	if (Object.keys(userCopy).includes(key)) {
		if (userCopy[key] === "") {
			return ElMessage.error("内容不能为空！");
		}

		let { data } = await updateInfoByDTO({
			
		},user.getToken);
	}
};
</script>
<template>
	<div>
		<div class="avatar shadow-md" v-loading="isLoading">
			<!-- 上传 -->
			<el-upload
				class="avatar-uploader"
				ref="uploader"
				drag
				:action="getBaseUrl() + '/user/info/avatar'"
				:headers="{ Authorization: user.token }"
				method="PUT"
				:limit="1"
				:multiple="false"
				:auto-upload="true"
				:show-file-list="false"
				list-type="picture"
				:before-upload="beforeUpload"
				:on-success="updateSucess"
			>
				<div class="flex-row-c-c relative group">
					<img
						v-if="avatarUrl"
						:src="BaseUrlImg + avatarUrl"
						class="avatar-mark group-hover:filter-blur-4 transition-300 p-0 object-cover w-6em h-6em overflow-hidden"
					/>
					<ElIconPlus size="2em" v-else />
					<i
						class="i-solar:camera-broken p-5 absolute opacity-0 group-hover:opacity-80 transition-300"
					></i>
				</div>
			</el-upload>
		</div>
		<div class="inline-flex text flex-col px-2">
			<h3 class="title" py-2 flex-row-c-c justify-start>
				{{ user.userInfo.nickname }}
			</h3>
			<!-- id -->
			<small opacity-80 class="group cursor-pointer" 2163652592439853323>
				ID：{{ user.userInfo.id }}
				<el-tooltip content="复制 ID" placement="bottom">
					<span
						class="mx-2 cursor-pointer group-hover:opacity-80 bg-blueGray hover:bg-[var(--el-color-success)] opacity-0 transition-300 p-2.6 i-solar:copy-broken"
					></span>
				</el-tooltip>
			</small>

			<!-- 个性签名 -->
			<div flex items-center mt-2>
				<el-input
					class="mr-2"
					style="width: 14em"
					v-model="userCopy.slogan"
					placeholder="展示你的个性签名吧~ ✨"
					@change="isEditSlogan = true"
				>
				</el-input>
				<el-button
					icon="Select"
					type="primary"
					@click="submitUpdateUser('slogan')"
					v-if="isEditSlogan"
				/>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
.avatar {
	width: 6em;
	height: 6em;
	border-radius: 50%;
	:deep(.el-upload) {
		width: 6em;
		height: 6em;
		border-radius: 50%;
		overflow: hidden;
		.el-upload-dragger {
			width: 6em;
			height: 6em;
			border-radius: 50%;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			border-width: 2px;
			transition: $transition-delay;
		}
	}
}
</style>
