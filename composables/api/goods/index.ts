import { AxiosPromise, AxiosResponse } from "axios";
import { request } from "@/utils/request";
import { Result } from "@/types/result";

export function getGoodsListByPage(page: number, size: number, dto: GoodsPageDTO) {
  return request({
    method: "POST",
    url: `/goods/list/${page}/${size}`,
    data: {...dto}
  }) as AxiosPromise<Result<IPage<GoodsVO>>>;
}
/**商品分页参数类型 */
interface GoodsPageDTO {
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
  }) as AxiosPromise<Result<Object>>;
}
interface GoodsInfoVO {
  
}


