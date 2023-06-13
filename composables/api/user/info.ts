import { AxiosPromise, AxiosResponse } from "axios";
import { request } from "@/utils/request";
import { Result } from "@/types/result";

/**
 * 账号密码登录
 * @param username 用户名/手机号/邮箱
 * @param password 密码
 * @returns promise
 */
export function toLoginByPwd(username: string, password: string):AxiosPromise<Result<string>> {
  return request({
    method: "POST",
    url: "/user/login/pwd",
    data: {
      username,
      password
    }
  }) as AxiosPromise<Result<string>>;
}

 


