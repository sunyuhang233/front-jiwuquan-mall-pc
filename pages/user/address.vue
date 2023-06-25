<script lang="ts" setup>
import { useAddresStore } from '~/composables/store/useAddress';
import { codeToText, regionData } from 'element-china-area-data';
import {
	addAddressByDTO,
	updateDefaultAddress,
	AddressInfoVO,
	deleteAddressById,
	AddressDTO,
	updateAddressById,
} from '~/composables/api/user/address';
const user = useUserStore();
const address = useAddresStore();
const regionDatas = ref(regionData);
address.resetRequestList(user.getToken);

const form = reactive<AddressDTO>({
	name: '',
	phone: '',
	province: '',
	city: '',
	county: '',
	address: '',
	isDefault: 0,
	postalCode: '',
});
// 对象
const addressRef = ref<FormInstance>();
const activeAddresId = ref<string>('');
// 功能
const isLoading = ref<boolean>(false);
const isLoadingAll = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const isUpdate = ref<boolean>(false);
const isShow = ref<boolean>(false);
// 地址
const selectAddress = ref<string[]>([]);
// 添加 | 修改
import type { FormInstance } from 'element-plus';
const onReqAddress = (formRef: FormInstance | undefined) => {
	formRef
		?.validate(async (valid: boolean) => {
			if (form.province === '' || form.city === '' || form.county === '') {
				return ElMessage.warning('地址不能为空！');
			}
			if (valid && user.getToken) {
				let data;
				// 更新
				if (isUpdate.value) {
					data = await updateAddressById(
						activeAddresId.value,
						{ ...form },
						user.getToken
					);
				} else {
					// 添加
					data = await addAddressByDTO({ ...form }, user.getToken);
				}
				let msg = isUpdate.value ? '更新' : '添加';
				if (data.code === StatusCode.SUCCESS) {
					ElMessage.success(msg + '成功！');
					if (isUpdate.value) {
						const flag = await address.resetRequestList(user.getToken);
					} else {
						const flag = await address.resetRequestList(user.getToken);
					}
				} else {
					ElMessage.error(msg + '失败，请稍后再试！');
				}

				isUpdate.value = false;
				isLoading.value = false;
				isShow.value = false;
			} else {
				ElMessage.closeAll();
				return false;
			}
		})
		.catch(() => {
			return false;
		});
};
// 监听选中
watch(selectAddress, (val) => {
	form.province = codeToText[val[0]];
	form.city = codeToText[val[1]];
	form.county = codeToText[val[2]];
	form.postalCode = val[2];
});

// 刷新
const refreshData = async () => {
	isLoadingAll.value = true;
	const res = await address.resetRequestList(user.getToken);
	if (res) {
		ElMessage.success('刷新成功！🎉');
	} else {
		ElMessage.error('刷新失败！😥');
	}
	setTimeout(() => {
		isLoadingAll.value = false;
	}, 400);
};

const showUpdate = (p: AddressInfoVO) => {
	isShow.value = true;
	isUpdate.value = true;
	form.name = p.name;
	form.phone = p.phone;
	form.isDefault = p.isDefault;
	form.province = p.province;
	form.city = p.city;
	form.county = p.county;
	form.postalCode = p.postalCode;
	form.address = p.address;
	// id
	activeAddresId.value = p.id;
};

const deleteAddress = async (id: string) => {
	ElMessageBox({
		title: '删除提示！',
		message: '确定要删除吗？',
		type: 'warning',
		showClose: false,
		center: true,
		customClass: 'text-center',
		showCancelButton: true,
		cancelButtonText: '取 消',
		confirmButtonText: '删 除',
	})
		.then(async (res) => {
			if (res === 'confirm') {
				const { code } = await deleteAddressById(id, user.getToken);
				if (code === StatusCode.SUCCESS) {
					for (let i = 0; i < address.addressList.length; i++) {
						if (address.addressList[i].id === id) {
							address.addressList.splice(i, 1);
							break;
						}
					}
					ElMessage.success('删除成功！');
				} else {
					ElMessage.error('删除错误，请稍后再试试看！');
				}
			}
		})
		.catch((err) => {});
};

const showAdd = () => {
	isShow.value = true;
	form.name = '';
	form.province = '';
	form.city = '';
	form.county = '';
	form.phone = '';
	form.isDefault = 0;
	isUpdate.value = false;
};

