<template>
	<el-form
		v-loading="isLoading"
		label-position="top"
		hide-required-asterisk
		:rules="rules"
		:model="form"
		@submit.prevent="() => {}"
		ref="formRef"
		class="form"
	>
		<h2 mb-6 mt-4 text-center tracking-0.2em>
			{{ user.userInfo.isEmailVerified ? "更换" : "绑定" }}邮箱
		</h2>
		<el-form-item type="newEmail" label="" prop="newEmail" class="animated">
			<el-input
				prefix-icon="Iphone"
				v-model.trim="form.newEmail"
				@keyup.enter="getEmailCode"
				size="default"
				clearable
				type="email"
				placeholder="请输入新邮箱"
			>
				<template #append>
					<el-button
						type="primary"
						@click="getEmailCode"
						:disabled="emailCodeStorage > 0"
					>
						{{ emailCodeStorage > 0 ? `${emailCodeStorage}s后重新发送` : "获取验证码" }}
					</el-button>
				</template>
			</el-input>
		</el-form-item>

		<el-form-item type="number" label="" prop="code" class="animated">
			<el-input
				prefix-icon="message"
				v-model.trim="form.code"
				@keyup.enter="onUpdatePhone(formRef)"
				size="default"
				type="number"
				placeholder="请输入验证码"
			/>
		</el-form-item>

		<el-form-item mt-1em>
			<el-button
				type="primary"
				size="large"
				@keyup.enter="onUpdatePhone(formRef)"
				class="submit w-full"
				@click="onUpdatePhone(formRef)"
			>
				立即{{ user.userInfo.isEmailVerified ? "更换" : "绑定" }}
			</el-button>
		</el-form-item>
	</el-form>
</template>
<script lang="ts" setup>
import { FormInstance } from "vant";
import { getUpdateNewCode } from "~/composables/api/user/info";
const emits = defineEmits(["close"]);
const user = useUserStore();
const isLoading = ref<boolean>(false);
const emailCodeStorage = ref<number>(0);
const formRef = ref();
// 表单
const form = reactive({
	newEmail: user.userInfo.email || "",
	code: "",
});
const rules = reactive({
	newEmail: [
		{ required: true, message: "邮箱不能为空！", trigger: "blur" },
		{
			pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g,
			message: "邮箱格式不正确！",
			trigger: "change",
		},
	],
	code: [
		{
			required: true,
			message: "验证码6位组成！",
			trigger: "change",
		},
	],
});

/**
 * 修改邮箱
 * @param type
 */
const onUpdatePhone = async (formEl: FormInstance | undefined) => {
	if (!formEl || isLoading.value) return;
	// @ts-ignore
	await formEl.validate((valid) => {
		if (valid) {
			isLoading.value = true;
			ElMessageBox.confirm("是否确认修改?", "修改邮箱", {
				confirmButtonText: "确认修改",
				cancelButtonText: "取消",
			}).then((action) => {
				if (action === "confirm") {
					toUpdate();
				}
			});
		}
	});
};
const toUpdate = async () => {
	let res = await updateEmail({ newEmail: form.newEmail, code: form.code }, user.getToken);
	if (res.code === StatusCode.SUCCESS) {
		// 修改成功
		ElMessage.success({
			message: "修改邮箱成功！",
			duration: 2000,
		});
		user.userInfo.email = form.newEmail;
		emits("close");
		setTimeout(() => {
			isLoading.value = false;
		}, 300);
	} else {
		ElMessage.error(res.message || "修改失败，请稍后重试！");
	}
};
// 获取验证码
let timer: NodeJS.Timer | undefined;
const getEmailCode = async () => {
	if (emailCodeStorage.value > 0) return;
	if (!form.newEmail) return ElMessage.warning("新邮箱不能为空");
	if (!checkEmail(form.newEmail)) {
		return ElMessage.error("新邮箱格式不正确!");
	}
	if (user.userInfo.email === form.newEmail.trim()) {
		return ElMessage.error("新旧邮箱不能一致!");
	}
	// 1、请求
	const { code } = await getUpdateNewCode(form.newEmail, DeviceType.EMAIL, user.getToken);
	if (code === StatusCode.SUCCESS) {
		emailCodeStorage.value = 60;
		ElMessage.success("发送验证码成功！");
		timer = setInterval(() => {
			emailCodeStorage.value--;
			clearInterval(timer);
			timer = undefined;
		}, 1000);
	}
};
</script>
<style scoped lang="scss">
.form {
	width: 360px;
	display: block;
	padding: 1em 2em;
	background-color: #ffffff98;
	border-radius: var(--el-border-radius-base);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(109, 109, 109, 0.2);
	box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px;
	overflow: hidden;
	animation-delay: 0.1s;

	:deep(.el-input__wrapper) {
		padding: 0.3em 1em;
	}

	// 报错信息
	:deep(.el-form-item) {
		padding: 0.2em;

		.el-form-item__error {
			padding-top: 0.2em;
		}
	}
}

:deep(.el-button) {
	padding: 0.3em 1em;
}

.dark .form {
	background-color: #161616d8;
}

.animate__animated {
	animation-duration: 0.5s;
}

// label总体
:deep(.el-form-item) {
	margin-bottom: 14px;
}

// 切换登录
.toggle-login {
	position: relative;
	border-radius: var(--el-border-radius-base);
	backdrop-filter: blur(10px);
	background-color: #b3b3b32a;
	padding: 0.3em;
	display: flex;

	:deep(.el-button) {
		background-color: transparent;
		transition: 0.3s;
		padding: 0em 0.6em;
		border: none;
	}

	.active {
		transition: 0.3s;
		background-color: #ffffff;
		z-index: 1;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px;
		color: var(--el-text-color);
	}
}

.dark .active {
	background-color: var(--el-color-primary);
}

.submit {
	font-size: 1.2em;
	transition: 0.3s;
	cursor: pointer;

	:deep(.el-input__wrapper) {
		background-color: var(--el-color-danger);
		cursor: pointer;

		* {
			color: #fff;
			font-weight: 700;
			letter-spacing: 0.3em;
		}
	}
}

.dark .submit :deep(.el-input__wrapper) {
	background-color: var(--el-color-danger);
	cursor: pointer;
	color: #fff;
}
</style>
