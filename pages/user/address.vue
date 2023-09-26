<script lang="ts" setup>
import { codeToText, regionData } from "element-china-area-data";
import type { FormInstance } from "element-plus";
import { appName } from "@/constants";
import type {
  AddressDTO,
  AddressInfoVO,
} from "~/composables/api/user/address";
import {
  addAddressByDTO,
  deleteAddressById,
  deleteBatchAddressByIds,
  updateAddressById,
} from "~/composables/api/user/address";


// 添加 | 修改
useHead({
  title: `收货地址 - 个人中心 - ${appName}`,
  meta: [
    {
      name: "description",
      content: `收货地址 - 个人中心 - ${appName}`,
    },
  ],
});
const user = useUserStore();
const address = useAddressStore();
address.resetRequestList(user.getToken);

const form = reactive<AddressDTO>({
  name: "",
  phone: "",
  province: "",
  city: "",
  county: "",
  address: "",
  isDefault: 0,
  postalCode: "",
});
// 对象
const addressRef = ref<FormInstance>();
const activeAddresId = ref<string>("");
// 功能
const isLoading = ref<boolean>(false);
const isLoadingAll = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const isUpdate = ref<boolean>(false);
const isShow = ref<boolean>(false);
const selectAll = ref<boolean>(false);
// 地址
const regionDatas = ref(regionData);
const selectAddressOption = ref<string[]>([]);
const selectAddress = ref<string[]>([]);

