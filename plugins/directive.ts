export default defineNuxtPlugin((nuxtApp) => {
  // https://nuxt.com.cn/docs/guide/directory-structure/plugins
  nuxtApp.vueApp.directive('focus', {
    mounted (el) {
      el.focus()
    },
    getSSRProps (binding, vnode) {
      // you can provide SSR-specific props here
      return {}
    }
  })
})