export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-loading', () => {
    console.log('loading ~~~')
  }, { global: true })
})