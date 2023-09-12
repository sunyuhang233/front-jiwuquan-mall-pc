<script lang="ts" setup>
import currency from 'currency.js';
import { deleteBatchShopcartByIds, getUserShopCartPage } from '~/composables/api/shopcart';
import type { PushOrdersItemDTO } from '~/composables/api/orders';

const shop = useShopStore();
const user = useUserStore();
const isShow = ref<boolean>(false);
if (user.isLogin)
  shop.loadShopcartList();


// 1、选中的购物车商品
const isEdit = ref<boolean>(false);
const selectIds = ref<string[]>([]);
function deleteBatchShopcart(text: string = '删除') {
  ElMessageBox({
    title: `${text}提示！`,
    message: `确定要${text}吗？`,
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
        if (res === 'confirm') {
          const { code } = await deleteBatchShopcartByIds(selectIds.value, user.getToken);
          if (code === StatusCode.SUCCESS && shop.deleteBatchShopCart(selectIds.value)) {
            selectIds.value.splice(0);
            ElMessage.success(`${text}成功！`);
          }
          else {
            ElMessage.error('删除失败，请稍后再试试看！');
          }
        }
      }
    })
    .catch();
}

function clearShopcart() {
  deleteBatchShopcart('清空');
}
// 购物车选中项目id
const isSelectAll = ref<boolean>(false);
watch(isSelectAll, (val: boolean) => {
  selectIds.value.splice(0);
  if (val)
    selectIds.value.push(...shop.shopcartList.map(p => p.id));
});
// 购物车数量
const getShopCartLength = computed(() => {
  let count = 0;
  for (const p of shop.shopcartList)
    count += p.quantity;

  return count;
});
// 计算总价
const getAllPrice = computed(() => {
  const selectList = shop.shopcartList.filter(p => selectIds.value.includes(p.id));
  let count = currency('0.00');
  selectList.forEach((p) => {
    count = count.add(currency(p.price).multiply(p.quantity));
  });
  return count;
});
// 全屏
const fullscreenLoading = ref<boolean>(false);
const order = useOrderStore();
// 前往订单页面付款
function toOrderPage(ids: string[]) {
  const dtoList: PushOrdersItemDTO[] = [];
  shop.shopcartList.forEach((p) => {
    if (ids.includes(p.id)) {
      const { skuId, quantity } = p;
      dtoList.push({ skuId, quantity });
    }
  });

  fullscreenLoading.value = true;
  // 提交订单
  setTimeout(() => {
    order.clearOrderItems();
    order.$patch({
      pushOrderItems: dtoList,
    });
    fullscreenLoading.value = false;
    navigateTo({
      path: '/order/detail',
    });
  }, 800);
}
</script>

