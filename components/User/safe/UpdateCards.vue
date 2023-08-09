<script lang="ts" setup>
const user = useUserStore();
const shop = useShopStore();
const order = useOrderStore();
const address = useAddressStore();

const toExistLogin = async () => {
  ElMessageBox.confirm("是否确认退出登录？", "退出登录", {
    confirmButtonText: "确认退出",
    cancelButtonText: "取消",
  }).then(async (action) => {
    if (action === "confirm") {
      await user.onUserExit(user.getToken);
      user.$reset();
      shop.$reset();
      order.$reset();
      address.$reset();
      navigateTo("/");
    }
  });
};
/**
 * 重新加载用户信息
 */
const isLoading = ref<boolean>(false);
const reloadUserInfo = async () => {
  isLoading.value = true;
  (await user.loadUserWallet(user.getToken))
    ? ElMessage.success("刷新成功🎉")
    : ElMessage.success("刷新失败，请稍后重试！");
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};
// 展示表单
const form = ref({
  showUpdatePwd: false,
  showUpdatePhone: false,
  showUpdateEmail: false,
});
</script>
<template>
  <div class="card flex flex-col">
    <strong
      block
      opacity-70
      my-4
    >
      <i
        p-2.5
        mr-2
        i-solar:shield-check-broken
      />
      修改信息
    </strong>
    <!-- 用户信息 -->
    <div
      v-loading="isLoading"
      class="v-card group overflow-hidden text-1em flex flex-col p-5 shadow-sm border-default rounded-14px"
      flex-1
      flex
      flex-col
    >
      <div class="flex items-center">
        <el-avatar
          size="large"
          :src="
            user.userInfo.avatar ? BaseUrlImg + user.userInfo.avatar : BaseUrlImg + 'default.png'
          "
        />
        <strong class="block ml-3">用户名：{{ user.userInfo.username }}</strong>
        <i
          @click="reloadUserInfo"
          opacity-0
          transition-300
          group-hover:opacity-100
          class="px-3 ml-a hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)]"
        />
      </div>
      <!-- 密码 -->
      <div
        flex-row-bt-c
        mt-6
        ml-1
      >
        <small>
          密&emsp;码：
          <small opacity-80>*******</small>
        </small>
        <small
          class="cursor-pointer transition-300 hover:text-[var(--el-color-primary)]"
          @click="form.showUpdatePwd = true"
        >
          修改密码
        </small>
      </div>
      <!-- 手机号 -->
      <div
        flex-row-bt-c
        mt-6
        ml-1
      >
        <small>
          手机号：
          <small
            opacity-80
            :class="{ 'text-red-5': user.userInfo.isPhoneVerified === 0 }"
          >
            {{ user.userInfo.phone || "还未绑定" }}
          </small>
        </small>
        <small
          @click="form.showUpdatePhone = true"
          class="cursor-pointer transition-300 hover:text-[var(--el-color-primary)]"
        >
          {{ user.userInfo.isPhoneVerified ? "修改手机号" : "绑定" }}
        </small>
      </div>
      <!-- 邮箱 -->
      <div
        flex-row-bt-c
        mt-6
        ml-1
      >
        <small>
          邮&emsp;箱：
          <small
            opacity-80
            :class="{ 'text-red-5': user.userInfo.isEmailVerified === 0 }"
          >
            {{ user.userInfo.email || "还未绑定" }}
          </small>
        </small>
        <small
          @click="form.showUpdateEmail = true"
          class="cursor-pointer transition-300 hover:text-[var(--el-color-primary)]"
        >
          {{ user.userInfo.isEmailVerified ? "修改邮箱" : "绑定" }}
        </small>
      </div>
      <div
        mt-a
        w-full
      >
        <!-- 退出 -->
        <ElDivider class="dark:opacity-20" />
        <div
          flex-row-bt-c
          justify-end
          mb-1
        >
          <el-text
            style="margin-left: 1rem"
            class="cursor-pointer transition-300 hover:text-[var(--el-color-primar)y]"
            @click="ElMessage.warning('功能还未开放!')"
          >
            注销
          </el-text>
          <el-text
            style="margin-left: 1rem"
            class="cursor-pointer transition-300 hover:text-[var(--el-color-primar)y]"
            type="danger"
            @click="toExistLogin"
          >
            退出登录
          </el-text>
        </div>
      </div>
    </div>
    <UserSafeDialog v-model="form" />
  </div>
</template>
<style scoped lang="scss"></style>
