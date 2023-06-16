import type { Result } from "@/types/result";
import axios, { AxiosError, type AxiosResponse } from "axios";
export const baseUrl: string = "http://47.115.226.150:9090"// 开发
// export const baseUrl: string = "http://localhost:9090"// 开发 
export const baseUrlImg: string = baseUrl + "/res/image/"
export const baseUrlVideo: string = baseUrl + "/res/video/"
import { ElMessage } from "element-plus";
import { StatusCode } from "@/types/result";
export const request = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
  },
  timeout: 20000,
});
// 1、请求拦截器
request.interceptors.request.use((coinfig) => {
  return coinfig;
});
// 2、响应拦截器
request.interceptors.response.use(
  // 成功的回调
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
  (response: AxiosResponse): AxiosResponse => {
    const data = response.data as Result<any>;
    let msg: string = "";
    let type: string = "error";
    switch (+data.code) {
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
        type,
        message: data.message,
      });
    }
    return response;
  },

  // 失败的回调
  (error: AxiosError): Promise<AxiosError> => {
    let msg: string = "";
    switch (error.response?.status) {
      case 401:
        msg = "抱歉，身份验证失败！";
        break;
      case 403:
        msg = "抱歉，禁止访问！";
        break;
      case 404:
        msg = "请求错误，路径不正确！";
        break;
      default:
        msg = "网络错误，请稍后再试！";
        break;
    }
    if (msg) {
      ElMessage.error({
        message: msg,
        type: "error",
      });
    }

    return Promise.reject(error);
  }
);