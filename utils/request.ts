import type { Result } from "@/types/result";
import axios, { AxiosError, type AxiosResponse } from "axios";
export const baseUrl: string = import.meta.env.DEV ? "http://localhost:9090" : "http://47.115.226.150:9090"
export const baseUrlImg: string = "http://47.115.226.150:9090/res/image/"
export const baseUrlVideo: string = "http://47.115.226.150:9090/res/video/"
import { ElMessage } from "element-plus";
export const request = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json"
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
   * 20000操作成功
   * <p>
   * 20001添加或已经存在， 增
   * 20002被删或不存在， 删
   * 20003查询不到，    查
   * 20004修改失败，    改
   * 20005父元素不存在
   * 40001不能为空，
   * 40002认证失败
   * 40004阻塞或被占用 繁忙
   */
  (response: AxiosResponse): AxiosResponse => {
    const data = response.data as Result<any>;
    let msg: string = "";
    let type: string = "error";
    switch (+data.code) {
      case 20001:
        msg = "添加错误！";
        break;
      case 20002:
        msg = "删除目标不存在！";
        break;
      case 20003:
        msg = "查询为空！";
        type = "warn"
        break;
      case 20004:
        msg = "修改失败！";
        break;
      case 20005:
        msg = "删除的关联不存在！";
        break;
      default:
        break;
    }
    if (msg !== "") {
      // 组件
      ElMessage.error({
        type,
        message: msg,
      });
    }
    return response;
  },

  // 失败的回调
  (error: AxiosError): Promise<AxiosError> => {
    let msg: string = "";
    switch (error.response?.status) {
      case 403:
        msg = "抱歉，无权访问！";
        break;
      case 404:
        msg = "请求错误，路径不正确！";
        break;
      default:
        msg = "网络错误，请稍后再试！";
        break;
    }
    ElMessage.error({
      message: msg,
      type: "error",
    });

    return Promise.reject(error);
  }
);