import { acceptHMRUpdate, defineStore } from 'pinia'
import { AddressInfoVO, getAddressList } from '../api/user/address';
export const useAddressStore = defineStore('address', () => {
  // 地址信息列表
  const addressList = ref<AddressInfoVO[]>([]);
  // 重新获取
  const resetRequestList = async (token: string): Promise<boolean> => {
    const res = await getAddressList(token);
    if (res.code === StatusCode.SUCCESS) {
      addressList.value = res.data.sort((a, b) => b.isDefault - a.isDefault);
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }
  return {
    // state
    addressList,
    // actions  
    resetRequestList,
    // getter 
  }
})
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAddressStore, import.meta.hot));
