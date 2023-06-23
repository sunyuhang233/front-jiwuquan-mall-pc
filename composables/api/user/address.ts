import { Result } from "@/types/result";

/**
 * 获取用户地址列表
 * @param token token
 * @returns 
 */
export function getAddressList(token: string) {
  return useHttp.get<Result<AddressInfoVO[]>>("/user/address", {}, { headers: { "Authorization": token } });
}
// 地址信息
export interface AddressInfoVO {
  id: string;
  name: string;
  userId: string;
  isDefault: number;
  province: string;
  city: string;
  county: string;
  address: string;
  postalCode: string;
  phone: string;
  createTime: string;
  updateTime: string;
}


/**
 * 添加收货地址
 * @param dto 
 * @param token 
 * @returns 
 */
export function addAddressByDto(dto: AddressDTO, token: string) {
  return useHttp.post<Result<AddressInfoVO[]>>("/user/address", {}, { headers: { "Authorization": token } });
}

// 添加收货地址参数
export interface AddressDTO {
  name: string,
  phone: string,
  isDefault: 0,// 是否默认
  province: string,
  city: string,
  county: string,
  address: string,
  postalCode: string
}

/**
 * 更新用户id
 * @param addressId 地址id
 * @param dto 
 * @param token 
 * @returns 
 */
export function updateAddressById(addressId: string, dto: AddressDTO, token: string) {
  return useHttp.post<Result<string>>(`/user/address/${addressId}`, {}, { headers: { "Authorization": token } });
}


