import { AxiosPromise } from "axios";
import { request } from "~/utils/request";
import { Result, isTrue } from "@/types/result";
/**
 * 获取分页商品列表
 * @returns 
 */
export function getGoodsSkuByGid(gid: string): AxiosPromise<Result<GoodsSku[]>> {
  return request({
    method: "GET",
    url: `/goods/sku/${gid}`,
  }) as AxiosPromise<Result<GoodsSku[]>>;
}
export interface GoodsSku {
  id: string;
  goodsId: string;
  size: string;
  color: string;
  combo: string;
  stock: number;// 库存
  price: number;
  description: string;
  costPrice: number;
  image: string;
  isShow: isTrue;
  createTime: string;
  updateTime: string;
}