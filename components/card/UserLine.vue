<script lang="ts" setup>
import { UploadProps } from "element-plus";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";
const props = defineProps({
  userInfo: {
    type: Object,
    required: false,
  },
});
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

/**
 * 上传之前验证类型
 */
const imageTypeList = ref<string[]>(["image/png", "image/jpg", "image/jpeg", "image/svg"]);
const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (!imageTypeList.value.includes(rawFile.type)) {
    ElMessage.error("文件格式不是图片格式!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
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
  if (data.code === StatusCode.SUCCESS) {
    user.userInfo.avatar = data.data;
    avatarUrl.value = data.data || "";
    ElMessage.success("更换头像成功！");
  } else {
    ElMessage.error("更换头像失败！");
  }
};
// 退出登录
const exitLogin = () => {
  ElMessageBox.confirm("是否确认退出登录？", "退出登录", {
    confirmButtonText: "确认退出",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then((e) => {
      // 退出登录
      user.onUserExit(user.token);
      user?.$reset();
      useOrderStore()?.$reset();
      useShopStore()?.$reset();
      ElMessage.success("退出成功！");
    })
    .catch(() => {});
};

const menuList = ref([
  {
    name: "我的收藏",
    path: "/user/collect",
    className: "bg-yellow-5 i-solar:star-bold-duotone  group-hover:animate-[jello_1s_ease]",
  },
  {
    name: "钱 包",
    path: "/user/wallet",
    className:
      "bg-red-5 i-solar:wallet-bold-duotone  group-hover:animate-[rubberBand_1s_ease-in-out_1]",
  },
  {
    name: "购物车",
    path: "/user/shopcart",
    className:
      "bg-red-5 i-solar:cart-large-2-bold-duotone group-hover:animate-[shopcart_1s_ease-out]",
  },
  {
    name: "收货地址",
    path: "/user/address",
    className: "bg-lime-5 i-solar:compass-bold-duotone group-hover:animate-spin",
  },
  {
    name: "账 单",
    path: "/user/wallet",
    className:
      "bg-yellow-5  i-solar:bill-list-bold-duotone group-hover:animate-[tada_1s_ease-in-out_1]",
  },
  {
    name: "订 单",
    path: "/order/list",
    className: "bg-yellow-5 i-solar:clipboard-bold-duotone group-hover:animate-[swing_1s_ease_1]",
  },
  {
    name: "账户安全",
    path: "/user/safe",
    className: "bg-green-5 i-solar:danger-bold-duotone group-hover:rotate-360",
  },
]);
</script>
<template>
  <div
    class="user-card"
    flex-row-c-c
    cursor-pointer
  >
    <ClientOnly>
      <!-- 头像弹窗 -->
      <el-popover
        transition="fade"
        :teleported="false"
        style="transform-origin: right top"
        placement="bottom"
        :offset="20"
        :width="320"
        trigger="hover"
      >
        <template #reference>
          <div flex-row-c-c>
            <!-- 替换头像 -->
            <el-badge
              :is-dot="!user.userInfo.avatar || user.userInfo.avatar === 'default.png'"
              class="item mr-2 border-default rounded-10em"
            >
              <el-avatar
                :src="
                  !user.userInfo.avatar || user.userInfo.avatar === 'default.png'
                    ? ''
                    : BaseUrlImg + user.userInfo.avatar
                "
                class="hovers border-default"
              >
                <span
                  i-solar:user-bold
                  style="width: 60%; height: 60%"
                ></span>
              </el-avatar>
            </el-badge>
            <div
              pl-2
              class="hidden md:block"
            >
              <h4
                tracking-1px
                w-7em
                class="overflow-hidden truncate ..."
              >
                {{ user.userInfo.nickname }}
              </h4>
              <small
                opacity-80
                v-copying.toast="user.userInfo.id"
                class="group p-0 hover:underline decoration-dashed overflow-hidden truncate ..."
              >
                ID:{{ user.userInfo.id }}
                <span
                  class="p2 group-hover:opacity-80 opacity-0 transition-300"
                  i-solar:copy-bold-duotone
                ></span>
              </small>
            </div>
          </div>
        </template>
        <!-- 卡片 -->
        <template #default>
          <div
            class="top"
            p-10
          ></div>
          <div class="popup">
            <!-- 上传 -->
            <el-upload
              class="avatar-uploader"
              ref="uploader"
              style="width: 100%; height: 100%; border-radius: 50%"
              drag
              :action="getBaseUrl + '/user/info/avatar'"
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
              <img
                w-6em
                h-6em
                v-if="avatarUrl"
                :src="BaseUrlImg + avatarUrl"
                :alt="user.userInfo.nickname"
                class="avatar"
              />
              <ElIconPlus
                size="2em"
                v-else
              />
            </el-upload>
            <div
              class="bottom"
              flex-col
            >
              <h3
                class="title"
                py-1
              >
                {{ user.userInfo.nickname }}
              </h3>
              <!-- 卡片集合 -->
              <div
                mb-2
                grid
                grid-cols-3
                grid-gap-2
                justify-around
              >
                <NuxtLink
                  v-for="p in menuList"
                  :key="p.path"
                  class="v-card group"
                  :to="p.path"
                >
                  <p
                    class="icon transition-200 group-hover:bg-light"
                    :class="p.className"
                  ></p>
                  <p mt-2>{{ p.name }}</p>
                </NuxtLink>
              </div>
              <!-- 退出登录| 我的主页 -->
              <div
                class="btn"
                flex-row-bt-c
                pt-4
              >
                <el-button
                  size="large"
                  @click="exitLogin"
                  ml-3
                >
                  退出登录
                </el-button>
                <NuxtLink
                  to="/user/info"
                  mr-3
                >
                  <el-button
                    size="large"
                    type="primary"
                  >
                    个人主页
                  </el-button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </el-popover>
    </ClientOnly>
  </div>
</template>
<style scoped lang="scss">
.hovers {
  width: 2.3em;
  height: 2.3em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 标签
:deep(.el-tag) {
  padding: 0.1em 0.3em;
  height: 1.2rem;
}

.hovers:hover {
  transition: $transition-delay;
  position: relative;

  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0.7em;
    left: 0;
    z-index: 2;
    transition: $transition-delay;
    font-size: 1em;
    margin: auto;
    color: var(--el-bg-color-primary);
  }
}

.user-card {
  // 弹窗
  .popup {
    border-radius: 4px;

    .img {
      .avatar-uploader {
        width: 100%;

        :deep(.el-upload) {
          display: flex;
        }
      }
    }
  }
}

.top {
  background-color: var(--el-color-primary);
  border-radius: 6px 6px 0 0;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
}

.avatar-uploader {
  transform: translateY(-50%);

  :deep(.el-upload--picture) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.el-upload-dragger) {
    border-radius: 50%;
    width: 6em;
    height: 6em;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--el-bg-color);
    opacity: 0.95;
    box-shadow: rgba(60, 64, 67, 0.2) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  }
}

.popup .bottom {
  margin-top: -3.8em;
  padding: 0.8em;
  border-radius: 6px;

  .title {
    text-align: center;
  }
}

.btn {
  border-top: 1px solid rgba(128, 128, 128, 0.12);
}

:deep(.div__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 6em;
  height: 6em;
  border-radius: 6px;
  cursor: pointer;
  margin: 0.2em;
}

.v-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  padding: 0.6em;
  box-shadow: none;
  transition: $transition-delay;
  &:hover {
    opacity: 0.9;
    background-color: var(--el-color-primary);
    color: #fff;
    svg {
      fill: #fff;
      color: #fff;
    }
  }
  .icon {
    cursor: pointer;
    width: 3em;
    height: 3em;
  }
}
</style>
