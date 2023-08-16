<script lang="ts" setup>
import {
  OrdersStatus,
  pushOrdersItems,
  payOrders,
  PayType,
  cancelOrders,
  refundOrders,
  checkDeliveryOrders, // 确认收货
  deleteOrders, // 删除订单
  type PushOrdersItemDTO,
} from "~/composables/api/orders";
import { GoodsSkuMdVO, getGoodsSkuByIds } from "~/composables/api/goods/sku";
import { appName } from "~/constants";
import currency from "currency.js";

// 1、订单内容store
const order = useOrderStore();
const address = useAddressStore();
const user = useUserStore();
const route = useRoute();
// 2、reloadOrderInfo
useAsyncData(async () => {
  if (route.query.id) {
    order.reloadOrderInfo();
  }
});
// 订单状态
const ordersTitle = computed(() => {
  let banner: string = "";
  let submitText: string = "";
  let type: any = "";
  let btnType: any = "";
  switch (order.status) {
    case OrdersStatus.READY:
      banner = "提交订单";
      submitText = "提交订单";
      type = "primary";
      btnType = "primary";
      break;
    case OrdersStatus.UN_PAID:
      banner = "待付款";
      submitText = "立即付款";
      type = "danger";
      btnType = "danger";
      break;
    case OrdersStatus.PAID:
      banner = "已付款，等待发货... 📦";
      submitText = "催发货";
      type = "primary";
      btnType = "primary";
      break;
    case OrdersStatus.DELIVERED:
      banner = "已发货，请等待物流运算";
      submitText = "确认收货";
      type = "success";
      btnType = "success";
      break;
    case OrdersStatus.RECEIVED:
      banner = "已确认收货，期待你的评价！";
      submitText = "去评价";
      type = "info";
      btnType = "info";
      break;
    case OrdersStatus.COMMENTED:
      banner = "已完成评论，欢迎下次光临！";
      submitText = "再来一单";
      type = "success";
      btnType = "success";
      break;
    case OrdersStatus.CANCELED:
      banner = "订单已取消...";
      submitText = "再来一单";
      type = "primary";
      btnType = "primary";
      break;
    case OrdersStatus.DELAY_CANCELED:
      banner = "订单已超时自动取消...";
      submitText = "再来一单";
      type = "primary";
      btnType = "primary";
      break;
    case OrdersStatus.REFUND:
      banner = "发起退款中，等等卖家处理...";
      submitText = "等待中，请稍后";
      type = "warning";
      btnType = "warning";
      break;
    case OrdersStatus.REFUND_SUCCESS:
      banner = "退款成功，请注意到账！";
      submitText = "再来一单";
      type = "info";
      btnType = "info";
      break;
  }
  return {
    banner,
    submitText,
    type,
    btnType,
  };
});
// 状态
const isEdit = ref<boolean>(false); // 是否编辑
const isUpdate = ref<boolean>(order.status === OrdersStatus.READY); // 是否可更新 （地址|留言）
const isLoading = ref<boolean>(false);
const isLoadAddressList = ref<boolean>(false);
if (address.addressList.length === 0) {
  address.resetRequestList(user.getToken);
}
watch(isEdit, (val) => {
  if (val) {
    selectPointsVal.value = 0;
  }
});
const orderItems = ref<(GoodsSkuMdVO & PushOrdersItemDTO)[]>([]);
// 2、查询属性信息
const skuIdList: string[] = [];
order.pushOrderItems?.forEach((p) => {
  skuIdList.push(p.skuId);
});
// 3、加载属性购物列表和选中规格
const loadSkuItems = async () => {
  if (skuIdList.length === 0) return;
  const { data, code } = await getGoodsSkuByIds(skuIdList);
  if (code === StatusCode.SUCCESS) {
    data.forEach((sku) => {
      const item = order.pushOrderItems.find((p) => p.skuId === sku.id) || {
        skuId: "",
        quantity: 0,
      };
      orderItems.value.push({ ...sku, ...item });
    });
  }
};
useAsyncData(async () => {
  await loadSkuItems();
});

// 4、选中地址id
const selectAddressId = ref<string>("");
watch(
  address.addressList,
  (val) => {
    if (!selectAddressId.value && val.length > 0) {
      selectAddressId.value = val.find((p) => p.isDefault === 1)?.id || val[0].id;
    }
  },
  { deep: true, immediate: true }
);
// 5、选择代金卷
const selectVoucherId = ref<string>("");
const voucherList = ref([]);
// 6、选择积分抵扣
const selectPointsVal = ref<number>(0);
// 7、备注
const remark = ref<string>(order.orderInfo.remark);

/**
 * 订单处理（提交、付款、修改订单）
 * @param status
 */
const onSubmitOrders = async (status: OrdersStatus) => {
  // 1、开启加载 | 保存订单 | 关闭全部编辑
  isEdit.value = false; // 全局编辑
  isUpdate.value = false; // 地址|留言更新
  saveOrdersItems();
  switch (status) {
    case OrdersStatus.READY:
      await pushOrder();
      setTimeout(async () => {
        await payOrder(selectPayType.value);
      }, 600);
      break;
    case OrdersStatus.UN_PAID:
      await payOrder(selectPayType.value);
      break;
    case OrdersStatus.PAID:
      toastOrder();
      break;
    case OrdersStatus.DELIVERED:
      checkDeliveryOrder();
      break;
    case OrdersStatus.CANCELED:
    case OrdersStatus.DELAY_CANCELED:
    case OrdersStatus.COMMENTED:
    case OrdersStatus.REFUND_SUCCESS:
      await aginPushOrder(order.pushOrderItems);
      break;
    case OrdersStatus.RECEIVED:
      toCommon();
      break;
  }
};

