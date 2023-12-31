<script lang="ts" setup>
import type { UploadProps } from "element-plus";
import { type UpdateInfo, updateInfoByDTO } from "@/composables/api/user/info";
import { Gender } from "~/types";

const user = useUserStore();
const formData = new FormData();
// 表单
const avatatRef = ref();
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
  }
  else if (rawFile.size / 1024 / 1024 > 2) {
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
  avatatRef.value?.clearFiles();
  if (data.code === StatusCode.SUCCESS) {
    user.userInfo.avatar = data.data;
    avatarUrl.value = data.data || "";
    ElMessage.success("更换头像成功！");
  }
  else {
    ElMessage.error(data.message);
  }
};

const genderList = ref<string[]>(["男", "女", "保密"]);
// 用户基本信息
const userCopy = reactive<UpdateInfo>({
  nickname: user.userInfo.nickname,
  slogan: user.userInfo.slogan,
  gender: user.userInfo.gender || Gender.DEFAULT,
  birthday: user.userInfo.birthday,
});
// 是否开启slogan编辑
const isEditSlogan = ref<boolean>(false);
const isEditNickname = ref<boolean>(false);
/**
 * 更新用户基本信息
 * @param key dto key
 */
async function submitUpdateUser(key: string) {
  // 判空
  if (Object.keys(userCopy).includes(key)) {
    if (!JSON.parse(JSON.stringify(userCopy))[key])
      return ElMessage.error("内容不能为空！");

    // 网络请求
    const { code, message } = await updateInfoByDTO(
      {
        gender: userCopy.gender || user.userInfo.gender,
        nickname: useCheckXXSText(userCopy.nickname || user.userInfo.nickname),
        birthday: userCopy.birthday || user.userInfo.birthday,
        slogan: useCheckXXSText(userCopy.slogan || user.userInfo.slogan),
      },
      user.getToken,
    );
    if (code === StatusCode.SUCCESS) {
      ElMessage.success("修改成功！");
      user.$patch({
        userInfo: {
          ...userCopy,
        },
      });
    }
    else {
      ElMessage.error(message || "修改失败，请稍后重试！");
    }
    // 关闭
    isEditNickname.value = false;
    isEditSlogan.value = false;
  }
}

/**
 * 邀请方法
 */
function showInvitation() {
  useAsyncCopyText(`${document.URL}?id=${user.userInfo.id}`)
    .then(() => {
      ElMessage.success("链接已复制到剪切板！");
    })
    .catch(() => {
      ElMessage.error("链接分享失败！");
    });
}
</script>

<template>
  <div>
    <div
      v-loading="isLoading"
      class="avatar shadow-md"
    >
      <!-- 上传 -->
      <el-upload
        ref="avatatRef"
        class="avatar-uploader"
        drag
        :action="`${BaseUrl}/user/info/avatar`"
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
        <div class="group relative flex-row-c-c">
          <img
            v-if="avatarUrl"
            alt="Design By Kiwi23333"
            :src="BaseUrlImg + avatarUrl"
            class="avatar-mark h-6em w-6em overflow-hidden object-cover p-0 transition-300 group-hover:filter-blur-4"
          >
          <ElIconPlus
            v-else
            size="2em"
          />
          <i
            class="i-solar:camera-broken absolute p-5 opacity-0 transition-300 group-hover:opacity-80"
          />
        </div>
      </el-upload>
    </div>
    <div class="text inline-flex flex-col items-start px-2">
      <!-- nickname -->
      <transition-group
        tag="h2"
        leave-active-class="animate-[fade-out_0.4s_ease-in] absolute"
        appear-active-class="animate-[fade-in_0.4s_ease-in] absolute"
        class="title group relative min-h-2em flex-row-c-c justify-start"
      >
        <div
          v-show="!isEditNickname"
          key="nickname1"
          class="group"
        >
          <span @click="isEditNickname = true">{{ user.userInfo.nickname }}</span>
          <span
            class="i-solar:ruler-cross-pen-bold-duotone ml-2 cursor-pointer bg-bluegray p-3 group-hover:bg-[var(--el-color-success)]"
            @click="isEditNickname = true"
          />
          <el-button
            type="info"
            class="ml-4em opacity-0 border-default group-hover:opacity-100"
            @click="showInvitation"
          >
            分 享
          </el-button>
        </div>
        <!-- 昵称 -->
        <div
          v-show="isEditNickname"
          key="nickname2"
          class="flex-row-c-c"
        >
          <el-input
            v-model.lazy="userCopy.nickname"
            class="mr-2"
            style="font-size: 0.9em; font-weight: 700"
            placeholder="修改用户昵称"
            @focus="isEditNickname = true"
            @keyup.enter="submitUpdateUser('nickname')"
          />
          <el-button
            style="padding: 0 1.5em"
            icon="Select"
            type="primary"
            @click="submitUpdateUser('nickname')"
          />
          <el-button
            style="padding: 0 1.5em"
            icon="Close"
            plain
            type="primary"
            @click="isEditNickname = false"
          />
        </div>
      </transition-group>

      <!-- id -->
      <small class="group small-input cursor-pointer opacity-60">
        ID：{{ user.userInfo.id }}
        <el-tooltip
          content="复制 ID"
          placement="bottom"
          popper-class="el-popper-init"
        >
          <span
            v-copying.toast="user.userInfo.id"
            class="i-solar:copy-broken mx-2 cursor-pointer bg-blueGray p-2 transition-300 hover:bg-[var(--el-color-success)]"
          />
        </el-tooltip>
      </small>
      <!-- 个性签名 -->
      <div class="small-input mt-6 flex items-center justify-start">
        <!-- <i i-solar:bookmark-outline p-1 mr-2></i> -->
        <small>签名：</small>
        <el-input
          v-model.lazy="userCopy.slogan"
          class="mr-1"
          size="small"
          type="text"
          style="width: 14em"
          placeholder="展示你的个性签名吧~ ✨"
          @keyup.enter="submitUpdateUser('slogan')"
          @focus="isEditSlogan = true"
        />
        <transition name="fade">
          <el-button
            v-if="isEditSlogan"
            icon="Select"
            size="small"
            type="primary"
            @click="submitUpdateUser('slogan')"
          />
        </transition>
      </div>
      <!-- 生日 -->
      <div class="small-input mt-3 flex-row-c-c justify-start">
        <!-- <i i-solar:calendar-date-broken p-1 mr-2></i> -->
        <small>生日：</small>
        <el-input
          v-model.lazy="userCopy.birthday"
          type="date"
          class="mr-1"
          size="small"
          style="width: 14em"
          @change="submitUpdateUser('birthday')"
        />
      </div>
      <!-- 性别 -->
      <div class="small-input mt-3 flex-row-c-c justify-start">
        <!-- <i i-solar:adhesive-plaster-linear p-1 mr-2></i> -->
        <small>性别：</small>
        <el-select
          v-model="userCopy.gender"
          placeholder="Select"
          style="width: 10.5em"
          size="small"
          @change="submitUpdateUser('gender')"
        >
          <el-option
            v-for="item in genderList"
            :key="item"
            :label="item"
            :value="item"
          />
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