function onReqAddress(formRef: FormInstance | undefined) {
  formRef
    ?.validate(async (valid: boolean) => {
      if (form.province === "" || form.city === "" || form.county === "")
        return ElMessage.warning("地址不能为空！");

      if (valid && user.getToken) {
        let data;
        // 更新
        if (isUpdate.value) {
          data = await updateAddressById(activeAddresId.value, { ...form }, user.getToken);
        }
        else {
          // 添加
          data = await addAddressByDTO({ ...form }, user.getToken);
        }
        const msg = isUpdate.value ? "更新" : "添加";
        if (data.code === StatusCode.SUCCESS) {
          ElMessage.success(`${msg}成功！`);
          if (isUpdate.value)
            await address.resetRequestList(user.getToken);

          else
            await address.resetRequestList(user.getToken);
        }
        else {
          ElMessage.error(`${msg}失败，请稍后再试！`);
        }

        isUpdate.value = false;
        isLoading.value = false;
        isShow.value = false;
      }
      else {
        ElMessage.closeAll();
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}
// 监听选中
watch(selectAddressOption, (val) => {
  form.province = codeToText[val[0]];
  form.city = codeToText[val[1]];
  form.county = codeToText[val[2]];
  form.postalCode = val[2];
});

watch(selectAll, (val) => {
  selectAddress.value.splice(0);
  if (val)
    selectAddress.value.push(...address.addressList.map(p => p.id));
});

// 刷新
async function refreshData() {
  isLoadingAll.value = true;
  const res = await address.resetRequestList(user.getToken);
  if (res)
    ElMessage.success("刷新成功！🎉");
  else
    ElMessage.error("刷新失败！😥");

  setTimeout(() => {
    isLoadingAll.value = false;
  }, 400);
}

function showUpdate(p: AddressInfoVO) {
  isShow.value = true;
  isUpdate.value = true;
  form.name = p.name;
  form.phone = p.phone;
  form.isDefault = Boolean(p.isDefault);
  form.province = p.province;
  form.city = p.city;
  form.county = p.county;
  form.postalCode = p.postalCode;
  form.address = p.address;
  // id
  activeAddresId.value = p.id;
}
// 删除单个地址
async function deleteAddress(id: string) {
  ElMessageBox({
    title: "删除提示",
    message: "确定要删除吗？",
    type: "warning",
    showClose: false,
    customClass: "text-center",
    showCancelButton: true,
    cancelButtonText: "取 消",
    confirmButtonText: "删 除",
  })
    .then(async (res) => {
      if (res === "confirm") {
        const { code } = await deleteAddressById(id, user.getToken);
        if (code === StatusCode.SUCCESS) {
          for (let i = 0; i < address.addressList.length; i++) {
            if (address.addressList[i].id === id) {
              address.addressList.splice(i, 1);
              break;
            }
          }
          ElMessage.success("删除成功！");
        }
        else {
          ElMessage.error("删除错误，请稍后再试试看！");
        }
      }
    })
    .catch();
}
// 删除地址
async function deleteAddressByIds() {
  ElMessageBox.confirm(`是否删除选中${selectAddress.value.length}条?`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async (e) => {
      if (e === "confirm") {
        const { code } = await deleteBatchAddressByIds([...selectAddress.value], user.getToken);

        ElMessage.closeAll();
        if (code === StatusCode.SUCCESS) {
          for (let i = 0; i < address.addressList.length; i++) {
            if (selectAddress.value.includes(address.addressList[i].id)) {
              address.addressList.splice(i, 1);
              break;
            }
          }
          ElMessage.success("删除成功！");
        }
        else {
          ElMessage.error("删除失败！");
        }
      }
    })
    .catch(() => {});
}
function showAdd() {
  isShow.value = true;
  form.name = "";
  form.province = "";
  form.city = "";
  form.county = "";
  form.phone = "";
  form.isDefault = 0;
  isUpdate.value = false;
}

// 规则
const rules = reactive({
  name: [
    { required: true, message: "收货人不能为空！", trigger: "blur" },
    { min: 2, max: 10, message: "长度在2-10个字符！", trigger: "change" },
  ],
  address: [
    { required: true, message: "收货人不能为空！", trigger: "blur" },
    { min: 3, max: 25, message: "长度在3-25个字符！", trigger: "change" },
  ],
  phone: [
    { required: true, message: "手机号不能为空！", trigger: "blur" },
    {
      pattern:
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
      message: "手机号格式不正确！",
      trigger: "change",
    },
  ],
  province: [{ required: true, message: "省份不能为空！", trigger: "blur" }],
  city: [{ required: true, message: "城市不能为空！", trigger: "blur" }],
  county: [{ required: true, message: "区县不能为空！", trigger: "blur" }],
  isDefault: [{ required: true, message: "是否默认不能为空！", trigger: "blur" }],
  postalCode: [{ required: true, message: "邮政编码不能为空！", trigger: "blur" }],
});

definePageMeta({
  key: route => route.path,
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout
      name="user"
      :menu="['back']"
      :footer="false"
    >
      <div class="mx-a layout-default">
        <div
          class="animate__animated animate__fadeInDown flex-row-bt-c"
          my-3
        >
          <h2 tracking-1>
            收货地址
          </h2>
          <div class="ml-a flex cursor-pointer items-center justify-end">
            <i
              class="i-solar:refresh-circle-line-duotone mr-4 inline-block bg-green-5 p-3 transition-300 hover:rotate-180 hover:scale-120 hover:text-[var(--el-color-success)]"
              @click="refreshData"
            />
            <el-text
              plain
              class="cursor-pointer select-none transition-300 hover:text-[var(--el-color-success)]"
              :type="isEdit ? 'danger' : 'info'"
              @click="isEdit = !isEdit"
            >
              {{ isEdit ? "取消" : "管理" }}
            </el-text>
          </div>
        </div>
        <ClientOnly>
          <div
            v-if="user.isLogin"
            class="v-card animate-[fade-in_.6s_ease] rounded-12px p-6 border-default"
            @keyup.esc="isEdit = false"
          >
            <!-- 表单弹窗 -->
            <Teleport to="body">
              <lazy-el-dialog
                v-model="isShow"
                style="width: 400px; padding: 0 20px"
                :show-close="true"
              >
                <el-form
                  ref="addressRef"
                  v-loading.fullscreen="isLoading"
                  label-position="top"
                  hide-required-asterisk
                  :rules="rules"
                  :model="form"
                  class="animate__animated form"
                  @submit.prevent="onReqAddress"
                >
                  <h2
                    mb-5
                    tracking-0.2em
                  >
                    {{ isUpdate ? "修改地址" : "添加地址" }}
                  </h2>
                  <!-- 收货人 -->
                  <el-form-item
                    label="收货人"
                    prop="name"
                    class="animated pb-2"
                  >
                    <el-input
                      v-model.trim="form.name"
                      prefix-icon="user"
                      size="large"
                      placeholder="请输入2-10字姓名"
                    />
                  </el-form-item>
                  <!-- 手机号 -->
                  <el-form-item
                    label="手机号"
                    prop="phone"
                    class="animated pb-2"
                  >
                    <el-input
                      v-model.trim="form.phone"
                      prefix-icon="phone"
                      size="large"
                      placeholder="手机号"
                    />
                  </el-form-item>
                  <el-form-item
                    required
                    label="地址"
                  >
                    <el-cascader
                      v-model="selectAddressOption"
                      style="width: 100%"
                      size="large"
                      :placeholder="
                        form.province
                          ? `${form.province} / ${form.city} / ${form.county}`
                          : '选择地址'
                      "
                      :options="regionDatas"
                    />
                  </el-form-item>
                  <!-- 详细地址 -->
                  <el-form-item
                    label="详细地址"
                    prop="address"
                    class="animated pb-2"
                  >
                    <el-input
                      v-model.trim="form.address"
                      prefix-icon="location"
                      size="large"
                      placeholder="详细地址"
                    />
                  </el-form-item>
                  <!-- 是否默认 -->
                  <el-form-item
                    prop="isDefault"
                    class="animated"
                    flex-row-c-c
                  >
                    <el-checkbox
                      v-model="form.isDefault"
                      label="是否默认"
                      size="large"
                    />
                  </el-form-item>
                  <!-- 是否默认 -->
                  <el-form-item mt-1em>
                    <el-button
                      :type="isUpdate ? 'info' : 'primary'"
                      flex-1
                      size="large"
                      class="button"
                      @click="onReqAddress(addressRef)"
                    >
                      {{ isUpdate ? "更 新" : "添 加" }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </lazy-el-dialog>
            </Teleport>
            <!-- 列表 -->
            <div
              v-loading.fullscreen="isLoadingAll"
              class="address"
            >
              <ElDivider />
              <!-- 列表 -->
              <ClientOnly
                fallback-tag="div"
                class="list"
              >
                <!-- 单项 -->
                <el-checkbox-group v-model="selectAddress">
                  <div
                    v-auto-animate="{
                      duration: 300,
                      easing: 'cubic-bezier(0.61, 0.225, 0.195, 1.3)',
                    }"
                    class="relative"
                    grid="~ cols-2 md:cols-5 gap-4 md:gap-4 "
                  >
                    <!-- 添加按钮 -->
                    <div
                      :key="2030303"
                      min-h-180px
                      class="group add flex-row-c-c flex-col cursor-pointer select-none border-2px rounded-8px transition-300 hover:scale-98 border-default-dashed"
                      hover:border=" solid dark-4"
                      dark:hover:border-gray-5
                      @click="showAdd"
                    >
                      <ElIconCirclePlusFilled
                        text-dark-2
                        class="h-4rem w-4rem opacity-20 transition-300 group-hover:opacity-80"
                      />
                      <p


                        mt-2 opacity-20 transition-300 group-hover:opacity-80
                      >
                        添加新地址
                      </p>
                    </div>
                    <!-- 地址项列表 -->
                    <CardAddressBox
                      v-for="p in address?.addressList"
                      :key="p.id"
                      :address="p"
                      class="min-h-180px p-6"
                    >
                      <template #btns>
                        <div
                          v-show="isEdit"
                          class="flex-row-c-c"
                        >
                          <el-checkbox
                            w-4em
                            :label="p.id"
                          />
                          <small class="opacity-80 -ml-2.6em">选中</small>
                        </div>
                        <el-button
                          type="info"
                          size="small"
                          class="mx-2 ml-a opacity-100 md:opacity-0 md:group-hover:opacity-90"
                          plain
                          @click="showUpdate(p)"
                        >
                          修改
                        </el-button>
                        <span
                          class="i-solar:trash-bin-minimalistic-bold-duotone p-2 p-3 opacity-100 transition-300 hover:scale-110 dark:bg-light hover:bg-red-6 md:opacity-0 md:group-hover:opacity-80"
                          @click="deleteAddress(p.id)"
                        />
                      </template>
                    </CardAddressBox>
                  </div>
                </el-checkbox-group>
              </ClientOnly>
            </div>
            <!-- 按钮 -->
            <transition name="popup">
              <div
                v-show="isEdit"
                class="fixed bottom-1em z-20 mx-a mt-4 w-70vw flex-row-bt-c border-1px rounded-t-10px bg-light-1 p-4 shadow border-default dark:bg-dark-5 dark:bg-dark-6"
              >
                <el-checkbox
                  v-model="selectAll"
                  label="全选"
                />
                <el-button
                  type="danger"
                  size="large"
                  class="shadow-md border-default-dashed"
                  :loading="isLoading"
                  @click="selectAddress.length ? deleteAddressByIds() : ''"
                >
                  删除选中
                </el-button>
              </div>
            </transition>
          </div>
        </ClientOnly>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding: 10px;
}
:deep(.el-checkbox-group) {
  font-size: 100%;
  line-height: 100%;
  .el-checkbox__label {
    display: none;
  }

  .el-checkbox__inner {
    border-radius: 4px;
    transform: scale(1.1);
  }
}

:deep(.el-checkbox__inner) {
  border-radius: 4px;
  transform: scale(1.1);
}
</style>
