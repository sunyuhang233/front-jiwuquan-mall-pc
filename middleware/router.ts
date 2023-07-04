// 路由中间件
export default defineNuxtRouteMiddleware((to, from) => {
  //  权限页面
  if (to.meta.isPermission || to.meta.isPermission === true) {
    const store = useUserStore()
    // 返回页面
    if (store.getToken === "" || !store.isLogin)
      if (from) {
        return navigateTo({ ...from })
      } else {
        return navigateTo("/")
      }
  } else {
    if (from) {
      return navigateTo({ ...from })
    } else {
      return navigateTo("/")
    }
  }
})


