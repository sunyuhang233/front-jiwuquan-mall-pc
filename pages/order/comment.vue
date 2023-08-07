<script lang="ts" setup>
import { appName } from "~/constants";
useHead({
  title: `${appName} - 订单`,
  meta: [
    {
      name: "description",
      content: "极物圈 - 订单评价",
    },
  ],
});
const user = useUserStore();
</script>
<template>
  <div>
    <NuxtLayout
      name="second"
      :header="false"
      :left-menu="false"
      :footer="false"
      :menu="['back', 'service']"
    >
      <h3>{{ $route.query.id }}</h3>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss"></style>
