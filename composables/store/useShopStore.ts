import { acceptHMRUpdate, defineStore } from 'pinia'
import { ShopcartVO } from '../api/shopcart';
import { IPage } from '~/types';
export const useShopStore = defineStore('shop', () => {

  // 购物车列表
  const shopcartList = ref<ShopcartVO[]>([]);


  // 分页器
  const page = ref<number>(0);
  const size = ref<number>(8);
  // 查询页信息
  let pageInfo = reactive<IPage<ShopcartVO>>({
    records: [],
    total: -1,
    pages: -1,
    size: -1,
    current: -1,
  });
  return {
    // state
    shopcartList,
    pageInfo,
    page,
    size,
    // actions 
    // getter 
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useShopStore, import.meta.hot))
