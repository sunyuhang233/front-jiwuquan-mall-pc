import { Result } from "@/types/result";
import { ids } from "~/types";
/**
 * 获取商品是否收藏
 * @param gid 商品id
 * @param token token
 * @returns 
 */
export function getGoodsIsCollect(gid: string, token: string) {
  return useHttp.get<Result<number>>(`/goods/action/collect/${gid}`, {}, {
    headers: {
      "Authorization": token
    }
  })
}

/**
 * 添加或者删除商品收藏
 * @param gid 商品id
 * @param token 
 * @returns 
 */
export function toggleGoodsCollectStatus(gid: string, token: string) {
  return useHttp.put<Result<number>>(`/goods/action/collect/${gid}`, {}, {
    headers: {
      "Authorization": token
    }
  })
}

/**
 * 获取收藏列表
 * @param token 
 * @returns 
 */
export function getGoodsCollectList(token: string) {
  return useHttp.get<Result<number>>(`/goods/action/collect`, {}, {
    headers: {
      "Authorization": token
    }
  })
}



/**
 * 取消商品收藏（批量）
 * @param token 
 * @returns 
 */
export function deleteBatchGoodsCollectByIds(ids: ids, token: string) {
  return useHttp.deleted<Result<number>>(`/goods/action/collect`,
    { ids: [...ids] },
    {
      headers: {
        "Authorization": token
      }
    })
} 