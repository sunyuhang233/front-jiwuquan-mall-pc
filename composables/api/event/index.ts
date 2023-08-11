import type { Result } from '@/types/result'
import { GoodsVO } from 'types/goods'
/**
 * 获取活动列表
 * @returns Result
 */
export function getEventsLists() {
  return useFetch<Result<EventVO[]>>(() => BaseUrl + "/event/list")
}
/**
 * 获取活动商品列表
 * @param eid 活动id
 * @returns 
 */
export function getEventsGoodsList(eid: string) {
  return useFetch<Result<EventGoodsVO[]>>(() => BaseUrl + `/event/goods/${eid}`)
}

/**
 * 获取活动详情和列表
 * @param eid 活动id
 * @returns 
 */
export function getEventsInfo(eid: string) {
  return useFetch<Result<EventInfoVO>>(() => BaseUrl + `/event/info/${eid}`)
}


export interface EventInfoVO {
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 活动详情
   */
  details: string;
  /**
   * 活动结束时间
   */
  endTime: string;
  /**
   * 活动ID
   */
  id: string;
  /**
   * 活动图片链接
   */
  images: string;
  /**
   * 活动级别
   * 权重值（正相关）
   */
  level: number;
  /**
   * 活动商品列表
   */
  list: EventGoodsVO[];
  /**
   * 活动开始时间
   */
  startTime: string;
  /**
   * 活动状态
   * 活动状态（0表示未开始，1表示正在进行，-1表示已结束）
   */
  status: number;
  /**
   * 活动标题
   */
  title: string;
  /**
   * 更新时间
   */
  updateTime: string;
}

/**
* 活动商品列表视图类
*
* EventGoodsVO
*/
export interface EventGoodsVO {
  categoryId: string;
  /**
   * 市
   */
  city: string;
  costPrice: number;
  createTime: string;
  description: string;
  /**
   * 区
   */
  district: string;
  eventId: string;
  /**
   * 活动价
   */
  eventPrice: number;
  goodsId: string;
  id: string;
  images: string;
  isNew: number;
  name: string;
  postage: number;
  price: number;
  /**
   * 省份
   */
  province: string;
  refundTime: number;
  /**
   * 销量
   */
  sales: number;
  updateTime: string;
  video: string;
  /**
   * 浏览量
   */
  views: number;
  warrantyTime: number;
}


