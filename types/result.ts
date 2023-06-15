// 返回值定义
export interface Result<T> {
  code: StatusCode;
  message: string;
  data: T;
}
export enum StatusCode {
  SUCCESS = 20000,
  INSERT_ERR = 20001,
  DELETE_ERR = 20002,
  SELECT_ERR = 20003,
  UPDATE_ERR = 20004,
  LINK_NULL_ERR = 20005,
  NULL_ERR = 40001,
  TOKEN_ERR = 40002,
  PARAM_ERR = 40003,
  BUSY_ERR = 40004,
}

enum Sort {
  ASC = 0,
  DESC = 1,// 降序
}
enum isTrue {
  TRUE = 1,
  FALESE = 0,
}