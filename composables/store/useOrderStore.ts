import { acceptHMRUpdate, defineStore } from 'pinia'
import { IPage } from '~/types';
import { PushOrdersItemDTO } from '../api/orders';
export const useOrderStore = defineStore('order', () => {

  // 下单对象数组
  const pushOrderItems = ref<PushOrdersItemDTO[]>([]);

  return {
    // state
    pushOrderItems,
    
    // actions  
    // getter 
  }
})


if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useOrderStore, import.meta.hot))
