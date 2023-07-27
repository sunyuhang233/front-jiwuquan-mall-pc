import { Result, isTrue } from "@/types/result";

/**
 * 获取用户登录设备信息列表
 * @param token token
 * @returns 
 */
export function getLoginDeviceList(token: string) {
  return useHttp.get<Result<DeviceInfo[]>>("/user/device", {}, { headers: { "Authorization": token } });
}


/**
 * 用户下线
 * @param userAgent 
 * @param token 
 * @returns 
 */
export function toUserOffline(userAgent: string[], token: string) {
  return useHttp.deleted<Result<string>>("/user/device", { userAgent }, { headers: { "Authorization": token } });
}

// 设备信息
export interface DeviceInfo {
  ip: string;
  id: number;
  isLocal: isTrue;
  browser: string;
  userAgentString: string;
  operatingSystem: string;
  browserVersion: BrowserVersion;
}
// 浏览器信息
export interface BrowserVersion {
  version: string;
  majorVersion: string;
  minorVersion: string;
}


export function getDeviceIpInfo(ip: string) {
  return useHttp.get<Result<IpInfo>>(`http://47.115.226.150:9091/ip/info?ip=${ip}`);
}


export interface DeviceIpInfo {
  ip: string;
  id: number;
  isLocal: isTrue;
  browser: string;
  userAgentString: string;
  operatingSystem: string;
  browserVersion: BrowserVersion;
  region?: string;
  ioCount?: number;
  took?: number;
  country?: string;
  province?: string;
  city?: string;
  operator?: string;
  other?: string;
}

export interface IpInfo {
  region: string;
  ioCount: number;
  took: number;
  country: string;
  province: string;
  city: string;
  operator: string;
  other: string;
}