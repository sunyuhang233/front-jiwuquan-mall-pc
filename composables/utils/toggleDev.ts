// https://juejin.cn/post/7201099253498036279

// eslint-disable-next-line n/prefer-global/process
export const getBaseUrl = process.env.NODE_ENV === "development"
  ? "http://127.0.0.1:9090/" // 开发环境
  : "http://47.115.226.150:9090/"; // 生产环境
