import type { AxiosPromise } from 'axios'
import { request } from '@/utils/request'
import type { Result } from '@/types/result'

/**
 * 获取活动列表
 */
export function getEventsList(): AxiosPromise<Result<EventVO[]>> {
  return request({
    method: 'get',
    url: '/event/list',
  }) as AxiosPromise<Result<EventVO[]>>
}
