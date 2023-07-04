import { AxiosPromise } from "axios";
import { Result, isTrue } from "@/types/result";
import { Gender, UserStatus } from "~/types";
import { DeviceType } from ".";
/**
 * 获取用户个人信息
 * @param token token
 * @returns UserInfo
 */
export function getUserInfo(token: string) {
  return useHttp.get<Result<UserInfo>>(`/user/info`, {}, {
    headers: {
      "Authorization": token
    }
  })
}

export interface UserWallet {
  userId?: string;
  balance?: number;
  recharge?: number;
  spend?: number;
  points?: number;
  updateTime?: string;
  createTime?: string;
}
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phone: string;
  nickname: string;
  gender: Gender;
  avatar: string;
  birthday: string;
  createTime: string;
  updateTime: string;
  lastLoginTime: string;
  status: UserStatus;
  isEmailVerified: isTrue;
  isPhoneVerified: isTrue;
}


/**
 * 用户修改头像
 * @param file 文件
 * @param token 
 * @returns 
 */
export function updateAvatar(file: any, token: string): Promise<Result<string>> {
  return useHttp.put<Result<string>>(
    `/user/info/avatar`, {
  },
    {
      headers: {
        "Authorization": token
      },
      body: file
    })
}

/**
 * 修改密码
 * @param dto 表单信息
 * @param token 用户身份
 * @returns 
 */
export function updatePwdByToken(dto: UpdatePwd, token: string): Promise<Result<string>> {
  return useHttp.put<Result<string>>(
    `/user/info/pwd`,
    { ...dto },
    {
      headers: {
        "Authorization": token
      }
    })
}
interface UpdatePwd {
  oldPassword: string,
  newPassword: string
}


/**
 * 修改基本信息 
 * @param upUserInfo 表单信息
 * @param token 用户身份
 * @returns 
 */
export function updateInfoByToken(upUserInfo: UpdateInfo, token: string): Promise<Result<string>> {
  return useHttp.put<Result<string>>(
    `/user/info`,
    { ...upUserInfo },
    {
      headers: {
        "Authorization": token
      }
    })
}
interface UpdateInfo {
  gender: Gender,
  nickname: string,
  birthday: Date,
}

/**
 * 更换手机号
 * @param dto 手机号、验证码
 * @param token 
 * @returns 
 */
export function updatePhone(dto: UpdatePhone, token: string): Promise<Result<string>> {
  return useHttp.put<Result<string>>(
    `/user/info/phone`,
    { ...dto },
    {
      headers: {
        "Authorization": token
      }
    })
}
export interface UpdatePhone {
  newPhone: string,
  code: string
}

/**
 * 获取更换手机号|邮箱验证码
 * @param key 手机号|邮箱
 * @param type 0|1
 * @param token 
 * @returns 
 */
export function getUpdateNewCode(key: string, type: DeviceType, token: string): Promise<Result<string>> {
  return useHttp.get<Result<string>>(
    `/user/code/${key}`,
    { type },
    {
      headers: {
        "Authorization": token
      }
    })
}

/**
 * 更换邮箱
 * @param dto 邮箱参数
 * @param token 
 * @returns 
 */
export function updateEmail(dto: UpdateEmail, token: string): Promise<Result<string>> {
  return useHttp.put<Result<string>>(
    `/user/info`,
    { ...dto },
    {
      headers: {
        "Authorization": token
      }
    }
  )
}
export interface UpdateEmail {
  newEmail: string,
  code: string
}
/**
 * 验证-用户名是否存在
 * @param username 
 * @returns 
 */
export const checkUsernameExists = (username: string) => {
  return useHttp.get<Result<string>>(
    `/user/exist`,
    { username }
  )
}




