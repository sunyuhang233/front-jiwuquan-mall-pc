const AuthRoute = [
  /^\/user\/*/,
  /^\/order\/*/,
  /^\/shopcart\/*/,
  /^\/order\/*/,
]
// 路由中间件
export default defineNuxtRouteMiddleware((to) => {
  const user = useUserStore();
  if (AuthRoute.find(p => p.test(to.path))) {
    if (user.getToken === "" || !user.isLogin) {
      user.showLoginForm = true
      abortNavigation()
    }
  }
})


