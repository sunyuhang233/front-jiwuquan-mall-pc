import { AxiosPromise, AxiosResponse } from "axios";
import { request } from "@/utils/request";
import { Result } from "@/types/result";

/**
 * 账号密码登录
 * @param username 用户名/手机号/邮箱
 * @param password 密码
 * @returns promise
 */
export function toLoginByPwd(username: string, password: string): AxiosPromise<Result<string>> {
  return request({
    method: "POST",
    url: "/user/login/pwd",
    data: {
      username,
      password
    }
  }) as AxiosPromise<Result<string>>;
}


/**
 * 邮箱登录
 * @param email 邮箱
 * @param code 
 * @returns 
 */
export function toLoginByEmail(email: string, code: string): AxiosPromise<Result<string>> {
  return request({
    method: "POST",
    url: "/user/login/email",
    data: {
      email,
      code
    }
  });
}



/**
 * 登录-获取验证码
 * @param key 邮箱/手机号
 * @returns data
 */
export function getLoginEmailCode(key: string, type: DeviceType): AxiosPromise<Result<string>> {
  return request({
    method: "GET",
    url: `/user/login/code/${type}`,
    data: {
      key,
    }
  });
}

enum DeviceType {
  PHONE = 0,
  EMAIL = 1
}



/**
 * 注册-获取验证码
 * @param key 邮箱/手机号
 * @returns data
 */
export function getRegisterEmailCode(key: string, type: DeviceType): AxiosPromise<Result<string>> {
  return request({
    method: "GET",
    url: `/user/register/code/${type}`,
    data: {
      key,
    }
  });
}

/**
 * 退出当前设备登录
 * @param token 用户token
 * @returns Resutl
 */
export function toLogout(token: string): AxiosPromise<Result<string>> {
  return request({
    method: "DELETE",
    url: "/user/exit",
    headers: {
      Authorization: token
    }
  })
}


/**
 * 退出登录（全部设备）
 * @param token 用户token
 * @returns Resutl
 */
export function toLogoutAll(token: string): AxiosPromise<Result<string>> {
  return request({
    method: "DELETE",
    url: "/user/exit/all",
    headers: {
      Authorization: token
    }
  })
}



