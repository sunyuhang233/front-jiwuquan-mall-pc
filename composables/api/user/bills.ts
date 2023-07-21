import { IPage } from "types";
import { Result } from "types/result";

/**
 * 获取用户账单信息（分页）
 * @param token token
 * @returns UserWallet
 */
export function getBillsPage(page: number, size: number, dto: BillsDTO, token: string) {
  return useHttp.post<Result<IPage<BillsInfoVO>>>(`/user/bills/list/${page}/${size}`, {}, {
    headers: {
      "Authorization": token
    },
    body: {
      ...dto
    }
  })
}
// 分页筛选参数
export interface BillsDTO {
  currencyType?: number;
  endTime?: string;
  startTime?: string;
  id?: string;
  type?: number;
}
/**
 * 账单详情VO
 */
export interface BillsInfoVO {
  id: string;
  userId: string;
  ordersId: string;
  voucherId?: any;
  amount: number;
  title: string;
  type: number;
  currencyType: number;
  updateTime: string;
  createTime: string;
}


export function getBillsTotal(dto: BillsTotaDTO, token: string) {
  return useHttp.post<Result<BillsTotalVO>>(`/user/bills/total`, {}, {
    headers: {
      "Authorization": token
    },
    body: {
      ...dto
    }
  })
}
/**
 * 统计数据接口
 */
export interface BillsTotalVO {
  totalIn?: number,
  totalOut?: number,
}
// 账单参数
export interface BillsTotaDTO {
  /** 收支类型 0支出，1收入 */
  type?: BillsType;
  /** 货币类型 0金钱，1积分 */
  currencyType: CurrencyType;
  endTime?: string;
  startTime?: string;
}
/**
 * 账单类型
 */
export enum BillsType {
  /** 支出 */
  OUT = 0,
  /** 收入 */
  IN = 1,
}

/** 
 * 货币类型 
 * 0金钱
 * 1积分
 *  */
export enum CurrencyType {
  /** 0：金钱 */
  BALANCE = 0,
  /** 1：积分 */
  POINT = 1,
} 
