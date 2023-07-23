import { acceptHMRUpdate, defineStore } from 'pinia'
import { ShopcartVO, deleteShopcart, getUserShopCartPage } from '../api/shopcart';
import { IPage } from '~/types';
export const useShopStore = defineStore('shop', () => {

  // 购物车列表
  const shopcartList = ref<ShopcartVO[]>([]);
  // 刷新购物车
  const isRefalsh = ref<boolean>(false);

  watch(isRefalsh, (val: boolean) => {
    if (val) {
      addShopcartAction()
    }
  });

  // 分页器
  const isLoading = ref<boolean>(false);
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


  /**
   * 添加触发-重新加载
   */
  const addShopcartAction = (skuId?: string) => {
    let id = "";
    let index = -1;
    for (let i = 0; i < shopcartList.value.length; i++) {
      const p = shopcartList.value[i];
      if (p.skuId === skuId) {
        id = p.id
        index = i
        break;
      }
    }
    if (id !== '' && index !== -1) {
      shopcartList.value[index].quantity++
    } else {
      shopcartList.value.splice(0)
      page.value = 0
      size.value = 0
      pageInfo = toReactive({
        records: [],
        total: -1,
        pages: -1,
        size: -1,
        current: -1,
      })
      loadShopcartList()
    }
  }


  /**
   * 删除单个
   */
  const deleteShopCartById = async (shopCartId: string): Promise<boolean> => {
    const data = await deleteShopcart(shopCartId, useUserStore().getToken)
    if (data.code !== StatusCode.SUCCESS) {
      ElMessage.error("删除失败！")
      return Promise.reject(false);
    }
    // 本地删除
    for (let i = 0; i < shopcartList.value.length; i++) {
      const p = shopcartList.value[i];
      if (p.id === shopCartId) {
        shopcartList.value.splice(i, 1)
        break;
      }
    }
    return Promise.resolve(true);
  }

  /**
   * 批量删除
   */
  const deleteBatchShopCart = (ids: string[]): boolean => {
    for (let i = 0; i < shopcartList.value.length; i++) {
      const p = shopcartList.value[i];
      if (ids.includes(p.id)) {
        shopcartList.value.splice(i, 1)
      }
    }
    return true;
  }

  /**
   * 加载购物车
   */
  const loadShopcartList = async () => {
    const user = useUserStore()
    if (!user.isLogin) return;
    if (pageInfo.pages > 0 && shopcartList.value.length < pageInfo.total) {
      return;
    }
    isLoading.value = true
    page.value = 1;
    size.value = 8;
    const { data } = await getUserShopCartPage(page.value, size.value, user.getToken);
    pageInfo = reactive(data);
    if (data?.records?.length <= 0) return;
    shopcartList.value.push(...data.records);
    isRefalsh.value = false;
    isLoading.value = false
  };



  return {
    // state
    isRefalsh,
    shopcartList,
    pageInfo,
    page,
    size,
    // actions 
    deleteShopCartById,
    deleteBatchShopCart,
    loadShopcartList
    // getter 
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useShopStore, import.meta.hot))