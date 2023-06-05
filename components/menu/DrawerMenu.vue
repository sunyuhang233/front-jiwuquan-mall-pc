<template>
  <!-- 菜单 -->
  <div class="menu-list" w-auto md:w-200px>
    <el-menu default-active="1">
      <!-- 首页 -->
      <el-menu-item index="1">
        <ElIconHomeFilled />
        <span class="title">首&emsp;页</span>
      </el-menu-item>
      <!-- 社区 -->
      <el-menu-item index="2">
        <ElIconSwitchFilled />
        <span class="title">社&emsp;区</span>
      </el-menu-item>
      <el-menu-item index="3">
        <ElIconGoodsFilled />
        <span>商品类别</span>
      </el-menu-item>
      <el-menu-item index="4">
        <ElIconSetting />
        <span>设置</span>
      </el-menu-item>
    </el-menu>

    <!-- 折叠按钮 -->
    <div @click="isFold = !isFold" class="collapse" bg-trueGray-2 dark:bg-indigo-5 dark:color-white p-2 border-4
      rounded-full>
      <ElIconArrowLeftBold v-show="!isFold" />
      <ElIconArrowRightBold v-show="isFold" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap"
let isFold = ref<boolean>(false)
watch(isFold,(v)=>{
  if (v) {
    gsap.to(".menu-list",{
      translateX:"-100%"
    })
  }else {
    gsap.to(".menu-list",{
      translateX:"0",
    })
  }
})
</script>

<style lang="scss" scoped> .menu-list {
   user-select: none;
   position: relative;
   height: calc(100vh - 1.4*$top-nav-height);
   transition: $transition-delay;


   // 菜单和项
   .el-menu {
     height: 100%;
     overflow: visible !important;

     .el-menu-item {
       width: calc(100% + 1px);
       overflow: hidden !important;
       border-right: 3px solid transparent;
       transition: 0.3s;
       padding: 10px 20px;

       svg {
         width: 1.4em;
         height: 1.4em;
         margin-right: 1em;
       }
     }


     .el-menu-item.is-active {
       transition: 0.3s;
       border-radius: 0 2px 2px 0px;
       background-color: var(--el-color-primary-light-9);
       border-right: 3px solid var(--el-color-primary);
     }
   }


   // 折叠按钮
   .collapse {
     position: absolute;
     bottom: 0;
     right: 0;
     cursor: pointer;
     width: 2.4em;
     height: 2.4em;
     display: flex;
     justify-content: flex-end;
     transform: translateX(50%);
   }

   .collapse.dark {
     background-color: var(--el-color-primary);
   }

 }
</style>