<template>
  <div
    v-if="user.isLogin"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="shop-cart"
  >
    <!-- 下拉框 -->
    <el-popover
      placement="top"
      shadow-lg
      :visible="isShow"
      :teleported="false"
      popper-class="popover w-100% md:w-500px"
      transition="fade"
      :hide-after="0"
      popper-style="width:fit-content; box-shadow:rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;border-radius:6px;
    min-height:380px; padding: 1.2em 1em; right: 0;"
      tabindex="0"
      @keyup.esc="isShow = false"
    >
      <template #reference>
        <div
          class="icon shadow-[#5d33f9] shadow-md shadow-opacity-60"
          flex-row-c-c


          cursor-pointer transition-300 hover:scale-92 hover:opacity-90 @click="isShow = true"
        >
          <span
            v-show="getShopCartLength && getShopCartLength < 99"
            v-incre-up-int="getShopCartLength"
            class="count animate__animated animate__fadeIn"
            shadow-sm
          />
          <span
            v-show="getShopCartLength && getShopCartLength > 99"
            class="count animate__animated animate__fadeIn"
            shadow-sm
          >
            99+
          </span>
          <i
            i-solar:cart-large-bold-duotone
            style="width: 60%; height: 60%"
          />
        </div>
      </template>
      <template #default>
        <div>
          <!-- 2、 商品goods -->
          <!-- 未登录 -->
          <div
            v-if="!user.isLogin"
            class="tologin"
            flex-row-c-c
            flex-col
          >
            <h3


              mb-8 mt-10 text-center
            >
              未登录，请登录！
            </h3>
            <el-button
              size="large"
              type="primary"
              @click="user.showLoginForm = true"
            >
              立即登录
            </el-button>
          </div>
          <h2


            mb-2 border-0 border-b-1 pb-4 text-center tracking-0.1em border-default
          >
            <span
              style="font-size: 0.6em; position: absolute; right: 2em; top: 2em"
              cursor-pointer
              select-none
              :plain="!isEdit"
              class="transition-300"
              @click="isEdit = !isEdit"
            >
              {{ !isEdit ? "管理" : "取消" }}
            </span>
            购物车
          </h2>
          <el-scrollbar
            v-if="user.isLogin"
            height="50vh"
            mb-2
          >
            <!-- 购物车项 -->
            <el-checkbox-group
              v-model="selectIds"
            >
              <div
                v-infinite-scroll="shop.loadShopcartList"
                v-auto-animate
                style="overflow-y: auto"
                :infinite-scroll-delay="400"
                :infinite-scroll-distance="40"
                :infinite-scroll-disabled="shop.notMore"
              >
                <CardShopLine
                  v-for="p in shop.shopcartList"
                  :key="p.id"
                  :shop-cart="p"
                >
                  <template #btn>
                    <el-checkbox
                      :label="p.id"
                      :disabled="!p.stock"
                    />
                  </template>
                </CardShopLine>
              </div>
            </el-checkbox-group>
          </el-scrollbar>

          <!-- 下方按钮 -->
          <div
            class="bottom"
            style="width: 100%"


            flex items-center justify-between border-2px rounded-6px px-2 border-default
          >
            <el-checkbox
              v-model="isSelectAll"
              mx-2
              size="large"
              label="全 选"
            />
            <div
              flex-row-bt-c
              truncate
            >
              <h3 class="mx-4">
                <small>总计：￥</small>
                <span
                  v-incre-up="getAllPrice"
                  class="text-[var(--el-color-error)]"
                />
              </h3>
              <el-button
                v-if="isEdit && selectIds.length"
                class="fadeInOut flex-1"
                style="padding: 0em 1em"
                type="danger"

                :disabled="selectIds.length === 0 && !isEdit"
                round plain
                @click="deleteBatchShopcart('批量删除')"
              >
                批量删除
                <i
                  i-solar:trash-bin-trash-broken
                  mr-1
                />
              </el-button>
              <el-button
                v-if="isEdit"
                class="fadeInOut flex-1"
                style="padding: 0em 1em"
                type="danger"
                plain
                :disabled="!isEdit"
                round
                @click="clearShopcart"
              >
                <i
                  i-solar:trash-bin-trash-broken
                  mr-1
                />
                清空
              </el-button>
              <el-button
                class="fadeInOut flex-1"
                style="padding: 0em 2em"
                type="info"
                round
                :disabled="selectIds.length === 0"
                tracking-0.1em
                @click="toOrderPage(selectIds)"
              >
                去结算
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 蒙版 -->
    <div
      v-show="isShow"


      class="shop-cart-mock" h-100vh w-100vw bg-dark-300 opacity-40 transition-200
      dark:bg-dark-200
      style="position: fixed; top: 0; left: 0; z-index: -1"
      @click="isShow = false"
      @keyup.esc="isShow = false"
    />
  </div>
</template>

<style scoped lang="scss">
.shop-cart {
  position: relative;
  transition: $transition-delay;
  z-index: 999;
  border-radius: 50%;

  .icon {
    width: 100%;
    height: 100%;
    background-color: var(--el-color-primary);
    border-radius: 50%;

    i {
      color: #fff;
    }

    .count {
      background-color: var(--el-color-danger);
      color: #fff;
      border-radius: 50%;
      font-size: 0.8rem;
      width: 1.6rem;
      line-height: 1.6rem;
      height: 1.6rem;
      text-align: center;
      position: absolute;
      right: -15%;
      top: -15%;
    }
  }

  :deep(.badge__content) {
    background-color: $loading-color;
  }
}

:deep(.el-checkbox-group) {
  font-size: 1em;
  line-height: 1.1em;

  .el-checkbox__label {
    display: none;
  }
}

:deep(.el-checkbox__inner) {
  border-radius: 4px;
  transform: scale(1.5);
}

// 蒙版
.shop-cart-mock {
  animation: fadeInOut 0.24s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.4;
  }
}
</style>
