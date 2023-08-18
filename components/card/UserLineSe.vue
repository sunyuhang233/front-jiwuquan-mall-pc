<script lang="ts" setup>
const user = useUserStore();
const isShow = ref<boolean>(false);
// 退出登录
const exitLogin = () => {
  ElMessageBox.confirm("确认退出登录？", "退出登录", {
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
      useAddressStore()?.$reset();
      ElMessage.success("退出成功！");
    })
    .catch(() => {});
};
</script>
<template>
  <div>
    <div v-if="user.isLogin">
      <el-popover
        placement="bottom"
        :width="60"
      >
        <template #reference>
          <img
            loading="lazy"
            class="rounded-6em w-2em h-2em"
            :src="
              user.userInfo.avatar ? BaseUrlImg + user.userInfo.avatar : BaseUrlImg + 'default.png'
            "
            :alt="user.userInfo.nickname"
          />
        </template>
        <div class="grid grid-cols-1 text-center w-full">
          <NuxtLink
            to="/"
            class="py-2 rounded-6px cursor-pointer"
          >
            回到主页
          </NuxtLink>
          <span
            class="py-2 rounded-6px cursor-pointer"
            @click="exitLogin"
          >
            退出登录
          </span>
        </div>
      </el-popover>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
