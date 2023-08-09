<script lang="ts" setup>
import {
  AddWalletDTO,
  RechangeType,
  WalletComboVO,
  addUserWallet,
  getWalletCombo,
} from "@/composables/api/user/wallet";
import currency from "currency.js";
// 套餐数据
const comboList = useAsyncData(
  "comboList_jiwuquan",
  async () => {
    const { data, code } = await getWalletCombo();
    if (code === StatusCode.SUCCESS) {
      return data;
    } else {
      return [];
    }
  },
  {
    lazy: true,
    server: false,
  }
).data;
const user = useUserStore();
// 是否loading
const isLoading = ref<boolean>(false);

// 自定义充值金额
const amount = ref<number>(0);
/**
 *充值
 * @param formRef
 */
const onRechange = async () => {
  if (!amount.value) {
    return ElMessage.error("充值金额不能为空!");
  }
  if (+amount?.value < 5 || +amount?.value > 10000) {
    return ElMessage.error("充值金额必须在5-10000之间！");
  }
  ElMessageBox.confirm(`是否确认充值 ￥${amount.value}?`, "自由充值", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async (status) => {
      if (status === "confirm") {
        isLoading.value = true;
        // 请求
        if (
          await toUserRechange({
            type: RechangeType.AUTO,
            amount: +amount.value,
          })
        ) {
          isLoading.value = false;
          return ElMessage.success("充值成功，注意到账！💰");
        } else {
          isLoading.value = false;
          return ElMessage.error("充值失败，请稍后重试！");
        }
      }
    })
    .catch(() => {});
};
/**
 *充值套餐
 * @param obj 钱包参数
 */
const onRechangeByCombo = (obj: WalletComboVO) => {
  ElMessageBox.confirm(`充值${obj.amount}送${obj.points}积分！`, "套餐充值", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async (status) => {
      if (status === "confirm") {
        isLoading.value = true;
        // 请求
        if (await toUserRechange({ type: RechangeType.COMBO, id: `${obj.id}` })) {
          ElMessage.success("充值成功！");
          user.loadUserWallet(user.getToken);
        } else {
          ElMessage.success("充值失败，请稍后重试！");
        }
        isLoading.value = false;
      }
    })
    .catch(() => {});
};
/**
 * 充值api
 */
const toUserRechange = async (dto: AddWalletDTO): Promise<boolean> => {
  const { code } = await addUserWallet({ ...dto }, user.getToken);
  return code === StatusCode.SUCCESS;
};
</script>
<template>
  <div
    class="w-full"
    v-loading.fullscreen.lock="isLoading"
  >
    <h3 mt-4>
      <i
        i-solar:gamepad-charge-broken
        p-3
        mr-2
      />
      充值套餐
    </h3>
    <small
      block
      mt-2
      mb-4
      px-1
      opacity-70
    >
      充值对应套餐有优惠 💰
    </small>
    <div class="grid grid-cols-3 grid-gap-3 mr-2">
      <!-- 数据 -->
      <div
        flex-row-c-c
        flex-col
        style="aspect-ratio: 1/1"
        cursor-pointer
        active:scale-95
        transition-300
        border-default-dashed
        hover:border-solid
        border-2px
        rounded-14px
        text-bluegray-700
        dark:text-bluegray-200
        leading-1.8em
        class="hover:border-[var(--el-color-success)] hover:bg-[var(--el-color-success)] hover:text-white hover:shadow-md"
        v-for="p in comboList"
        :key="p.id"
        @click="onRechangeByCombo(p)"
      >
        <h3 text-center>￥{{ currency(p.amount).divide(p.discount).value }}</h3>
        <small class="opacity-70 text-0.8em line-through">原价￥{{ p.amount }}</small>
        <small class="leading-1.5em block opacity-80 text-center text-0.5em">
          赠送{{ p.points }}积分
        </small>
      </div>
      <div
        class="flex-row-c-c cursor-pointer active:scale-95 dark-hover:bg-dark transition-300 border-default-dashed border-2px rounded-12px p-4 text-bluegray-700 dark:text-bluegray-200 leading-2.4em"
      >
        期待更多
      </div>
    </div>
    <!-- 输入框充值 -->
    <small class="block mx-1 mt-4 opacity-90">自定义充值（单位：￥）</small>
    <div class="mt-4 flex items-center">
      <el-input-number
        class="mr-4"
        v-model="amount"
        :min="5"
        :max="10000"
        controls-position="right"
      />
      <el-button
        value="充 值"
        class="border-default px-4"
        @click="onRechange()"
        type="info"
      >
        充 值
      </el-button>
      <small
        opacity-80
        tracking-0.1em
      >
        （5-10000元额度）
      </small>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
