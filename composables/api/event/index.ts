import type { Result } from '@/types/result'
import { GoodsVO } from '~/types/goods'; 
/**
 * 获取活动列表
 * @returns Result
 */
export function getEventsLists() {
  return useHttp.get<Result<EventVO[]>>("/api/event/list")
}
/**
 * 获取活动商品列表
 * @param eid 活动id
 * @returns 
 */
export function getEventsGoodsList(eid: string) {
  return useHttp.get<Result<GoodsVO[]>>(`/event/goods/${eid}`)
}