// 选择支付方式
const selectPayType = ref<PayType>(PayType.WEALLET);
const payTypeList = ref<PayTypeDTO[]>([
  {
    disable: false,
    type: PayType.WEALLET,
    icon: "<i block w-full h-full   i-solar:wallet-bold-duotone bg-red-5>",
    title: "钱包",
  },
  {
    disable: true,
    type: PayType.WECHAT,
    icon: `<svg
					t="1689749259928"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="1522"
				>
					<path
						class="fill-[#29bd29] dark-fill-##29bd29"
						d="M683.058 364.695c11 0 22 1.016 32.943 1.976C686.564 230.064 538.896 128 370.681 128c-188.104 0.66-342.237 127.793-342.237 289.226 0 93.068 51.379 169.827 136.725 229.256L130.72 748.43l119.796-59.368c42.918 8.395 77.37 16.79 119.742 16.79 11 0 21.46-0.48 31.914-1.442a259.168 259.168 0 0 1-10.455-71.358c0.485-148.002 128.744-268.297 291.403-268.297l-0.06-0.06z m-184.113-91.992c25.99 0 42.913 16.79 42.913 42.575 0 25.188-16.923 42.579-42.913 42.579-25.45 0-51.38-16.85-51.38-42.58 0-25.784 25.93-42.574 51.38-42.574z m-239.544 85.154c-25.384 0-51.374-16.85-51.374-42.58 0-25.784 25.99-42.574 51.374-42.574 25.45 0 42.918 16.79 42.918 42.575 0 25.188-16.924 42.579-42.918 42.579z m736.155 271.655c0-135.647-136.725-246.527-290.983-246.527-162.655 0-290.918 110.88-290.918 246.527 0 136.128 128.263 246.587 290.918 246.587 33.972 0 68.423-8.395 102.818-16.85l93.809 50.973-25.93-84.677c68.907-51.93 120.286-119.815 120.286-196.033z m-385.275-42.58c-16.923 0-34.452-16.79-34.452-34.179 0-16.79 17.529-34.18 34.452-34.18 25.99 0 42.918 16.85 42.918 34.18 0 17.39-16.928 34.18-42.918 34.18z m188.165 0c-16.984 0-33.972-16.79-33.972-34.179 0-16.79 16.927-34.18 33.972-34.18 25.93 0 42.913 16.85 42.913 34.18 0 17.39-16.983 34.18-42.913 34.18z"
						p-id="1523"
					></path>
				</svg>`,
    title: "微信",
  },
  {
    disable: true,
    type: PayType.ALIPAY,
    icon: `<svg
					t="1689752384390"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="2518"
				>
					<path
						d="M230.771014 576.556522c-12.614493 9.646377-25.228986 23.744928-28.93913 42.295652-5.194203 24.486957-0.742029 55.652174 22.26087 80.13913 28.93913 28.93913 72.718841 37.101449 92.011594 38.585508 51.2 3.710145 106.110145-22.26087 147.663768-50.457971 16.324638-11.130435 43.77971-34.133333 70.492754-69.750725-59.362319-30.423188-133.565217-64.556522-212.22029-61.588406-41.553623 1.484058-70.492754 9.646377-91.269566 20.776812zM983.188406 712.347826c25.971014-61.588406 40.811594-129.113043 40.811594-200.347826 0-281.971014-230.028986-512-512-512S0 230.028986 0 512s230.028986 512 512 512c170.666667 0 321.298551-83.849275 414.794203-212.22029C838.492754 768.742029 693.797101 696.023188 604.011594 652.985507c-42.295652 48.973913-105.368116 97.205797-176.602898 117.982609-44.521739 13.356522-85.333333 18.550725-126.886957 9.646377-42.295652-8.904348-72.718841-28.197101-90.527536-47.489855-8.904348-10.388406-19.292754-22.26087-27.455073-37.843479 0.742029 0.742029 0.742029 2.226087 0.742029 2.968116 0 0-4.452174-7.42029-7.420289-19.292753-1.484058-5.936232-2.968116-11.872464-3.710145-17.808696-0.742029-4.452174-0.742029-8.904348 0-12.614493-0.742029-7.42029 0-15.582609 1.484058-23.744927 4.452174-20.776812 12.614493-43.77971 35.617391-65.298551 48.973913-48.231884 115.014493-50.457971 149.147826-50.457971 50.457971 0.742029 138.017391 22.26087 212.22029 48.973913 20.776812-43.77971 34.133333-89.785507 42.295652-121.692754H304.973913v-33.391304h158.052174v-66.782609H272.324638v-34.133333h190.701449v-66.782609c0-8.904348 2.226087-16.324638 16.324638-16.324637h74.944927v83.107246h207.026087v33.391304H554.295652v66.782609H719.768116S702.701449 494.933333 651.501449 586.202899c115.014493 40.811594 277.518841 104.626087 331.686957 126.144927z m0 0"
						fill="#1374f7"
						p-id="2519"
					></path>
				</svg>`,
    title: "支付宝",
  },
]);
export interface PayTypeDTO {
  disable: boolean;
  icon: string;
  title: string;
  type: PayType;
}

