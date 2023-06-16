import { AxiosPromise } from "axios";
import { Result } from "@/types/result";
import { Gender, UserStatus } from "~/types";
/**
 * 获取用户个人信息
 * @param token token
 * @returns UserInfo
 */
export function getUserInfo(token: string): AxiosPromise<Result<UserInfo>> {
  return request({
    method: "GET",
    url: "/user/info",
    headers: {
      "Authorization": token
    }
  }) as AxiosPromise<Result<UserInfo>>;
}

export interface UserWallet {

}
export interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  nickname?: string;
  gender?: Gender;
  avatar?: string;
  birthday?: any;
  createTime?: string;
  updateTime?: string;
  lastLoginTime?: string;
  status?: UserStatus;
  isEmailVerified?: number;
  isPhoneVerified?: number;
}


/**
 * 用户修改头像
 * @param file 文件
 * @param token 
 * @returns 
 */
export function updateAvatar(file: FormData, token: string): AxiosPromise<Result<string>> {
  return request({
    method: "PUT",
    url: "/api/user/info/avatar",
    headers: {
      "Authorization": token
    },

  }) as AxiosPromise<Result<string>>;
}

/**
 * 修改密码（已登录）
 * @param dto 表单信息
 * @param token 用户身份
 * @returns 
 */
export function updatePwdByToken(dto: UpdatePwd, token: string): AxiosPromise<Result<string>> {
  return request({
    method: "PUT",
    url: "/user/info/pwd",
    headers: {
      "Authorization": token
    },
    data: dto

  }) as AxiosPromise<Result<string>>;
}


interface UpdatePwd {
  oldPassword: string,
  newPassword: string
}


/**
 * 修改密码（已登录）
 * @param dto 表单信息
 * @param token 用户身份
 * @returns 
 */
export function updateInfoByToken(dto: UpdateInfo, token: string): AxiosPromise<Result<string>> {
  return request({
    method: "PUT",
    url: "/user/info",
    headers: {
      "Authorization": token
    },
    data: dto
  }) as AxiosPromise<Result<string>>;
}

interface UpdateInfo {
  gender: Gender,
  nickname: string,
  birthday: Date,
}


