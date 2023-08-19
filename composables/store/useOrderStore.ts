import { acceptHMRUpdate, defineStore } from 'pinia'
import { OrderInfoVO, OrdersStatus, PushOrdersItemDTO, UnpaidOrderVO } from '../api/orders';
import currency from 'currency.js';
export const useOrderStore = defineStore('order', () => {
  // 订单信息
  const orderInfo = ref<OrderInfoVO>({
    id: "",
    userId: "",
    status: OrdersStatus.READY,
    name: "",
    province: "",
    city: "",
    county: "",
    address: "",
    postalCode: "",
    phone: "",
    remark: "",
    spendPrice: 0,
    totalPrice: 0,
    paidTime: "",
    createTime: "",
    updateTime: "",
    ordersItems: []
  })
  // 订单信息
  const orderId = ref<string>("")
  const addressId = ref<string>("")
  const unPaidVO = ref<UnpaidOrderVO>({})
  // 订单状态
  const status = ref<OrdersStatus>(OrdersStatus.READY)
  // 下单对象数组
  const pushOrderItems = ref<PushOrdersItemDTO[]>([]);

  // 主要：提交订单可按需修改
  watch(orderId, async (val) => {
    if (!val) return
    await reloadOrderInfo()
  }, { immediate: true, deep: true })


  /**
   * 重新加订单
   * @param id 订单id
   * @returns 
   */
  const reloadOrderInfo = async (id?: string) => {
    if (!id && orderId.value === "") return
    const { data, code } = await getOrdersInfoById(id || orderId.value, useUserStore().getToken);
    if (code === StatusCode.SUCCESS) {
      orderInfo.value = data;
      orderId.value = data?.id
      status.value = data.status;
      unPaidVO.value.reducePrice = currency(data.totalPrice).subtract(data.spendPrice).value
      unPaidVO.value.finalPrice = data.spendPrice
    } else {
      clearOrderItems();
    }
  }


  /**
   * 重置订单
   */
  const clearOrderItems = () => {
    orderId.value = ""
    addressId.value = ""
    status.value = OrdersStatus.READY
    orderInfo.value = {
      id: "",
      userId: "",
      status: OrdersStatus.READY,
      name: "",
      province: "",
      city: "",
      county: "",
      address: "",
      postalCode: "",
      phone: "",
      remark: "",
      spendPrice: 0,
      totalPrice: 0,
      paidTime: "",
      createTime: "",
      updateTime: "",
      ordersItems: []
    }
    unPaidVO.value = {}
    pushOrderItems.value.splice(0)
  }

  return {
    // state
    orderInfo,
    orderId,
    status,
    addressId,
    pushOrderItems,
    unPaidVO,
    // actions  
    clearOrderItems,
    reloadOrderInfo
    // getter 
  }
}, {
  persist: true,
})
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useOrderStore, import.meta.hot));
