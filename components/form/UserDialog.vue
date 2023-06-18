<template>
   <transition name="fadeInOutShadow">
      <div class="forms" @keyup.esc="exitForm" @click.self="exitForm"
         v-if="userStore.showLoginForm || userStore.showRegisterForm">
         <!-- 登录 -->
         <transition name="fade">
            <FormLoginForm v-show="userStore.showLoginForm" />
         </transition>
         <!-- 注册 -->
         <transition name="fade">
            <FormRegisterForm v-if="userStore.showRegisterForm" />
         </transition>
         <!-- 找回密码 -->
         <transition name="fade">
            <FormRegisterForm v-if="userStore.showUpdatePwd" />
         </transition>
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
   backdrop-filter: blur(4px);
   animation: 0.2s fadeIn $animate-cubic;
}

.fadeInOutShadow-leave-active {
   animation: 0.2s fadeOut $animate-cubic;
}

.animate__animated {
   animation-duration: 0.2s;
}
</style>
