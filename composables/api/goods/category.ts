import { AxiosPromise, AxiosResponse } from "axios";
import { Result } from "@/types/result";
import { request } from '@/utils/request';
/**
 * 获取分页商品列表
 * @returns 
 */
export function getGoodsCategoryList():AxiosPromise<Result<Category[]>> {
  return request({
    method: "GET",
    url: `/goods/category/list`,
  }) as AxiosPromise<Result<Category[]>>;
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