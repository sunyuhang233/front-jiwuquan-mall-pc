import type { Result } from '@/types/result';
import type { ids } from '~/types';

/**
 * 获取商品是否收藏
 * @param gid 商品id
 * @param token token
 * @returns
 */
export function getGoodsIsCollect(gid: string, token: string) {
  return useHttp.get<Result<number>>(`/goods/action/collect/${gid}`, {}, {
    headers: {
      Authorization: token,
    },
  });
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
      Authorization: token,
    },
  });
}
export interface GoodsCollectVO {
  /**
   * 唯一标识
   */
  id: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 商品信息
   */
  goods: GoodsCollectItemVO
}

/**
* 商品信息
*/
export interface GoodsCollectItemVO {
  /**
   * 商品id
   */
  id: string
  /**
   * 原价
   */
  costPrice: number
  /**
   * 图片集
   */
  images: string | string[]
  /**
   * 是否新品
   */
  isNew: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 运费
   */
  postage?: number
  /**
   * 销售价
   */
  price: number
  /**
   * 视频
   */
  video?: string
  /**
   * 商品浏览量
   */
  views: number
}

/**
 * 获取收藏列表
 * @param token
 * @returns
 */
export function getGoodsCollectList(token: string) {
  return useHttp.get<Result<GoodsCollectVO[]>>('/goods/action/collect', {}, {
    headers: {
      Authorization: token,
    },
  });
}


/**
 * 取消商品收藏（批量）
 * @param ids
 * @param token
 * @returns
 */
export function deleteBatchGoodsCollectByIds(ids: ids, token: string) {
  return useHttp.deleted<Result<number>>('/goods/action/collect',
    { ids: [...ids] },
    {
      headers: {
        Authorization: token,
      },
    });
}
