import { Result, Sort, isTrue } from "@/types/result";
import { IPage } from "~/types";

/**
 * 获取商品评价分页
 * @param page 页码
 * @param size 个数
 * @param gid 商品id
 * @returns 
 */
export function getGoodsCommentPage(page: number, size: number, gid: string) {
	return useFetch<Result<IPage<GoodsCommentsVO>>>(() => BaseUrl + `/goods/comments/${page}/${size}/${gid}`)
}

// 商品评价
export interface GoodsCommentsVO {
	id: string;
	avatar: string;
	nickName: string;
	skuId: string;
	isRecommend: number;
	isAnonymous: number;
	content: string;
	images: string | string[];
	video: string;
	rate: number;
	createTime: string;
	updateTime: string;
}


/**
 * 获取评价的子评价详情
 * @param cid 
 * @returns 
 */
export function getGoodsCommentDetail(cid: string) {
	return useFetch<Result<IPage<GoodsCommentsVO>>>(() => BaseUrl + `/goods/comments/${cid}`)
} 