
type FetchType = typeof $fetch
type ReqType = Parameters<FetchType>[0]
type FetchOptions = Parameters<FetchType>[1]

export function httpRequest<T = unknown>(
  method: any,
  url: ReqType,
  bodyOrParams?: any,
  opts?: FetchOptions,
) {
  let msg: string = "";
  const user = useUserStore();
  const defaultOpts = {
    method,
    baseURL: BaseUrl,
    headers: {} as { Authoriztion?: string },
    // 请求拦截器
    onRequest: (config) => {
      // 需要登录操作
      // @ts-expect-error
      if (config.options.headers?.Authorization !== undefined) {
        // @ts-expect-error
        if (config.options.headers?.Authorization === "") {
          // user?.$reset();
          user.showLoginForm = true;
        }
      }
    },
    // 响应拦截器
    // SUCCESS(20000, "操作成功"),
    // INSERT_ERR(20001, "添加或已经存在"),
    // DELETE_ERR(20002, "被删或不存在"),
    // SELECT_ERR(20003, "查询不到"),
    // UPDATE_ERR(20004, "修改失败"),
    // LINK_NULL_ERR(20005, "链接元素不存在"),
    // NULL_ERR(40001, "空值错误"),
    // TOKEN_ERR(40002, "认证失败"),
    // PARAM_ERR(40003, "参数错误"),
    // BUSY_ERR(40004, "阻塞或被占用繁忙");
    onResponse: (coinfig) => {
      const data = coinfig.response._data;
      let msg: string = "";
      const type: string = "error";
      switch (data.code) {
        case StatusCode.INSERT_ERR:
          msg = "错误，添加失败！";
          break;
        case StatusCode.DELETE_ERR:
          msg = "该目标已不存在！";
          break;
        // case StatusCode.SELECT_ERR:
        //   msg = "错误，查询失败！";
        //   type = "warn"
        //   break;
        case StatusCode.UPDATE_ERR:
          msg = "错误，修改失败！";
          break;
        case StatusCode.LINK_NULL_ERR:
          msg = "关联的内容不存在！";
          break;
        case StatusCode.NULL_ERR:
          msg = "请求失败，空值错误！";
          break;
        case StatusCode.TOKEN_ERR:
          msg = "身份验证失败！";
          user.showLoginForm = true;
          break;
        case StatusCode.PARAM_ERR:
          msg = "请求失败，参数错误！";
          break;
        case StatusCode.BUSY_ERR:
          msg = "服务器繁忙，请稍后重试！";
          break;
      }
      if (msg !== "") {
        // 组件
        ElMessage.error({
          grouping: true,
          type,
          message: data.message.length > 30 ? msg : data.message,
        });
      }
    },
    // 请求错误
    onRequestError() {
      msg = "请求出错，请重试！";
    },
    // 不同响应码
    onResponseError({ response }) {
      switch (response.status) {
        case 400:
          msg = "请求参数错误，请稍后重试！";
          break;
        case 401:
          msg = "没有权限，拒绝访问！";
          break;
        case 403:
          msg = "没有权限，拒绝访问！";
          break;
        case 404:
          msg = "请求地址错误！";
          break;
        case 500:
          msg = "服务器故障，稍后重试！";
          break;
      }
      // 客户端报错
      if (msg)
        ElMessage.error(msg);
    },
  } as FetchOptions;
  if (defaultOpts) {
    if (method === "post" || method === "put")
      defaultOpts.body = bodyOrParams;
    else if (method === "delete" || method === "get")
      defaultOpts.params = bodyOrParams;
    else
      defaultOpts.body = bodyOrParams;
  }
  return $fetch<T>(url, { ...defaultOpts, ...opts });
}

export const useHttp = {
  post<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>("post", request, body, opts);
  },

  get<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>("get", request, body, opts);
  },


  deleted<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>("DELETE", request, body, opts);
  },


  put<T = unknown>(
    request: ReqType,
    body?: any | null | object,
    opts?: FetchOptions,
  ) {
    return httpRequest<T>("put", request, body, opts);
  },

};
