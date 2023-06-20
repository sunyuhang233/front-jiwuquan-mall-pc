import { Result } from "@/types/result"; 
/**
 * 获取全部分类列表
 * @returns 
 */
export function getGoodsCategoryList() {
  return useFetch<Result<CategoryVO[]>>(BaseUrl+"/goods/category/list")
}
export interface CategoryVO {
  id: string;
  name: string;
  parentId: string;
  icon?: any;
  sortOrder: number;
  isShow: number;
  createTime: string;
  updateTime: string;
  children?: CategoryVO[];
}
