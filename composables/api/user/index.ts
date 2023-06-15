import { AxiosPromise } from "axios";
import { Result } from "@/types/result";
import { isTrue } from "~/types";

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
 * 手机号登录
 * @param phone 邮箱
 * @param code 
 * @returns 
 */
export function toLoginByPhone(phone: string, code: string): AxiosPromise<Result<string>> {
  return request({
    method: "POST",
    url: "/user/login/phone",
    data: {
      phone,
      code
    }
  });
}



/**
 * 登录-获取验证码
 * @param key 邮箱/手机号
 * @returns data
 */
export function getLoginCodeByType(key: string, type: DeviceType): AxiosPromise<Result<string>> {
  return request({
    method: "GET",
    url: `/user/login/code/${key}`,
    params: {
      type,
    }
  });
}

export enum DeviceType {
  PHONE = 0,
  EMAIL = 1
}



/**
 * 注册-获取验证码
 * @param key 邮箱/手机号
 * @returns data
 */
export function getRegisterCode(key: string, type: DeviceType): AxiosPromise<Result<string>> {
  return request({
    method: "GET",
    url: `/user/register/code/${type}`,
    data: {
      key,
    }
  });
}


/**
 * 注册
 * @param dto 
 * @returns 
 */
export function toRegister(dto: RegisterUser): AxiosPromise<Result<string>> {
  return request({
    method: "POST",
    url: `/user/register`,
    data: dto
  }) as AxiosPromise<Result<string>>
}


export interface RegisterUser {
  username: string;
  password: string;
  code: string;
  email: string;
  type: isTrue;
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



