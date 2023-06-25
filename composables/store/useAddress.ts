import { acceptHMRUpdate, defineStore } from 'pinia'
import { IPage } from '~/types';
import { AddressInfoVO, getAddressList } from '../api/user/address';
export const useAddresStore = defineStore('Addres', () => {

  // 地址信息列表
  const addressList = ref<AddressInfoVO[]>([]);

  // 重新获取
  const resetRequestList = async (token: string): Promise<boolean> => {
    const res = await getAddressList(token);
    addressList.value.splice(0)
    if (res.code === StatusCode.SUCCESS) {
      // 展示结果 
      let timer: NodeJS.Timeout | null;
      for await (const p of res.data) {
        await new Promise((resolve) => {
          timer = setTimeout(() => {
            addressList.value.push(p);
            clearTimeout(timer ?? undefined);
            timer = null;
            return resolve(true);
          }, 60);
        });
      }
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


if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAddresStore, import.meta.hot))