// 定义当前页面
useHead({
	title: '收货地址',
	meta: [
		{
			name: 'description',
			content: '极物圈-收货地址',
		},
		{
			name: 'isPermission',
			content: true,
		},
	],
});
// 规则
const rules = reactive({
	name: [
		{ required: true, message: '收货人不能为空！', trigger: 'blur' },
		{ min: 2, max: 10, message: '长度在2-10个字符！', trigger: 'change' },
	],
	address: [
		{ required: true, message: '收货人不能为空！', trigger: 'blur' },
		{ min: 3, max: 25, message: '长度在3-25个字符！', trigger: 'change' },
	],
	phone: [
		{ required: true, message: '手机号不能为空！', trigger: 'blur' },
		{
			pattern:
				/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
			message: '手机号格式不正确！',
			trigger: 'change',
		},
	],
	province: [{ required: true, message: '省份不能为空！', trigger: 'blur' }],
	city: [{ required: true, message: '城市不能为空！', trigger: 'blur' }],
	county: [{ required: true, message: '区县不能为空！', trigger: 'blur' }],
	isDefault: [{ required: true, message: '是否默认不能为空！', trigger: 'blur' }],
	postalCode: [{ required: true, message: '邮政编码不能为空！', trigger: 'blur' }],
});
</script>
<template>
	<NuxtLayout name="second" :footer="false">
		<ClientOnly>
			<div class="address-list" layout-default w-900px>
				<!-- 表单 -->
				<lazy-el-dialog
					style="width: 400px; padding: 0 20px"
					v-model="isShow"
					:show-close="true"
				>
					<!-- 登录 -->
					<el-form
						ref="addressRef"
						v-loading="isLoading"
						label-position="top"
						hide-required-asterisk
						:rules="rules"
						:model="form"
						@submit.prevent="onReqAddress"
						class="form animate__animated"
					>
						<h2 mb-5 tracking-0.2em>{{ isUpdate ? '修改地址' : '添加地址' }}</h2>
						<!-- 收货人 -->
						<el-form-item label="收货人" prop="name" class="animated pb-2">
							<el-input
								prefix-icon="user"
								v-model.trim="form.name"
								size="large"
								placeholder="请输入2-10字姓名"
							/>
						</el-form-item>
						<!-- 手机号 -->
						<el-form-item label="手机号" prop="phone" class="animated pb-2">
							<el-input
								prefix-icon="phone"
								v-model.trim="form.phone"
								size="large"
								placeholder="手机号"
							/>
						</el-form-item>
						<el-form-item required label="地址">
							<el-cascader
								style="width: 100%"
								size="large"
								:options="regionDatas"
								v-model="selectAddress"
							>
							</el-cascader>
						</el-form-item>
						<!-- 详细地址 -->
						<el-form-item label="详细地址" prop="address" class="animated pb-2">
							<el-input
								prefix-icon="location"
								v-model.trim="form.address"
								size="large"
								placeholder="详细地址"
							/>
						</el-form-item>
						<!-- 是否默认 -->
						<el-form-item prop="isDefault" class="animated" flex-row-c-c>
							<el-checkbox v-model="form.isDefault" label="是否默认" size="large" />
						</el-form-item>
						<!-- 是否默认 -->
						<el-form-item mt-1em>
							<el-button
								:type="isUpdate ? 'info' : 'primary'"
								flex-1
								size="large"
								class="button"
								@click="onReqAddress(addressRef)"
								>{{ isUpdate ? '更 新' : '添 加' }}
							</el-button>
						</el-form-item>
					</el-form>
				</lazy-el-dialog>

				<!-- 列表 -->
				<div
					v-loading="isLoadingAll"
					class="address"
					dark:bg-dark-5
					shadow
					border-default
					border-1px
					rounded-10px
					p-6
					mt-2em
				>
					<div class="top w-1/1" flex-row-bt-c>
						<h3 opacity-90 tracking-0.1em>收货地址</h3>
						<div>
							<i
								p-3
								i-solar:refresh-circle-line-duotone
								bg-green-5
								mr-4
								@click="refreshData"
							></i>
							<el-text select-none cursor-pointer @click="isEdit = true" type="info">
								管理
							</el-text>
						</div>
					</div>
					<!-- 列表 -->
					<div class="list" flex flex-wrap>
						<!-- 单项 -->
						<TransitionGroup tag="div" name="fade-list" class="flex flex-wrap relative">
							<!-- 添加按钮 -->
							<div
								:key="2030303"
								m-2
								select-none
								hover:scale-98
								cursor-pointer
								flex-row-c-c
								flex-col
								class="add"
								mt-4
								w-260px
								h-200px
								border-default-dashed
								border-3px
								rounded-8px
								transition-300
								hover:border="3px solid dark-4"
								dark:hover:border-gray-5
								group
								@click="showAdd"
							>
								<ElIconCirclePlusFilled
									class="w-4em h-4em opacity-40 group-hover:opacity-80"
								/>
								<p mt-1>添加新地址</p>
							</div>
							<!-- 地址项 -->
							<div
								m-2
								cursor-pointer
								transition-300
								mt-4
								w-260px
								relative
								h-200px
								border-default
								border-2px
								rounded-8px
								hover:border="solid dark-4"
								dark:hover:border-gray-5
								p-6
								rounded-6px
								my-4
								class="group"
								shadow-sm
								v-for="(p, i) in address.addressList"
								:key="p.id"
								opacity-90
								flex
								flex-col
								leading-1.3em
							>
								<div
									flex-row-c-c
									justify-start
									text-1.2em
									border-default-dashed
									border-0
									border-b-2px
									pb-1
								>
									{{ p.name }}

									<el-tag
										class="opacity-0 group-hover:opacity-90 ml-2"
										v-if="p.isDefault && p.isDefault === 1"
										plain
										>默认地址</el-tag
									>
								</div>
								<small pt-2>{{ p.phone }}</small>
								<div opacity-80 mt-1>
									<small pr-1>{{ p.province }}</small>
									<small pr-1>{{ p.city }}</small>
									<small pr-1>{{ p.county }}</small>
								</div>
								<small> {{ p.address }} 邮编:{{ p.postalCode }} </small>
								<div class="btns">
									<el-button
										type="info"
										absolute
										bottom-1.3em
										right-2em
										w-4em
										size="small"
										class="opacity-0 group-hover:opacity-90"
										@click="showUpdate(p)"
										plain
										>修改</el-button
									>
									<span
										absolute
										top-1.5em
										right-1.3em
										hover:bg-red-5
										hover:scale-110
										i-solar:trash-bin-minimalistic-bold-duotone
										p-3
										p-2
										dark:bg-light
										@click="deleteAddress(p.id)"
										transition-300
										opacity-0
										group-hover:opacity-80
									></span>
								</div>
							</div>
						</TransitionGroup>
					</div>
				</div>
			</div>
		</ClientOnly>
		<!-- https://www.npmjs.com/package/element-china-area-data -->
	</NuxtLayout>
</template>
<style scoped lang="scss">
:deep(.el-dialog__body) {
	padding: 10px;
}
</style>
