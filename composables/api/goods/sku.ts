import { Result } from "~/types/result";
/**
 * 获取商品规格
 * @returns 
 */
export function getGoodsSkuByGid(gid: string) {
	return useFetch<Result<GoodsSkuVO[]>>(BaseUrl + `/goods/sku?gid=${gid}`);
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
export interface GoodsSkuMdVO {
	id: string;
	name: string;
	postage: number;
	goodsId: string;
	size: string;
	color: string;
	combo?: any;
	stock: number;
	price: number;
	description: string;
	costPrice: number;
	image: string;
	createTime: string;
	updateTime: string;
}


/**
 * 获取规格信息ids + 商品名 邮费
 * @param ids 
 * @returns 
 */
export function getGoodsSkuByIds(ids: string[]) {
	return useHttp.post<Result<GoodsSkuMdVO[]>>(`/goods/sku`, {
		ids: [...ids]
	});
} 