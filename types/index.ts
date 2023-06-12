interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  VITE_API_BASE_URL: string
}

enum Sort {
  ASC = 0,
  DESC = 1,// 降序
}
enum isTrue {
  TRUE = 1,
  FALESE = 0,
}

// 分页
interface IPage<T> {
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
