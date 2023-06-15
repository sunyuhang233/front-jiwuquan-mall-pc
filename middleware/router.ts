// 路由中间件
export default defineNuxtRouteMiddleware((to, from) => {
  const store = useUserStore()
  // console.log(to, from);
  if (to.meta.isPermission && store.token !== "" && store.isLogin) {

  } else {
    // 返回页面
    return navigateTo({ ...from })
  }
})


