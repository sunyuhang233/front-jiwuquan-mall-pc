import { Result, Sort, isTrue } from "@/types/result";
import { IPage } from "~/types";

/**
 * 获取订单列表(参数分页)
 * @param page 
 * @param size 
 * @param dto 
 * @param token
 * @returns 
 */
export function getOrderPageByDTO(status: OrdersStatus, page: number, size: number, dto: OrdersPageDTO, token: string) {
  return useHttp.post<Result<IPage<OrderInfoVO>>>(`/orders/${status}/${page}/${size}`, {
    ...dto
  }, {
    headers: {
      "Authorization": token
    }
  })
}

/**
 * 获取全部订单(分页)
 * @param page 
 * @param size 
 * @param token
 * @returns 
 */
export function getAllOrderPage(page: number, size: number, dto: OrdersPageDTO, token: string) {
  return useHttp.post<Result<IPage<OrderInfoVO>>>(`/orders/${page}/${size}`, {
    ...dto
  }, {
    headers: {
      "Authorization": token
    }
  })
}
// 订单列表信息
export interface OrderInfoVO {
  id: string;
  userId: string;
  status: number;
  name: string;
  province: string;
  city: string;
  county: string;
  address: string;
  postalCode: string;
  phone: string;
  remark: string;
  spendPrice: number;
  totalPrice: number;
  paidTime: string;
  createTime: string;
  updateTime: string;
  ordersItems: OrdersItemVO[];
}
// 订单子项
export interface OrdersItemVO {
  skuId: string;
  quantity: number;
  reducePrice: number;
  finalPrice: number;
  activityId?: string;
  shopId?: string;
  address?: string;
  goods: Good;
  goodsSku: GoodsSkuVO;
}
interface Good {
  id: string;
  name: string;
  description: string;
  postage: number;
}

interface GoodsSkuVO {
  id: string;
  image: string;
  size: string;
  color: string;
  combo: string;
  stock: number;
  price: number;
  costPrice: number;
}
// 订单分页参数
export interface OrdersPageDTO {
  id?: string,
  name?: string,
  shopId?: string,
  startTime?: string,
  endTime?: string
}

// 订单状态参数
export enum OrdersStatus {
  /** 未提交 */
  READY = -1,
  /** 待付款 */
  UN_PAID = 0,
  /** 已付款 */
  PAID = 1,
  /** 已发货 */
  DELIVERED = 2,
  /** 已收货 */
  RECEIVED = 3,
  /** 已评价 */
  COMMENTED = 4,
  /** 已取消 */
  CANCELED = 5,
  /** 已超时取消 */
  DELAY_CANCELED = 6,
  /** 发起退款 */
  REFUND = 7,
  /** 退款成功并取消 */
  REFUND_SUCCESS = 8,
}



/**
 * 获取订单详细信息
 * @param id 订单id
 * @returns 
 */
export function getOrdersInfoById(id: string, token: string) {
  return useHttp.get<Result<OrderInfoVO>>(`/orders/${id}`, {}, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 提交订单
 * @param addressId 
 * @param items 
 * @param remark 
 * @param token 
 * @returns 
 */
export function pushOrdersItems(addressId: string, items: PushOrdersItemDTO[], remark: string, token: string) {
  return useHttp.post<Result<UnpaidOrderVO>>(`/orders/`, {
    addressId,
    items: [...items],
    remark
  }, {
    headers: {
      "Authorization": token
    }
  })
}
export interface UnpaidOrderVO {
  orderId?: string,
  reducePrice?: number,
  finalPrice?: number,
}
// 添加订单类型
export interface PushOrdersDTO {
  addressId: string;
  items: PushOrdersItemDTO[];
  remark: string;
}
// 添加订单子项类型
export interface PushOrdersItemDTO {
  skuId: string;
  quantity: number;
  shopId?: string; // 店铺id
  couponId?: string;// 优惠卷id
  activityId?: string;// 活动id
}

/**
 * 修改订单
 * @param orderId 
 * @param addressId 
 * @param remark 
 * @param token 
 * @returns 
 */
export function updateOrders(orderId: string, addressId: string, remark: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/${orderId}`, {
    addressId,
    remark
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 支付订单
 * @param type 
 * @param points 
 * @param voucherId 
 * @param token 
 * @returns 
 */
export function payOrders(orderId: string, type: PayType, points: number, voucherId: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/pay/${orderId}`, {
    type,
    points,
    voucherId
  }, {
    headers: {
      "Authorization": token
    }
  })
}

export enum PayType {
  WEALLET = 0,
}
/**
 * 取消订单
 * @param id 
 * @param token 
 * @returns 
 */
export function cancelOrders(id: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/cancel/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 申请退款
 * @param id 
 * @param token 
 * @returns 
 */
export function refundOrders(id: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/refund/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 获取发货信息
 * @param id 
 * @param token 
 * @returns 
 */
export function getDelivertOrders(id: string, token: string) {
  return useHttp.get<Result<string>>(`/orders/delivery/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 确认收货
 * @param id 
 * @param token 
 * @returns 
 */
export function checkDeliveryOrders(id: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/delivery/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}



/**
 * 删除订单 
 * @param id 订单id
 * @param token 
 * @returns 
 */
export function deleteOrders(id: string, token: string) {
  return useHttp.deleted<Result<string>>(`/orders/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}

/**
 * 订单评论
 * @param dto OrderComment[]
 * @param token 
 * @returns 
 */
export function toOrdersComment(dto: OrderComment[], token: string) {
  return useHttp.post<Result<string>>(`/orders/comment`, {
    dto
  }, {
    headers: {
      "Authorization": token
    }
  })
}
export interface OrderComment {
  orderItemId: string,
  content: string,
  rate: 0,
  images: string,
  video: string,
  isRecommend: 0,
  isAnonymous: 0
}




