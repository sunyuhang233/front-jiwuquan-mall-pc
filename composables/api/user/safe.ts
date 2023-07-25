import { Result, isTrue } from "@/types/result";

/**
 * 获取用户登录设备信息列表
 * @param token token
 * @returns 
 */
export function getLoginDeviceList(token: string) {
  return useHttp.get<Result<DeviceInfo[]>>("/user/info/device", {}, { headers: { "Authorization": token } });
}

// 设备信息
export interface DeviceInfo {
  ip: string;
  operatingSystem: string;
  browser: string;
  id: number;
  browserVersion: BrowserVersion;
}
// 浏览器信息
export interface BrowserVersion {
  version: string;
  majorVersion: string;
  minorVersion: string;
}