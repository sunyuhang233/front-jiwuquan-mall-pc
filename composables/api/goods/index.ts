import { Result, Sort, isTrue } from "@/types/result";
import { GoodsVO } from "~/types/goods";
import { IPage } from "~/types";
/**
 * 获取分页商品列表
 * @param page 页
 * @param size 个数
 * @param dto 查询参数
 * @returns 
 */
export function getGoodsListByPageLazy(page: number, size: number, dto: GoodsPageDTO) {
  return useFetch<Result<IPage<GoodsVO>>>(()=>BaseUrl + `/goods/list/${page}/${size}`, {
    method: "POST",
    body: { ...dto }
  })
}
// 客户端请求
export function getGoodsListByPage(page: number, size: number, dto: GoodsPageDTO) {
  return useHttp.post<Result<IPage<GoodsVO>>>(`/goods/list/${page}/${size}`,
    { ...dto })
}

/**商品分页参数类型 */
export interface GoodsPageDTO {
  cid?: string,
  name?: string,
  isPostage?: Sort,
  priceSort?: Sort,
  viewsSort?: Sort,
  saleSort?: Sort,
  isNew?: isTrue,
}


/**
 * 商品详细信息
 * @param gid 
 * @returns 
 */
export function getGoodsInfoById(gid: string) {
  return useFetch<Result<GoodsInfoVO>>(BaseUrl + `/goods/item/${gid}`);
}
export interface GoodsInfoVO {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  postage: number;
  categoryId: string;
  images?: string[];
  video: string;
  isNew: number;
  warrantyTime: number;
  refundTime: number;
  province: string;
  city: string;
  district: string;
}


