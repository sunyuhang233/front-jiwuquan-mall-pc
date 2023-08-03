import { UseFetchOptions } from "nuxt/app";
import { StatusCode } from "~/types/result";
import { getBaseUrl } from "./toggleDev";

type Methods = "GET" | "POST" | "DELETE" | "PUT";
export const BaseUrl = getBaseUrl;
// 图片
export const BaseUrlImg = BaseUrl + "/res/image/";
export const BaseUrlVideo = BaseUrl + "/res/video/";
export const BaseUrlFile = BaseUrl + "/res/file/";
export const AuthKey = "Authorization";

export interface Result<T> {
  msg: string;
  code: StatusCode;
  data: T;
}

class useFetchUtil {
  request<T = any>(
    url: string,
    method: Methods,
    data: any,
    options?: UseFetchOptions<T>,
  ) {
    return new Promise<T>((resolve, reject) => {
      const newOptions: UseFetchOptions<T> = {
        baseURL: BaseUrl,
        method: method,
        ...options,
      };

      if (method === "GET" || method === "DELETE") {
        newOptions.params = data;
      }
      if (method === "POST" || method === "PUT") {
        newOptions.body = data;
      }

      useLazyFetch(url, newOptions)
    });
  }

  // 封装常用方法
  // https://juejin.cn/post/7246328828837838909
  get<T = any>(url: string, params?: any, options?: UseFetchOptions<T>) {
    return this.request<T>(url, "GET", params, options);
  }

  post<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
    return this.request<T>(url, "POST", data, options);
  }
  Put<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
    return this.request<T>(url, "PUT", data, options);
  }

  Delete<T = any>(url: string, params: any, options?: UseFetchOptions<T>) {
    return this.request<T>(url, "DELETE", params, options);
  }
}

export default new useFetchUtil();