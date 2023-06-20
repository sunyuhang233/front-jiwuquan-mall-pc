import { AxiosPromise } from "axios";
import { Result, isTrue } from "@/types/result";
/**
 * 获取分页商品列表
 * @returns 
 */
export function getGoodsSkuByGid(gid: string) {
  return useFetchUtil.get<Result<GoodsSku[]>>(`/goods/${gid}`);
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