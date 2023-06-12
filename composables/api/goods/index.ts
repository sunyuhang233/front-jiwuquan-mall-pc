import { AxiosPromise, AxiosResponse } from "axios";
import { request } from "@/utils/request";
import { Result } from "@/types/result";

export function getGoodsListByPage(page: number, size: number, dto: GoodsPageDTO): AxiosPromise<Result<string>> {
  return request({
    method: "GET",
    url: `/goods/list/${page}/${size}`,
    data: dto
  }) as AxiosPromise<Result<string>>;
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