// 1）提交订单 READY -1
const pushOrder = async () => {
  isLoading.value = true;
  // 配置
  const items: PushOrdersItemDTO[] = orderItems.value.map((p) => {
    return {
      skuId: p.skuId,
      quantity: p.quantity,
      shopId: p.shopId, // 店铺id
      couponId: p.couponId, // 代金卷
      activityId: p.activityId, // 活动id
    };
  });
  const { data, message, code } = await pushOrdersItems(
    selectAddressId.value,
    items,
    useCheckXXSText(remark.value),
    user.getToken
  );
  if (code === StatusCode.SUCCESS) {
    order.$patch({
      orderId: data.orderId,
      unPaidVO: data,
      status: OrdersStatus.UN_PAID,
    });
    order.orderInfo.updateTime = useDateFormat(Date.now(), "YYYY-MM-DD HH:mm:ss").value.toString();
    order.orderInfo.createTime = order.orderInfo.updateTime;

    setTimeout(async () => {
      ElNotification.success({
        title: "提交成功！",
        message: `提交订单成功，请在24小时内完成付款`,
      });
      isLoading.value = false;
    }, 300);
  } else {
    ElNotification.error({
      title: "提交失败，请稍后再试！",
      message: message || "",
    });
    isLoading.value = false;
  }
};

