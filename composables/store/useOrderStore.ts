import { acceptHMRUpdate, defineStore } from 'pinia'
import { PushOrdersItemDTO } from '../api/orders';
export const useOrderStore = defineStore('order', () => {
  // 下单对象数组
  const pushOrderItems = ref<PushOrdersItemDTO[]>([]);
  const clearOrderItems = () => {
    pushOrderItems.value.splice(0)
  }
  return {
    // state
    pushOrderItems,
    // actions  
    clearOrderItems,
    // getter 
  }
}, {
  persist: true,
})
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useOrderStore, import.meta.hot));
