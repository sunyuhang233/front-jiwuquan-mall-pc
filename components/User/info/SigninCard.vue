<script lang="ts" setup>
import { getUserLeave } from "@/composables/utils";
// 用户信息
const user = useUserStore();
const points = toRef<number>(user.userWallet.points || 0);
const getLeave = getUserLeave(user.userWallet.points || 0);
</script>
<template>
  <div class="py-8 px-10 rounded-4px v-card">
    <div class="flex justify-between">
      <!-- 积分 -->
      <strong class="opacity-90 hover:scale-110 transition-300 cursor-pointer flex-row-c-c">
        <small
          text-1em
          mr-4
        >
          积分
        </small>
        <h2
          inline
          v-incre-up-int="points"
        ></h2>
      </strong>
      <!-- 等级 -->
      <div
        ml-3em
        flex
        flex-col
      >
        <small pb-3>等级：lv.{{ getLeave }}</small>
        <el-progress
          :percentage="(getLeave / 6) * 100"
          :show-text="false"
          striped
        />
      </div>
    </div>
    <!-- 签到按钮 -->
    <div class="btn my-4">
      <el-button type="info">签 到</el-button>
      <small
        opacity-80
        ml-3
      >
        每日签到+100积分
      </small>
    </div>
    <el-popover
      :width="160"
      trigger="hover"
    >
      <template #reference>
        <small
          cursor-pointer
          text-blueGray
          underline
        >
          如何获取积分?
          <i
            p-2
            ml-2
            text-blueGray
            i-solar:dollar-linear
          ></i>
        </small>
      </template>
      <li>1、通过钱包额度充值</li>
      <li>2、通过每日签到</li>
    </el-popover>
  </div>
</template>
<style scoped lang="scss"></style>
