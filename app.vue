<script setup lang="ts">
import { appName } from '@/constants/index'
useHead({
  title: appName,
})
const app = useNuxtApp()
app.hook("app:mounted", () => {
  const store = useUserStore()
  if (store.isLogin) {
    store.onCheckLogin()
  }
})
useAsyncData(async() => {
  // 当对象进入窗体可视范围 IntersectionObserver
  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.add('animate')
        observer.unobserve(item.target)
      }
    })
  })
  // 观察者：组件动画
  let observerAnimate = new IntersectionObserver((entries, observer) => {
    entries.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.add('animateStart')
        observer.unobserve(item.target)
      }
    })
  })
  setMarks(['.mark1', '.mark2', '.mark3'])
  // 进入视野加载动画
  document.querySelectorAll('.animatejs').forEach(item => {
    observerAnimate.observe(item)
  })
  // 添加监测对象
  function setMarks(classNames: string[]) {
    classNames.forEach(name => {
      document.querySelectorAll(name).forEach(mark => {
        observer.observe(mark)
      })
    });
  }
})
</script>
<!-- html  -->
<template>
  <!-- 处理错误 -->
  <FormUserDialog />
  <NuxtPage />
</template>
<style> 
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.3rem);
  transform: scale(0.99);
  animation: cubic-bezier(0.1, 0.7, 1, 1);
}

</style>
