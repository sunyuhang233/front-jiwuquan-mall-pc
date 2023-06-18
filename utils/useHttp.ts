import { merge } from 'lodash'
type FetchType = typeof $fetch
type ReqType = Parameters<FetchType>[0]
type FetchOptions = Parameters<FetchType>[1]

export function httpRequest<T = unknown>(
  method: any,
  url: ReqType,
  bodyOrParams?: any,
  opts?: FetchOptions,
) {
  const store = useUserStore()
  let msg = ""
  const defaultOpts = {
    method,
    baseURL: '/api',
    headers: { token: store.token } as any,
    // 请求拦截器
    onRequest: (coinfig) => {
    },
    // 响应拦截器
    /**
      * @code 状态码：
      * 20000操作成功
      * <p>
      * 20001添加或已经存在， 增
      * 20002被删或不存在， 删
      * 20003查询不到，    查
      * 20004修改失败，    改
      * 20005链接元素不存在
      * 40001不能为空，
      * 40002认证失败
      * 40003参数错误
      * 40004阻塞或被占用 繁忙 
       */
    onResponse: (coinfig) => {
      const data = coinfig.response._data;
      let msg: string = "";
      let type: string = "error";
      switch (data.code) {
        case StatusCode.INSERT_ERR:
          msg = "添加失败！";
          break;
        case StatusCode.DELETE_ERR:
          msg = "该目标已不存在！";
          break;
        case StatusCode.SELECT_ERR:
          msg = "错误，查询失败！";
          type = "warn"
          break;
        case StatusCode.UPDATE_ERR:
          msg = "错误，修改失败！";
          break;
        case StatusCode.LINK_NULL_ERR:
          msg = "关联的内容不存在！";
          break;
        case StatusCode.NULL_ERR:
          msg = "错误，空值问题！";
          break;
        case StatusCode.TOKEN_ERR:
          msg = "身份验证失败！";
          break;
        case StatusCode.PARAM_ERR:
          msg = "传入参数错误！";
          break;
        case StatusCode.BUSY_ERR:
          msg = "服务器繁忙！";
          break;
        default:
          break;
      }
      if (msg !== "") {
        // 组件
        ElMessage.error({
          grouping:true,
          type,
          message: data.message,
        });
      }
    },
    // 请求错误
    onRequestError() {
      msg = '请求出错，请重试！'
    },
    // 不同响应码
    onResponseError({ response }) {
      switch (response.status) {
        case 400:
          msg = '参数错误';
          break
        case 401:
          msg = '没有访问权限';
          store.$patch({
            showLoginForm: true,
            showRegisterForm: false,
          })
          break
        case 403:
          msg = '服务器拒绝访问';
          break
        case 404:
          msg = '请求地址错误';
          break
        case 500:
          msg = '服务器故障';
          break
        default:
          msg = '网络连接故障';
          break
      }
      // 客户端报错
      ElMessage.error("服务器错误，请稍后重试！")
    },
  } as FetchOptions
  if (defaultOpts) {
    if (method === 'post')
      defaultOpts.body = bodyOrParams
    else if (method === 'delete')
      defaultOpts.params = bodyOrParams
    else
      defaultOpts.params = bodyOrParams
  }
  return $fetch<T>(url, merge(defaultOpts, opts))
}

export const useHttp = {
  post<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>('post', request, body, opts)
  },

  get<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>('get', request, body, opts)
  },


  deleted<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>('DELETE', request, body, opts)
  },


  put<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>('put', request, body, opts)
  },

}