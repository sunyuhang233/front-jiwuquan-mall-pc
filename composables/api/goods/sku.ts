import { Result } from "~/types/result";

/**
 * 获取分页商品列表
 * @returns 
 */
export function getGoodsSkuByGid(gid: string) {
  return useFetch<Result<GoodsSkuVO[]>>(BaseUrl+`/goods/sku?gid=${gid}`);
}
export interface GoodsSkuVO {
	id: string;
	goodsId: string;
	size?: string;
	color?: string;
	combo?: string;
	stock: number;
	price: number;
	description?: string;
	costPrice: number;
	image: string;
	isShow: number;
	createTime: string;
	updateTime: string;
}