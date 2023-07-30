import NProgress from "nprogress"
export default defineNuxtPlugin((nuxtApp) => {
  // https://juejin.cn/post/6917801127065550856
  // https://nuxt.com.cn/docs/guide/going-further/hooks#lifecycle-hooks
  // 页面开始时
  nuxtApp.hook('page:start', () => {
    NProgress.configure({
      easing: 'ease-in',
      speed: 300,
      trickleSpeed: 250,
      showSpinner: false,// 是否开启小加载圈 
    }).start();
  })
  // 完成
  nuxtApp.hook('page:finish', () => {
    NProgress.done()
  })
  nuxtApp.hook("app:error", () => {
    NProgress.done()
  })
  nuxtApp.hook("vue:error", () => {
    NProgress.done()
  })
})