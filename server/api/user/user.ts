import {  AxiosPromise, AxiosResponse } from "axios";
import { request } from "../../../utils/request";
import { Result } from "../../../types/result";

/**
 * 账号密码登录
 * @param username 用户名/手机号/邮箱
 * @param password 密码
 * @returns promise
 */
export function toLoginByPwd(username:string, password:string) {
  return request({
    method:"POST",
    url:"/user/login/pwd",
    data:{
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
export function toLoginByEmail(email:string,code:string) {
  return request({
    method:"POST",
    url:"/user/login/email",
    data:{
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
export function getLoginEmailCode(key:string,type:number) {
  return request({
    method:"POST",
    url:"/user/login/code",
    data:{
      key,
    }
  });
}