// 2）支付订单 UN_PAID 0
const payOrder = async (payType: PayType) => {
  if (order.status !== OrdersStatus.UN_PAID) return;
  const str =
    payTypeList.value.map((p) => {
      if (p.type === payType) {
        return p.title;
      }
    }) || PayType.WEALLET;

  // 确认支付
  try {
    const action = await ElMessageBox.confirm(
      `使用${str[0]}支付 ￥${getFinalPrice.value}？`,
      "确认支付",
      {
        confirmButtonText: "支 付",
        confirmButtonClass: "el-button--info border-default shadow-sm",
        cancelButtonText: "取 消",
        center: true,
      }
    );
    if (action === "confirm") {
      isLoading.value = true;
      // 支付订单
      const { data, message, code } = await payOrders(
        order.orderId || order.orderInfo.id,
        PayType.WEALLET,
        selectPointsVal.value,
        selectVoucherId.value,
        user.getToken
      );
      if (code === StatusCode.SUCCESS) {
        ElNotification.success({
          title: "付款成功！",
          message: `支付成功，共花费${data}元`,
        });

        order.status = OrdersStatus.PAID;
        order.orderInfo.status = OrdersStatus.PAID;
      } else {
        ElNotification.error({
          title: "支付失败，请稍后再试！",
          message: message,
        });
      }
    }
    isLoading.value = false;
  } catch (e) {
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};
// 3）待发货（催发货）
const toastOrder = () => {
  ElMessageBox.alert("我们已收到您的订单，将尽快处理并安排发货！", "提 醒", {
    confirmButtonText: "明 白",
    center: true,
  }).catch();
};
// 4）取消订单 CANCLEL
const cancelOrder = async (orderId: string) => {
  if (order.status !== OrdersStatus.UN_PAID) return;
  try {
    const action = await ElMessageBox.confirm(`是否确认取消订单？`, "取消提示", {
      confirmButtonText: "确 认",
      confirmButtonClass: "el-button--primary is-plain border-default ",
      cancelButtonText: "取 消",
      center: true,
    });
    if (action === "confirm") {
      isLoading.value = true;
      // 发起退款
      const { message, code } = await cancelOrders(
        order.orderId || order.orderInfo.id,
        user.getToken
      );
      isLoading.value = false;
      // 成功
      if (code === StatusCode.SUCCESS) {
        order.orderInfo.updateTime = useDateFormat(
          Date.now(),
          "YYYY-MM-DD HH:mm:ss"
        ).value.toString();
        order.status = OrdersStatus.CANCELED;
        order.orderInfo.status = OrdersStatus.CANCELED;
        ElNotification.success({
          title: "取消成功 🎟",
          message: "订单取消成功，优惠卷等优惠也将原路退回！",
        });
      } else {
        // 失败
        ElNotification.error({
          title: "订单取消失败，请稍后再试！",
        });
      }
    }
  } catch (e) {
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};
// 5）修改订单 update
const updateOrder = async (orderId: string) => {
  if (order.status !== OrdersStatus.UN_PAID && order.status !== OrdersStatus.PAID) return;
  isUpdate.value = false;
  isLoading.value = true;
  if (selectAddressId.value === "") {
    ElMessage.warning("请选择修改地址！");
    return;
  }
  const { message, code } = await updateOrders(
    orderId,
    selectAddressId.value,
    remark.value || order.orderInfo.remark,
    user.getToken
  );
  isLoading.value = false;

  if (code === StatusCode.SUCCESS) {
    order.orderInfo.updateTime = useDateFormat(Date.now(), "YYYY-MM-DD HH:mm:ss").value.toString();
    let vo = address.addressList.find((p) => p.id === selectAddressId.value);
    if (vo) {
      order.orderInfo.name = vo.name;
      order.orderInfo.phone = vo.phone;
      order.orderInfo.province = vo.province;
      order.orderInfo.city = vo.city;
      order.orderInfo.county = vo.county;
      order.orderInfo.address = vo.address;
      order.orderInfo.postalCode = vo.postalCode;
      order.orderInfo.remark = remark.value;
    }
    ElNotification.success({
      title: "修改订单成功！",
    });
  } else {
    ElNotification.error({
      title: "修改失败，请稍后再试！",
      message: message,
    });
  }
};
// 6）发起退款订单 CANCLEL
const pushRefundOrder = async (orderId: string) => {
  if (
    order.status !== OrdersStatus.PAID &&
    order.status !== OrdersStatus.RECEIVED &&
    order.status !== OrdersStatus.DELIVERED
  )
    return;
  try {
    const action = await ElMessageBox.confirm(`确认发起退款？😢`, "退款提示", {
      center: true,
      confirmButtonText: "退 款",
      confirmButtonClass: "el-button--danger border-default shadow-sm",
      cancelButtonText: "取 消",
    });
    if (action === "confirm") {
      isLoading.value = true;
      // 发起退款
      const { message, code } = await refundOrders(
        order.orderId || order.orderInfo.id,
        user.getToken
      );
      isLoading.value = false;
      if (code === StatusCode.SUCCESS) {
        order.orderInfo.updateTime = useDateFormat(
          Date.now(),
          "YYYY-MM-DD HH:mm:ss"
        ).value.toString();
        // 发起退款
        if (order.status === OrdersStatus.RECEIVED) {
          order.status = OrdersStatus.REFUND;
          order.orderInfo.status = OrdersStatus.REFUND;
          ElNotification.success({
            title: "发起退款成功",
            message: message,
          });
        } else {
          // 未发货，直接退款
          order.status = OrdersStatus.REFUND_SUCCESS;
          order.orderInfo.status = OrdersStatus.REFUND_SUCCESS;
          ElNotification.success({
            title: "发起退款成功",
            message: "未发货，正在自动退款，请等待！",
          });
        }
      } else {
        ElNotification.error({
          title: "发起退款失败，请稍后再试！",
        });
      }
    }
  } catch (e) {
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};
// 7）确认收货 DELIVERED 2
const checkDeliveryOrder = async () => {
  if (order.status !== OrdersStatus.DELIVERED) return;
  try {
    const action = await ElMessageBox.confirm(`是否确认收货？`, "收货提示", {
      center: true,
      confirmButtonText: "确 认",
      confirmButtonClass: "el-button--success border-default shadow-sm",
      cancelButtonText: "取 消",
    });
    if (action === "confirm") {
      isLoading.value = true;
      // 发起收货
      const { code } = await checkDeliveryOrders(order.orderInfo.id, user.getToken);
      isLoading.value = false;
      if (code === StatusCode.SUCCESS) {
        order.orderInfo.updateTime = useDateFormat(
          Date.now(),
          "YYYY-MM-DD HH:mm:ss"
        ).value.toString();
        order.status = OrdersStatus.RECEIVED;
        order.orderInfo.status = OrdersStatus.RECEIVED;
        ElNotification.success({
          title: "收货成功",
          message: "收货确认成功！如有任何问题，请随时联系我们的客服。",
        });
      } else {
        ElNotification.error({
          title: "确认收货失败，请稍后再试！",
        });
      }
    }
  } catch (e) {
  } finally {
    isLoading.value = false;
  }
};
// 8）再来一单
const aginPushOrder = async (items: PushOrdersItemDTO[]) => {
  if (!items || items.length === 0) return;
  isLoading.value = true;
  const pushOrderItems = [...items];
  order.clearOrderItems();
  order.$patch({
    pushOrderItems,
  });
  isUpdate.value = true;
  isEdit.value = false; // 全局编辑
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};
// 9）去评价
const toCommon = () => {
  if (order.status !== OrdersStatus.RECEIVED) return;
  navigateTo({
    path: `/order/comment/${order.id}`,
  });
};
// 10）删除订单 REFUND_SUCCESS、CANCELED、DELAY_CANCELED、COMMENTED
const deleteOrder = async (orderId: string) => {
  if (
    order.orderInfo.status !== OrdersStatus.REFUND_SUCCESS &&
    order.orderInfo.status !== OrdersStatus.CANCELED &&
    order.orderInfo.status !== OrdersStatus.DELAY_CANCELED &&
    order.orderInfo.status !== OrdersStatus.COMMENTED
  )
    return;
  try {
    const action = await ElMessageBox.confirm(
      `删除将永久移除该订单及其相关信息，是否确定删除？`,
      "删除操作",
      {
        center: true,
        confirmButtonText: "删 除",
        confirmButtonClass: "el-button--danger border-default shadow-sm",
        cancelButtonText: "取 消",
      }
    );
    if (action === "confirm") {
      isLoading.value = true;
      // 发起退款
      const { code } = await deleteOrders(orderId || order.orderInfo.id, user.getToken);
      isLoading.value = false;
      if (code === StatusCode.SUCCESS) {
        // 删除
        order.clearOrderItems();
        order.status = OrdersStatus.DELETED;
        order.orderInfo.status = OrdersStatus.DELETED;
        ElNotification.success({
          title: "删除提示",
          message: "订单和相关信息删除成功！",
        });
      } else {
        ElNotification.error({
          title: "删除失败，请稍后再试！",
        });
      }
    }
  } catch (e) {
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};
//--------------------- 统计 计算 -----------------------
// 商品总价 +++
const getAllCoastPrice = computed(() => {
  let price = currency(0);
  orderItems.value.forEach((p) => {
    price = price.add(currency(p.price).multiply(p.quantity));
  });
  return price;
});
// 商品运费 +++
const getAllPostage = computed(() => {
  let price = currency(0);
  orderItems.value.forEach((p) => {
    price = price.add(currency(p.postage));
  });
  return price;
});
// 计算最大额度 --- (最后)
const getPointMax = computed(() => {
  let price = getAllCoastPrice.value.add(getAllPostage.value);
  return price.intValue > 10000 ? 10000 : price.intValue;
});
// 最终价格
const getFinalPrice = computed(() => {
  return getAllCoastPrice.value
    .add(getAllPostage.value)
    .subtract((selectPointsVal.value || 0) / 100);
});
// 计算优惠价
const getReduce = computed(() => {
  if (order.orderInfo.spendPrice) {
    return currency(order.orderInfo.totalPrice).subtract(order.orderInfo.spendPrice);
  } else {
    return null;
  }
});
// --------------------- 订单 ------------------------

// 选择地址
const updateAddressId = (id: string) => {
  if (isUpdate.value) {
    selectAddressId.value = id;
  }
};
// -------------------- 功能 -----------------------
/**
 * 打开编辑状态
 * @param status
 */
const toEditGoods = (status: OrdersStatus | number) => {
  if (status !== OrdersStatus.READY) return;
  if (isEdit.value) {
    saveOrdersItems();
    isEdit.value = false;
    return;
  }
  ElMessageBox.alert("提交订单后便不可修改规格数量和优惠", "注意", {
    confirmButtonText: "我已了解",
    autofocus: true,
    center: true,
    callback: (action: string) => {
      if (action === "confirm") {
        isEdit.value = true;
      }
    },
  });
};
// 保存订单信息
const saveOrdersItems = () => {
  const list: PushOrdersItemDTO[] = orderItems.value.map((p) => {
    return {
      skuId: p.skuId,
      quantity: p.quantity,
      shopId: p.shopId, // 店铺id
      couponId: p.couponId, // 优惠卷id
      activityId: p.activityId, // 活动id
    };
  });
  order.$patch({
    pushOrderItems: list,
  });
};

// -------------------- 其他 -----------------------

// 地址刷新
const reloadAddress = async () => {
  if (isLoadAddressList.value) return;
  isLoadAddressList.value = true;
  await address.resetRequestList(user.getToken);
  setTimeout(() => {
    isLoadAddressList.value = false;
  }, 300);
};
const title = computed(() => `${appName} - ${ordersTitle.value.banner}`);
useHead({
  title: title,
  meta: [
    {
      name: "description",
      content: title,
    },
  ],
});

const reload = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  await order.reloadOrderInfo(order.orderId);
  setTimeout(() => {
    ElMessage.success("刷新成功！");
    isLoading.value = false;
  }, 300);
};
// 返回
const toBack = () => {
  if (history) {
    history.length > 1 ? history.back() : navigateTo("/");
  } else {
    navigateTo("/");
  }
};
</script>
<template>
  <div>
    <NuxtLayout
      name="second"
      :header="false"
      :left-menu="false"
      :footer="false"
      :menu="['back', 'home', 'service']"
    >
      <ClientOnly>
        <div
          v-loading.fullscreen.lock="isLoading"
          class="layout-default-se min-h-100vh tracking-0.1em"
          v-if="user.isLogin && order.pushOrderItems.length > 0"
        >
          <!--------------- 头部 ---------------->
          <div class="group flex-row-bt-c mt-1rem mb-2rem select-none">
            <div class="flex items-center">
              <NuxtLink to="/">
                <el-image
                  loading="lazy"
                  src="/logo_title.png"
                  alt="Design by Kiwi2333 LOGO"
                  class="w-20vw md:w-10rem"
                />
              </NuxtLink>
              <ElDivider
                direction="vertical"
                style="border-width: 2px; border-radius: 10px; margin: 0 1.4rem"
              />
              <lazy-el-text
                flex
                style="font-weight: 700; font-size: 1.2rem"
                :type="ordersTitle.type || 'primary'"
              >
                {{ ordersTitle.banner }}
                <!-- 超时计时器 -->
                <div v-if="order.status === OrdersStatus.UN_PAID">
                  ，剩下
                  <OrderDelayTimer :date="new Date(order.orderInfo.createTime)" />
                </div>
              </lazy-el-text>
            </div>
            <div class="flex">
              <BtnReload
                class="md:opacity-0 group-hover:opacity-90"
                @reload="reload"
              />
              <BtnSwitch class="mr-0 md:opacity-0 group-hover:opacity-90" />
            </div>
          </div>
          <!--------------- 地址+状态 ---------------->
          <div
            v-loading="isLoadAddressList"
            class="v-card group opacity-90 border-default flex flex-col border-t-[var(--el-color-primary)] dark:border-t-[var(--el-color-primary)]"
            border-t="0.5rem solid "
            :style="{ borderTopColor: `var(--el-color-${ordersTitle.type})` }"
          >
            <!-- 订单-状态 -->
            <OrderStatusSteps
              class="mt-2"
              :active="order.status"
              :date="order.orderInfo.createTime"
              :color="ordersTitle.type"
              v-if="order.status > OrdersStatus.READY"
            />
            <!-- 选择-收货地址 -->
            <div
              class="address-list w-full flex flex-col"
              v-if="isUpdate"
            >
              <h4
                tracking-0.2em
                mb-2
              >
                收货地址：
                <i
                  @click="reloadAddress"
                  opacity-0
                  v-show="isUpdate"
                  group-hover:opacity-100
                  class="px-3 float-right hover:rotate-180 i-solar:refresh-outline cursor-pointer transition-300 bg-[var(--el-color-info)]"
                />
              </h4>
              <ElDivider
                style="margin: 0.7rem 0"
                opacity-40
              />
              <el-radio-group
                v-model="selectAddressId"
                :disabled="!isEdit"
              >
                <el-scrollbar>
                  <transition-group
                    name="item-list"
                    tag="div"
                    class="flex w-800px md:w-full pb-3"
                  >
                    <OrderAddressBoxSe
                      @click="updateAddressId(p.id)"
                      v-for="p in address.addressList"
                      :address="p"
                      :key="p.id"
                      class="overflow-hidden opacity-80 dark:opacity-70 transition-200 flex-shrink-0 w-220px"
                      :class="
                        p.id === selectAddressId
                          ? 'border-[var(--el-color-primary)] dark:border-[var(--el-color-primary)]'
                          : ''
                      "
                    >
                      <template #btns>
                        <!-- 选中 -->
                        <el-radio :label="p.id" />
                      </template>
                    </OrderAddressBoxSe>
                    <NuxtLink
                      :key="'/user/address'"
                      target="_blank"
                      to="/user/address"
                      class="flex-shrink-0 hover:scale-96 hover:border-solid flex-row-c-c cursor-pointer transition-300 mr-3 mt-2 w-240px min-h-160px p-3.4 relative border-default-dashed border-2px rounded-8px rounded-6px opacity-90 flex flex-col leading-1.2em group"
                    >
                      <ElIconCirclePlusFilled class="transition-300 w-4em h-4em opacity-40" />
                      <strong class="mt-2 opacity-40 transition-300">添加新地址</strong>
                    </NuxtLink>
                  </transition-group>
                </el-scrollbar>
              </el-radio-group>
            </div>
          </div>
          <!-- 订单-地址 -->
          <OrderAddressInfo
            v-show="order.status > OrdersStatus.READY"
            class="v-card border-default"
            :address="order.orderInfo"
          />
          <!-------------- 商品列表 -------------->
          <div class="v-card border-default order-item flex flex-col">
            <h4 mb-2>
              选购商品
              <el-text
                v-if="order.status === OrdersStatus.READY"
                @click="toEditGoods(order.status)"
                class="cursor-pointer ml-a float-right"
                plain
                :type="isEdit ? 'danger' : 'primary'"
                szie="small"
              >
                {{ isEdit ? "确定修改" : "修改" }}
              </el-text>
              <ElDivider
                style="margin: 0.7rem 0"
                opacity-40
              />
            </h4>
            <!-- 商品列表 -->
            <section
              v-for="p in orderItems"
              :key="p.id"
            >
              <CardOrderSku
                class="mb-3"
                :data="p"
                :disable="!isEdit"
              >
                <template #btn></template>
              </CardOrderSku>
            </section>
          </div>
          <!---------------- 优惠 ---------------->
          <section class="v-card border-default">
            <!-- 代金卷 -->
            <div class="flex-row-bt-c">
              <span>代金卷</span>
              <el-select
                :disabled="voucherList.length === 0 || !isEdit"
                :class="voucherList.length === 0 || !isEdit ? 'w-4.6rem' : 'w-1/5'"
                v-model="selectVoucherId"
                :placeholder="voucherList.length ? '选择代金卷' : '暂无代金卷'"
              >
                <el-option
                  v-for="p in voucherList"
                  :key="p"
                  :label="p"
                  :value="p"
                />
              </el-select>
            </div>
            <ElDivider
              class="opacity-40"
              style="margin: 0.8em 0"
            />
            <!-- 积分抵扣 -->
            <div
              class="flex-row-bt-c border-0"
              v-if="order.status === OrdersStatus.READY || order.status === OrdersStatus.UN_PAID"
            >
              <span>
                积分抵扣
                <small opacity-80>100积分低1元（每单上限10000积分）</small>
              </span>
              <!-- 积分选择 -->
              <OrderSelectPoints
                v-model="selectPointsVal"
                :getPointMax="getPointMax"
                :getFinalPrice="getFinalPrice"
                v-if="user.userWallet.points > 0"
              />
              <small
                opacity-40
                font-600
                v-else
              >
                暂无积分
              </small>
            </div>
          </section>
          <!---------------- 备注 ---------------->
          <section class="v-card border-default flex-row-bt-c">
            备注
            <div class="w-10rem md:w-14rem flex justify-end">
              <el-input
                v-if="order.status < OrdersStatus.DELIVERED"
                :disabled="!isUpdate"
                class="remark"
                type="textarea"
                rows="1"
                :minlength="0"
                :maxlength="40"
                v-model.lazy="remark"
                placeholder="给卖家的备注（选填）"
              />
              <small
                text-right
                v-else
              >
                {{ order.orderInfo.remark || "暂无备注" }}
              </small>
            </div>
          </section>
          <!---------------- 付款方式 ---------------->
          <section
            class="v-card border-default"
            v-if="order.orderInfo.status === OrdersStatus.UN_PAID"
          >
            <h4 tracking-0.2em>
              付款方式
              <ElDivider
                style="margin: 0.7rem 0"
                opacity-40
              />
              <el-radio-group
                :disable="!isUpdate || !isEdit"
                v-model="selectPayType"
                class="w-full pay-type-list"
                style="width: 100%"
              >
                <div
                  class="w-full my-2.4 flex-row-bt-c"
                  v-for="p in payTypeList"
                  :key="p.type"
                >
                  <div class="left flex items-center">
                    <span
                      v-html="p.icon"
                      class="w-2em mr-4 h-2em"
                    ></span>
                    <span>{{ p.title }}</span>
                  </div>
                  <el-radio
                    :label="p.type"
                    :disable="p.disable"
                    v-if="!p.disable"
                  />
                  <small
                    font-500
                    opacity-60
                    v-else
                  >
                    暂未开启
                  </small>
                </div>
              </el-radio-group>
            </h4>
          </section>
          <!---------------- 订单-信息 ---------------->
          <section
            v-if="order.status !== OrdersStatus.READY"
            class="v-card opacity-80 leading-2em border-default flex flex-col"
          >
            <h4 tracking-0.2em>
              订单信息
              <ElDivider
                style="margin: 0.7rem 0"
                opacity-40
              />
            </h4>
            <!-- 订单号 -->
            <small
              v-copying.toast="order.orderInfo.id"
              class="flex-row-bt-c w-full cursor-pointer"
            >
              订单号
              <span class="transition-300 hover:underline hover:text-[var(--el-color-info)]">
                {{ order.orderInfo.id }}
                <i
                  class="p-2 opacity-60"
                  i-solar:copy-outline
                />
              </span>
            </small>
            <!-- 支付时间 -->
            <small
              flex-row-bt-c
              w-full
              v-show="order.orderInfo.paidTime"
            >
              支付时间
              <span
                opacity-80
                style="font-family: Helvetica"
              >
                {{ order.orderInfo.paidTime }}
              </span>
            </small>
            <!-- 更新时间 -->
            <small
              flex-row-bt-c
              w-full
            >
              更新时间
              <span
                opacity-80
                style="font-family: Helvetica"
              >
                {{ order.orderInfo.updateTime }}
              </span>
            </small>
            <!-- 下单时间 -->
            <small
              flex-row-bt-c
              w-full
            >
              下单时间
              <span
                opacity-80
                style="font-family: Helvetica"
              >
                {{ order.orderInfo.createTime }}
              </span>
            </small>
          </section>
          <!---------------- 总计 ---------------->
          <!-- 视图 -->
          <section class="v-card leading-2em border-default flex flex-col">
            <h4 tracking-0.2em>金额明细</h4>
            <ElDivider
              style="margin: 0.6rem 0"
              opacity-40
            />
            <!-- 原价 -->
            <small class="opacity-80 flex-row-bt-c w-full">
              原总价
              <span>￥{{ getAllCoastPrice }}</span>
            </small>
            <!-- 运费 -->
            <small class="opacity-80 flex-row-bt-c w-full">
              运费
              <span>
                {{ getAllPostage.value > 0 ? "￥" + getAllPostage : "￥0.00" }}
              </span>
            </small>
            <!-- 代金卷 -->
            <small
              class="opacity-80 flex-row-bt-c w-full"
              v-show="selectVoucherId !== '' && order.status <= OrdersStatus.UN_PAID"
            >
              代金卷优惠
              <span>{{ voucherList.length ? selectVoucherId : 0 }}元</span>
            </small>
            <!-- 积分抵扣 -->
            <small
              class="opacity-80 flex-row-bt-c w-full"
              v-show="selectPointsVal > 0 && order.status <= OrdersStatus.UN_PAID"
            >
              积分抵扣
              <span class="text-[var(--el-color-error)]">
                -{{ "￥" + currency(selectPointsVal / 100) }}
              </span>
            </small>
            <!-- 减少 v-if=">OrdersStatus.PAID" -->
            <small
              v-if="getReduce"
              class="opacity-80 flex-row-bt-c w-full"
            >
              减少
              <span class="text-[var(--el-color-error)]">
                -{{
                  "￥" + currency(order.orderInfo.totalPrice).subtract(order.orderInfo.spendPrice)
                }}
              </span>
            </small>
            <ElDivider
              style="margin: 0.6rem 0"
              opacity-30
            />
            <!-- 总价 -->
            <div
              flex-row-bt-c
              w-full
            >
              总计
              <h3 class="text-[var(--el-color-error)] flex">
                ￥
                <strong block>
                  {{ getReduce ? currency(order.orderInfo.spendPrice) : getFinalPrice }}
                </strong>
              </h3>
            </div>
          </section>
          <!---------------- 提交 ---------------->
          <section class="v-card border-default flex-row-bt-c shadow-lg sticky bottom-6">
            <!-- 左侧菜单 -->
            <div class="menu">
              <el-text>
                <i
                  p-.8em
                  i-solar:dialog-2-broken
                  mr-2
                ></i>
                客服
              </el-text>
            </div>
            <!-- 左侧菜单 -->
            <div class="submit cursor-pointer">
              <!-- 取消订单 -->
              <el-button
                size="default"
                plain
                v-if="order.status === OrdersStatus.UN_PAID"
                @click="cancelOrder(order.orderId)"
              >
                取消订单
              </el-button>
              <!-- 删除订单 -->
              <el-button
                type="danger"
                plain
                v-if="
                  order.orderInfo.status === OrdersStatus.REFUND_SUCCESS ||
                  order.orderInfo.status === OrdersStatus.CANCELED ||
                  order.orderInfo.status === OrdersStatus.DELAY_CANCELED ||
                  order.orderInfo.status === OrdersStatus.COMMENTED
                "
                @click="deleteOrder(order.orderId)"
              >
                删除订单
              </el-button>
              <!-- 修改订单 -->
              <el-button
                size="default"
                :type="isUpdate ? 'danger' : ''"
                plain
                v-if="order.status === OrdersStatus.UN_PAID || order.status === OrdersStatus.PAID"
                @click="isUpdate = !isUpdate"
              >
                {{ isUpdate ? "取消修改" : "修改订单" }}
              </el-button>
              <!-- 申请退款 -->
              <el-button
                size="default"
                type="danger"
                plain
                v-if="
                  order.status === OrdersStatus.PAID ||
                  order.status === OrdersStatus.RECEIVED ||
                  order.status === OrdersStatus.DELIVERED
                "
                @click="pushRefundOrder(order.orderId)"
              >
                申请退款
              </el-button>
              <!-- 提交 -->
              <el-button
                @click="
                  isUpdate && order.status !== OrdersStatus.READY
                    ? updateOrder(order.orderInfo.id)
                    : onSubmitOrders(order.status)
                "
                size="default"
                shadow-md
                min-w-8em
                style="font-weight: 600"
                v-if="ordersTitle.submitText"
                :type="ordersTitle.btnType || 'primary'"
              >
                {{
                  isUpdate && order.status !== OrdersStatus.READY ? "确 认" : ordersTitle.submitText
                }}
              </el-button>
            </div>
          </section>
        </div>
        <div
          flex-row-c-c
          h-90vh
          w-full
          v-else
        >
          <el-empty description=" ">
            <h4
              font-500
              mb4
            >
              订单已删除或不存在
            </h4>
            <el-button
              @click="toBack"
              type="primary"
            >
              返 回
            </el-button>
          </el-empty>
        </div>
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss">
.address-list {
  :deep(.el-radio-group) {
    font-size: medium;
    .el-radio {
      position: absolute;
      right: 0;
      bottom: 0;
      .el-radio__input {
        opacity: 0;
      }
      .el-radio__label {
        display: none;
      }
      // 三角形
      &:after {
        content: "选中";
        opacity: 0;
        transition: 300;
        width: 2em;
        margin-left: 0.5em;
        font-size: 1em;
        background: var(--el-color-primary);
        color: #fff;
        width: 8em;
        height: 4em;
        line-height: 2.8em;
        box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        transform: rotate(-45deg) translate(25%, 52%);
      }
      &.is-checked:after {
        opacity: 100;
      }
    }
  }
}
// 选择框输入框
:deep(.el-input) {
  &.is-disabled {
    .el-input__wrapper:hover,
    .el-input__wrapper {
      background-color: transparent;
      padding: 0;
      box-shadow: none;
      .el-input__suffix-inner {
        display: none;
      }
    }
  }
}
// 备注
.remark {
  :deep(.el-textarea__inner) {
    box-shadow: none;
    &:focus,
    &:hover {
      box-shadow: none;
    }
    border-bottom: 1px solid var(--el-border-color);
    padding: 1px;
    background-color: transparent;
    border-radius: 0;
    &.is-disable {
      background-color: transparent;
    }
  }
}

.order-item :deep(.el-input.is-disabled) {
  .el-input__inner {
    color: black;
    font-weight: 600;
    -webkit-text-fill-color: black;
  }
}
.dark .order-item :deep(.el-input.is-disabled) {
  .el-input__inner {
    color: white;
    font-weight: 600;
    -webkit-text-fill-color: white;
  }
}

// 公共
.v-card {
  border-radius: 8px;
  margin-top: 1.2rem;
  padding: 1.2rem;
  background-color: white;
}
.dark .v-card {
  background-color: #111111e1;
}
.submit {
  :deep(.el-button) {
    transition: $transition-delay;
    padding: 1.15em 1.15em;
    font-size: 1rem;
    letter-spacing: 0.1em;
  }
}

.pay-type-list {
  :deep(.el-radio) {
    .el-radio__label {
      display: none;
    }
  }
}
</style>
