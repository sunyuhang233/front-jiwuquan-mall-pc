import type { NitroFetchRequest } from 'nitropack'
import type { FetchOptions, FetchResponse } from 'ofetch'
import type { UseFetchOptions } from 'nuxt/dist/app/composables/fetch'

const transFormResponse = ({ response }: any) => {
  // 处理后端携带了错误码响应的数据
  if (response._data && response._data.code)
    return Promise.reject(response._data)

  response._data = {
    ...response._data.data,
  }
}

/**
 * 封装$fetch用于简单请求场景
 * @param request
 * @param opts
 * @returns
 */
// export function useClientFetch(request: NitroFetchRequest, opts?: FetchOptions<any>) {
//   return $fetch<FetchResponse<any>>(request, {
//     onResponse: transFormResponse,
//     ...opts,
//   })
// }

/**
 * 抽离useFetch的通用配置
 * @param request
 * @param opts
 * @returns
 */
export const useFetchs = (request: NitroFetchRequest, opts?: UseFetchOptions<any>) => {
  return useFetch(request, {
    onResponse: transFormResponse,
    ...opts,
  })
}

/**
 * 实现更便捷的post请求
 * @param request
 * @param opts
 * @returns
 */
useFetchs.get = (request: NitroFetchRequest, opts?: UseFetchOptions<any>) => {
  return useFetchs(request, {
    method: 'get',
    ...opts,
  })
}

/**
 * 实现更便捷的post请求
 * @param request
 * @param opts
 * @returns
 */
useFetchs.post = (request: NitroFetchRequest, opts?: UseFetchOptions<any>) => {
  return useFetchs(request, {
    method: 'post',
    ...opts,
  })
}
