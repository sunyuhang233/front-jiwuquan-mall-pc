import { UseFetchOptions } from "nuxt/app"
import { _AsyncData } from "nuxt/dist/app/composables/asyncData"
import { Result } from "~/types/result"

const fetch = <T>(url: string, options?: any): Promise<T> => {
  const reqUrl = baseUrl + url
  return new Promise((resolve, reject) => {
    useFetch(reqUrl, { ...options }).then(({ data, error }: _AsyncData<any, any>) => {
      if (error.value) {
        reject(error.value)
        return
      }
      const value = data.value
      if (!value) {
        // 这里处理错误回调 
      } else if (value.code === StatusCode.TOKEN_ERR) {
        //用户未登录或登录过期
        ElMessage({
          message: value.msg,
          type: 'error',
        })
      } else {
        resolve(ref(value))
      }
    }).catch((err: any) => {
      reject(err)
    })
  })
}

export type HttpOption<T> = UseFetchOptions<Result<T>>

// 自动导出
export const useHttp = {
  get: <T>(url: string, params?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'get', params, ...option })
  },

  post: <T>(url: string, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'post', body, ...option })
  },

  put: <T>(url: string, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'put', body, ...option })
  },

  delete: <T>(url: string, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'delete', body, ...option })
  },
}