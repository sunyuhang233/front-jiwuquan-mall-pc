// 路由中间件
export default defineNuxtRouteMiddleware((to, from) => {
  const store = useUserStore()
  console.log(to.meta.isPermission);
  if (to.meta.isPermission) {
    
    // 返回页面
    if (store.token === "" || !store.isLogin)
      return navigateTo({ ...from })
  } else {
    return navigateTo({ ...from })
  }
})


