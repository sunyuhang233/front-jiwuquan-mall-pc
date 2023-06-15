// https://blog.csdn.net/weixin_38838199/article/details/128200818
// https://juejin.cn/post/7216182763250581564
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$pinia.use(piniaPluginPersistedstate)
})