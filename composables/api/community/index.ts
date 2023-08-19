import type { Result } from '@/types/result'
/**
 * 获取活动列表
 * @returns Result
 */
export function getCommCategory() {
  return useFetch<Result<CommCategory[]>>(() => BaseUrl + "/community/category/list")
}
/**
 * 社区圈子分类表
 *
 * CommCategory
 */
export interface CommCategory {
  /**
   * 用于数据处理生成的子树
   */
  children?: CommCategory[];
  createTime?: string;
  id?: string;
  /**
   * 对应图标
   */
  image?: string;
  /**
   * 是否展示
   */
  isShow?: number;
  name?: string;
  /**
   * 父id
   */
  parentId?: string;
  /**
   * 权重
   */
  sortOrder?: number;
  updateTime?: string;
}