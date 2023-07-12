<script lang="ts" setup>
import { UploadProps } from "element-plus";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
import { updateInfoByDTO, type UpdateInfo } from "@/composables/api/user/info";
import { Gender } from "~/types";
const user = useUserStore();
const route = useRoute();
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
 * 更新头像
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

const genderList = ref<string[]>(["男", "女", "保密"]);
// 用户基本信息
const userCopy = reactive<UpdateInfo>({
	nickname: user.userInfo.nickname,
	slogan: user.userInfo.slogan,
	gender: user.userInfo.gender || Gender.DEFAULT,
	birthday: user.userInfo.birthday || "",
});
// 是否开启slogan编辑
const isEditSlogan = ref<boolean>(false);
const isEditNickname = ref<boolean>(false);
/**
 * 更新用户基本信息
 * @param key dto key
 */
const submitUpdateUser = async (key: string) => {
	// 判空
	if (Object.keys(userCopy).includes(key)) {
		if (!JSON.parse(JSON.stringify(userCopy))[key]) {
			return ElMessage.error("内容不能为空！");
		}
		// 网络请求
		let { code, message } = await updateInfoByDTO(
			{
				gender: userCopy.gender || user.userInfo.gender,
				nickname: useCheckXXSText(userCopy.nickname || user.userInfo.nickname),
				birthday: userCopy.birthday || user.userInfo.birthday,
				slogan: useCheckXXSText(userCopy.slogan || user.userInfo.slogan),
			},
			user.getToken
		);
		if (code === StatusCode.SUCCESS) {
			ElMessage.success("修改成功！");
			user.$patch({
				userInfo: {
					...userCopy,
				},
			});
		} else {
			ElMessage.error(message || "修改失败，请稍后重试！");
		}
		// 关闭
		isEditNickname.value = false;
		isEditSlogan.value = false;
	}
};

/**
 * 邀请方法
 */
const showInvitation = () => {
	useAsyncCopyText(route.fullPath)
		.then(() => {
			ElMessage.success("链接已复制到剪切板！");
		})
		.catch(() => {
			ElMessage.error("链接分享失败！");
		});
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
					/>
				</div>
			</el-upload>
		</div>
		<div class="inline-flex items-start text flex-col px-2">
			<!-- nickname -->
			<TransitionGroup
				tag="h2"
				name="group-list"
				class="title min-h-2em group flex-row-c-c justify-start"
			>
				<div v-show="!isEditNickname" key="nickname1" class="group">
					<span @click="isEditNickname=true">{{ user.userInfo.nickname }}</span>
					<span
						@click="isEditNickname = true"
						class="ml-2 p-3 i-solar:ruler-cross-pen-bold-duotone cursor-pointer bg-bluegray group-hover:bg-[var(--el-color-success)]"
					></span>
					<el-button
						type="info"
						class="group-hover:opacity-100 opacity-0 ml-4em border-default"
						@click="showInvitation"
						>分 享</el-button
					>
				</div>
				<!-- 昵称 -->
				<div class="flex-row-c-c" key="nickname2" v-show="isEditNickname">
					<el-input
						class="mr-2"
						style="font-size: 0.9em; font-weight: 700"
						v-model.lazy="userCopy.nickname"
						placeholder="修改用户昵称"
						@focus="isEditNickname = true"
						@keyup.enter="submitUpdateUser('nickname')"
					>
					</el-input>
					<el-button
						style="padding:0 1.5em;"
						icon="Select"
						type="primary"
						@click="submitUpdateUser('nickname')"
					/>
					<el-button
						style="padding:0 1.5em;"
						icon="Close"
						plain
						type="primary"
						@click="isEditNickname = false"
					/>
				</div>
			</TransitionGroup>

			<!-- id -->
			<small class="group small-input opacity-60 cursor-pointer">
				ID：{{ user.userInfo.id }}
				<el-tooltip content="复制 ID" placement="bottom" popper-class="el-popper-init">
					<span
						v-copying="user.userInfo.id"
						class="mx-2 cursor-pointer bg-blueGray hover:bg-[var(--el-color-success)] transition-300 p-2 i-solar:copy-broken"
					></span>
				</el-tooltip>
			</small>
			<!-- 个性签名 -->
			<div class="mt-6 small-input flex items-center justify-start">
				<!-- <i i-solar:bookmark-outline p-1 mr-2></i> -->
				<small>签名：</small>
				<el-input
					class="mr-1"
					size="small"
					type="text"
					style="width: 14em"
					v-model.lazy="userCopy.slogan"
					placeholder="展示你的个性签名吧~ ✨"
					@keyup.enter="submitUpdateUser('slogan')"
					@focus="isEditSlogan = true"
				/>
				<transition name="fade">
					<el-button
						icon="Select"
						size="small"
						type="primary"
						@click="submitUpdateUser('slogan')"
						v-if="isEditSlogan"
					/>
				</transition>
			</div>
			<!-- 生日 -->
			<div class="mt-3 small-input flex-row-c-c justify-start">
				<!-- <i i-solar:calendar-date-broken p-1 mr-2></i> -->
				<small>生日：</small>
				<el-input
					type="date"
					v-model.lazy="userCopy.birthday"
					class="mr-1"
					size="small"
					style="width: 14em"
					@change="submitUpdateUser('birthday')"
				/>
			</div>
			<!-- 性别 -->
			<div class="mt-3 small-input flex-row-c-c justify-start">
				<!-- <i i-solar:adhesive-plaster-linear p-1 mr-2></i> -->
				<small>性别：</small>
				<el-select
					@change="submitUpdateUser('gender')"
					v-model="userCopy.gender"
					placeholder="Select"
					style="width: 10.5em"
					size="small"
				>
					<el-option v-for="item in genderList" :key="item" :label="item" :value="item" />
				</el-select>
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
.small-input :deep(.el-input__wrapper) {
	&.is-focus {
		box-shadow: 0 0 0 1px var(--el-input-foucs-border-color) inset;
	}
	box-shadow: none;
}

.el-popper-init {
	padding: 2px 4px;
}
</style>
