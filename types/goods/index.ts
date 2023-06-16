import { isTrue } from "..";

// 简约商品视图对象
export interface GoodsVO {
  categoryId: string,
  city: string,
  costPrice: number,
  createTime: string,
  description: string,
  district: null,
  id: string,
  images: string | string[],
  isNew: isTrue,
  isShow: isTrue,
  name: string,
  postage: number,
  price: number,
  province: string,
  refundTime: number,
  sales: number,
  updateTime: string,
  video: string,
  views: number,
  warrantyTime: number
}