import { Result, Sort, isTrue } from "@/types/result";
import { IPage } from "~/types";

/**
 * 获取商品评价分页
 * @param page 页码
 * @param size 个数
 * @param gid 商品id
 * @returns 
 */
export function getGoodsCommentPage(page: number, size: number, gid: string){
  return useFetch<Result<IPage<GoodsComments>>>(()=>BaseUrl + `/goods/comments/${page}/${size}/${gid}`)
} 

// 商品评价
export interface GoodsComments {
	id: string;
	nickName: string;
	skuId: string;
	isRecommend: number;
	isAnonymous: number;
	content: string;
	images: string;
	video: string;
	rate: number;
	createTime: string;
	updateTime: string;
}