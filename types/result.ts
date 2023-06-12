// 返回值定义
export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

enum Sort {
  ASC = 0,
  DESC = 1,// 降序
}
enum isTrue {
  TRUE = 1,
  FALESE = 0,
}