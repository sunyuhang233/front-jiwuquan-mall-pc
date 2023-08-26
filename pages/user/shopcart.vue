<script lang="ts" setup>
import currency from "currency.js";
import { deleteBatchShopcartByIds, getUserShopCartPage } from "~/composables/api/shopcart";
import type { PushOrdersItemDTO } from "~/composables/api/orders";

useHead({
  title: "极物 我的购物车",
  meta: [
    {
      name: "description",
      content: "极物圈-我的购物车",
    },
  ],
});

const shop = useShopStore();
const user = useUserStore();
const isLoading = ref<boolean>(false);
const isShow = ref<boolean>(false);

// 没有更多
const notMore = computed(() => {
  return (
    shop.shopcartList.length >= shop.pageInfo.total || shop.pageInfo.current === shop.pageInfo.pages
  );
});

// 1、选中的购物车商品
const isEdit = ref<boolean>(false);
const selectIds = ref<string[]>([]);
function deleteBatchShopcart(text = "删除") {
  ElMessageBox({
    title: `${text}提示！`,
    message: `确定要${text}吗？`,
    type: "warning",
    showClose: false,
    center: true,
    customClass: "text-center",
    showCancelButton: true,
    cancelButtonText: "取 消",
    confirmButtonText: "删 除",
  })
    .then(async (res) => {
      if (res === "confirm") {
        const { code } = await deleteBatchShopcartByIds(selectIds.value, user.getToken);
        if (code === StatusCode.SUCCESS && shop.deleteBatchShopCart(selectIds.value)) {
          selectIds.value.splice(0);
          ElMessage.success(`${text}成功！`);
        } else {
          ElMessage.error("删除失败，请稍后再试试看！");
        }
      }
    })
    .catch((err) => {});
}
// 2、清空购物车
function clearShopcart() {
  selectIds.value.push(...shop.shopcartList.map((p) => p.id));
  deleteBatchShopcart("清空");
}
// 购物车选中项目id
const isSelectAll = ref<boolean>(false);
// 3、修改
watch(isSelectAll, (val: boolean) => {
  selectIds.value.splice(0);
  if (val) selectIds.value.push(...shop.shopcartList.map((p) => p.id));
});
// 购物车数量
const getShopCartLength = computed(() => {
  let count = 0;
  for (const p of shop.shopcartList) count += p.quantity;

  return count;
});
const order = useOrderStore();

// 4、前往订单页面付款
function toOrderPage(ids: string[]) {
  const dtoList: PushOrdersItemDTO[] = [];
  shop.shopcartList.map((p) => {
    if (ids.includes(p.id)) {
      const { skuId, quantity } = p;
      dtoList.push({ skuId, quantity });
    }
  });
  order.clearOrderItems();
  order.$patch({
    pushOrderItems: dtoList,
  });
  useRouter().push({
    path: "/order/detail",
  });
}
// 邮费
const getAllPostate = ref<number>(0);
// 计算总价
const getAllNums = ref<number>(0);
const getAllPrice = computed(() => {
  getAllNums.value = 0;
  getAllPostate.value = 0;
  const selectList = shop.shopcartList.filter((p) => selectIds.value.includes(p.id));
  let prices = currency(0);
  selectList.forEach((p) => {
    if (p.postage) {
      getAllPostate.value += +p.postage;
    }
    getAllNums.value += p.quantity;
    prices = prices.add(
      currency(p.price)
        .multiply(p.quantity)
        .add(+(p.postage || 0))
    );
  });
  return prices;
});
definePageMeta({
  key: (route) => route.path,
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
      <div>
        <ClientOnly>
          <div class="layout-default md:w-700px mx-a pb-0">
            <div
              v-if="user.isLogin"
              class="shopcart-list"
              relative
              mx-a
              rounded-10px
              bg-white
              p-4
              md:p-6
              shadow-md
              border-default
              dark:bg-dark
            >
              <h3
                mb-2
                border-0
                border-b-1
                pb-4
                text-center
                tracking-0.1em
                border-default
              >
                <small
                  style="font-size: 1rem"
                  float-right
                  my-1
                  cursor-pointer
                  select-none
                  :plain="!isEdit"
                  class="transition-300"
                  text-green-5
                  @click="isEdit = !isEdit"
                >
                  {{ !isEdit ? "管理" : "取消" }}
                </small>
                购物车
              </h3>
              <el-scrollbar
                height="66vh"
                v-infinite-scroll="shop.loadShopcartList"
                :infinite-scroll-delay="1000"
                :infinite-scroll-disabled="notMore"
                style="overflow: auto"
              >
                <!-- 购物车项 -->
                <el-checkbox-group
                  v-model="selectIds"
                  size="large"
                  class="relative"
                >
                  <ul
                    v-auto-animate="{
                      duration: 300,
                      easing: 'cubic-bezier(0.61, 0.225, 0.195, 1.3)',
                    }"
                  >
                    <li
                      v-for="p in shop.shopcartList"
                      :key="p.id"
                    >
                      <CardShopLine :shop-cart="p">
                        <template #btn>
                          <el-checkbox
                            :label="p.id"
                            :disabled="!p.stock"
                          />
                        </template>
                      </CardShopLine>
                    </li>
                  </ul>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
            <!-- 下方按钮 -->
            <div
              sticky
              bottom-4
              z-99
              class="w-full animate-fade-in-up animate-duration-300 my-4 mb-0"
            >
              <!-- 价格 -->
              <div
                flex-row-bt-c
                p-2
                px-4
              >
                <span
                  float-left
                  p-1
                >
                  共计 {{ getAllNums }} 件
                </span>
                <div
                  flex
                  ml-a
                  items-end
                >
                  <span p-1>总计：￥</span>
                  <h2
                    v-incre-up="getAllPrice"
                    text-red-5
                  />
                </div>
                <small
                  claas=""
                  v-show="getAllPostate > 0"
                >
                  （运费：{{ currency(getAllPostate) }}￥）
                </small>
              </div>
              <div
                class="w-full backdrop-blur-2em h-4em flex items-center justify-between rounded-10px bg-white px-4 shadow-md border-default dark-bg-dark-6"
              >
                <el-checkbox
                  v-model="isSelectAll"
                  size="large"
                  label="全 选"
                />
                <div flex>
                  <el-button
                    v-if="isEdit && selectIds.length"
                    class="fadeInOut flex-1"
                    style="padding: 0em 1em"
                    type="danger"
                    plain
                    :disabled="selectIds.length === 0 && !isEdit"
                    round
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
          </div>
        </ClientOnly>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.shop-cart {
  position: fixed;
  bottom: 3em;
  right: 3em;
  transition: $transition-delay;
  z-index: 999;
  border-radius: 50%;

  .icon {
    width: 3.5em;
    height: 3.5em;
    background-color: var(--el-color-primary);
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;

    i {
      color: #fff;
    }
    .count {
      background-color: var(--el-color-danger);
      color: #fff;
      border-radius: 50%;
      min-width: 1.5em;
      min-height: 1.5em;
      text-align: center;
      line-height: 1.2em;
      position: absolute;
      padding: 0.3em;
      right: -10%;
      top: -10%;
    }
  }

  :deep(.badge__content) {
    background-color: $loading-color;
  }

  .popover {
    position: absolute;
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
