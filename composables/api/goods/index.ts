import { AxiosPromise, AxiosResponse } from "axios";
import { Result } from "@/types/result";
import { request } from '@/utils/request';
/**
 * 获取分页商品列表
 * @param page 页
 * @param size 个数
 * @param dto 查询参数
 * @returns 
 */
export function getGoodsListByPage(page: number, size: number, dto: GoodsPageDTO) {
  return request({
    method: "POST",
    url: `/goods/list/${page}/${size}`,
    data: {...dto}
  }) as AxiosPromise<Result<IPage<GoodsVO>>>;
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
export function getGoodsInfoById(gid:string) {
  return request({
    method: "GET",
    url: `/goods/${gid}`,
  }) as AxiosPromise<Result<GoodsInfoVO>>;
}
export interface GoodsInfoVO {
  
}


