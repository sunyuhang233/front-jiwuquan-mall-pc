<template>
   <transition name="fadeInOutShadow">
      <div class="forms" @keyup.esc="exitForm" @click.self="exitForm" v-if="userStore.showLoginForm || userStore.showRegisterForm">
         <!-- 登录 -->
         <FormLoginForm v-show="userStore.showLoginForm" />
         <!-- 注册 -->
         <FormRegisterForm v-show="userStore.showRegisterForm" />
      </div>
   </transition>
</template>
<script lang="ts" setup>
const userStore = useUserStore()
const exitForm = () => {
   userStore.showLoginForm = false
   userStore.showRegisterForm = false
}
</script>
<style scoped lang="scss">
.forms {
   position: fixed;
   top: 0;
   left: 0;
   z-index: 1002;
   background-color: rgba(70, 70, 70, 0.3);
   backdrop-filter: blur(3px);
   width: 100vw;
   height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;

}

.dark .forms {
   background-color: rgba(20, 20, 20, 0.4);
}

// fade-in-out
.fadeInOutShadow-enter-active {
   filter: blur(4px);
   animation: 0.2s fadeIn $animate-cubic;
}

.fadeInOutShadow-leave-active {
   filter: blur(0px);
   animation: 0.2s fadeOut $animate-cubic;
}

.animate__animated {
   animation-duration: 0.3s;
}
</style>
