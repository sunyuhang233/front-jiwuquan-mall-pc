// 路由中间件
export default defineNuxtRouteMiddleware((to, from) => {

  // console.log(to, from);
  if (to.meta.isAuth) {
    // return navigateTo('/')
  } 
})


