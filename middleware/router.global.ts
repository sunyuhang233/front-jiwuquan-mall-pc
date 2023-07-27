const AuthRoute = [
  /\/user\/*/,
  /\/order\/*/,
  /\/shopcart\/*/,
]
// 路由中间件
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore();
  if (to.path !== "/" && AuthRoute.find(p => p.test(to.path))) {
    if (user.getToken === "") {
      user.showLoginForm = true
      //   return navigateTo("/")
    }
  }

})


