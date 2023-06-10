import { AxiosPromise, AxiosResponse } from "axios";
import { request } from "../../../utils/request";
import { Result } from "../../../types/result";

/**
 * 账号密码登录
 * @param username 用户名/手机号/邮箱
 * @param password 密码
 * @returns promise
 */
export function getEventsList(): AxiosPromise<Result<EventVO[]>> {
  return request({
    method: "get",
    url: "/event/list",
  }) as AxiosPromise<Result<EventVO[]>>;
}

