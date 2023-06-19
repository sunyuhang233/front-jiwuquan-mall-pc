import { Result } from "@/types/result"; 
/**
 * 获取分页商品列表
 * @returns 
 */
export function getGoodsCategoryList(): Promise<Result<Category[]>> {
  return useHttp.get("/goods/category/list")
}
export interface Category {
  id: string;
  name: string;
  parentId: string;
  icon?: any;
  sortOrder: number;
  isShow: number;
  createTime: string;
  updateTime: string;
  children: Category[];
}