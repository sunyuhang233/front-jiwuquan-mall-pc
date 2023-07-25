import { acceptHMRUpdate, defineStore } from 'pinia'
import { ShopcartVO, deleteShopcart, getUserShopCartPage } from '../api/shopcart';
import { IPage } from '~/types';
export const useShopStore = defineStore('shop', () => {
  // 购物车列表
  const shopcartList = ref<ShopcartVO[]>([]);
  // 没有更多
  const notMore = computed(() => {
    return (
      pageInfo.value.pages > 0 &&
      pageInfo.value.current >= pageInfo.value.pages
    );
  });

  /**
   * 加载购物车
   */
  const loadShopcartList = async () => {
    const user = useUserStore()
    if (isLoading.value || notMore.value) return;
    page.value++
    isLoading.value = true;
    const { data } = await getUserShopCartPage(page.value, size.value, user.getToken);
    if (data) {
      pageInfo.value = toReactive({ ...data });
      shopcartList.value.push(...data.records);
      isLoading.value = false;
      return true;
    }
  };
  /**
   * 重新加载
   */
  const reLoadShopcartList = async () => {
    shopcartList.value.splice(0)
    page.value = 0
    size.value = 10
    pageInfo.value = {
      records: [],
      total: 0,
      pages: 0,
      size: size.value,
      current: 0,
    }
    await loadShopcartList()
  }



  // 分页器
  const isLoading = ref<boolean>(false);
  const page = ref<number>(0);
  const size = ref<number>(10);
  // 查询页信息
  const pageInfo = ref<IPage<ShopcartVO>>({
    records: [],
    total: 0,
    pages: 0,
    size: size.value,
    current: 1,
  });


  /**
   * 添加触发-重新加载
   */
  const addShopcartAction = async (skuId?: string) => {
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
    if (index !== -1 && id !== "") {
      shopcartList.value[index].quantity++
      return true
    } else {
      await reLoadShopcartList()
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
    return true;
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




  return {
    // state
    shopcartList,
    pageInfo,
    page,
    size,
    isLoading,
    // actions 
    deleteShopCartById,
    deleteBatchShopCart,
    loadShopcartList,
    reLoadShopcartList,
    addShopcartAction,
    // getter 
    notMore
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useShopStore, import.meta.hot))