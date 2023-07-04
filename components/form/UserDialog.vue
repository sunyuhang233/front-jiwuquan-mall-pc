<template>
   <transition name="fadeInOutShadow">
      <div class="forms" @keyup.esc="exitForm" @click.self="exitForm"
         v-if="user.showLoginForm || user.showRegisterForm"
         relative>
         <!-- 登录 -->
         <transition name="fade-list">
            <FormLoginForm v-show="user.showLoginForm" />
         </transition>
         <!-- 注册 -->
         <transition name="fade-list">
            <FormRegisterForm v-if="user.showRegisterForm" />
         </transition>
         <!-- 找回密码 -->
         <transition name="fade-list">
            <FormRegisterForm v-if="user.showUpdatePwd" />
         </transition>
      </div>
   </transition>
</template>
<script lang="ts" setup>
const user = useUserStore()
const exitForm = () => {
   user.showLoginForm = false
   user.showRegisterForm = false
}
</script>
<style scoped lang="scss">
.forms {
   position: fixed;
   top: 0;
   left: 0;
   z-index: 1002;
   background-color: rgba(70, 70, 70, 0.3);
   backdrop-filter: blur(4px);
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
   animation: 0.2s fadeIn $animate-cubic;
}

.fadeInOutShadow-leave-active {
   animation: 0.2s fadeOut $animate-cubic;
}

.animate__animated {
   animation-duration: 0.2s;
}
</style>
