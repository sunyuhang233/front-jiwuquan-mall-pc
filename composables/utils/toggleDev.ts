// https://juejin.cn/post/7201099253498036279
export const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:9090/"
    } else {
        return "http://47.115.226.150:9090/"
    }
}
