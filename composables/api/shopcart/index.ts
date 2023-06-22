import { Result, Sort, isTrue } from "@/types/result";
import { IPage } from "~/types";

/**
 * 获取购物车
 * @param page 
 * @param size 
 * @param token 
 * @returns 
 */
export function getUserShopCartPage(page: number, size: number, token: string) {
  return useHttp.get<Result<IPage<ShopcartVO[]>>>(`/user/cart/${page}/${size}`,
    {
      headers: {
        "Authorization": token
      }
    })
}
export interface ShopcartVO {
	id: string;
	skuId: string;
	goodsId: string;
	size: string;
	color: string;
	combo: string;
	stock: number;
	price: number;
	costPrice: number;
	image?: any;
	description?: any;
	quantity: number;
	activityId?: any;
	shopId?: any;
	createTime: string;
	updateTime: string;
}

/**
 * 用户添加购物车
 * @param dto 购物车DTO
 * @param token 
 * @returns 
 */
export function addShopcart(dto: ShopcartDTO, token: string) {
  return useHttp.post<Result<string>>("/user/cart/",
    { ...dto },
    {
      headers: {
        "Authorization": token
      }
    })
}
// 添加购物车DTO
export interface ShopcartDTO {
  skuId: string,
  quantity: number,
}