// 路由中间件
export default defineNuxtRouteMiddleware((to, from) => {
  // // 权限页面
  // const store = useUserStore();
  // // 返回页面
  // if (store.token === "" && !store.isLogin) {
  //   if (from && from.fullPath !== to.fullPath) {
  //     clearError({ redirect: from.fullPath })
  //     navigateTo(from.fullPath);
  //   } else {
  //     navigateTo("/");
  //   }
  // }
})


