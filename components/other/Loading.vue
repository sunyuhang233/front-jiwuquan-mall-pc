<script lang="ts" setup>
import { appName } from "@/constants/index";
</script>
<template>
  <div
    class="flex-row-c-c w-100vw h-100vh bg-light dark:bg-dark z-1001 fixed top-0 left-0 overflow-hidden"
  >
    <h2
      flex-row-c-c
      animate-pulse
      class="tracking-3"
    >
      <img
        src="@/assets/images/logo/logo.png"
        class="w-2rem h-2rem mr-3"
      />
      {{ appName }}
    </h2>
  </div>
</template>
<style scoped lang="scss"></style>
