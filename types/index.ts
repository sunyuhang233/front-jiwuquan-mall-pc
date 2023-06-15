export interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  VITE_API_BASE_URL: string
}

export enum Sort {
  ASC = 0,
  DESC = 1,// 降序
}
export enum isTrue {
  TRUE = 1,
  FALESE = 0,
}

// 分页
export interface IPage<T> {
  records?: T[] | undefined,
  total?: number,
  pages?: number,
  size?: number,
  current?: number,
  orders?: [],
  optimizeCountSql?: boolean,
  searchCount?: boolean,
  maxLimit?: null,
  countId?: null,
}

// 性别
enum Gender {
  BOY = '男',
  GIRL = '女',
  DEFAULT = '保密',
}

// 状态
enum UserStatus {
  TRUE = "正常",
  FALESE = "禁用",
}

// 自定义响应状态码
export enum StatusCode {
  SUCCESS = 20000,// 20000操作成功
  INSERT_ERR = 20001,// 20001添加或已经存在， 增
  DELETE_ERR = 20002,// 20002被删或不存在， 删
  SELECT_ERR = 20003,// 20003查询不到，    查
  UPDATE_ERR = 20004,// 20004修改失败，    改
  LINK_NULL_ERR = 20005,// 20005链接元素不存在
  NULL_ERR = 40001,// 40001不能为空
  TOKEN_ERR = 40002,// 40002认证失败
  PARAM_ERR = 40003,// 40003参数错误
  BUSY_ERR = 40004,// 40004阻塞或被占用 繁忙
}