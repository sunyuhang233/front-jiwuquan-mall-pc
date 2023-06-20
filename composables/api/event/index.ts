import type { Result } from '@/types/result'
/**
 * 获取活动列表
 * @returns Result
 */
export function getEventsLists() {
  return useFetch<Result<EventVO[]>>(()=>BaseUrl+"/event/list")
}
/**
 * 获取活动商品列表
 * @param eid 活动id
 * @returns 
 */
export function getEventsGoodsList(eid: string) {
  return useFetch<Result<EventVO[]>>(()=>BaseUrl+"/event/list")
}

