<script lang="ts" setup>
import { DeviceIpInfo } from "@/composables/api/user/safe";
const { data } = defineProps<{
  data: DeviceIpInfo;
}>();
</script>
<template>
  <div class="v-card flex flex-col leading-1.5em p-4 border-default-dashed border-2px rounded-8px">
    <small class="font-600 mb-1 flex-row-bt-c">
      {{ data.country && data.country !== "0" ? data.country : "未知" }}
      {{ data.province && data.province !== "0" ? data.province : "未知" }}
      {{ data.city && data.city !== "0" ? data.city : "未知" }}
      <el-tag
        type="info"
        size="small"
        v-if="data.isLocal"
        plain
      >
        本机
      </el-tag>
    </small>
    <small text-0.7em>IP：{{ data.ip }}</small>
    <small
      opacity-80
      text-0.7em
    >
      系统：{{ data.operatingSystem }}
    </small>
    <small
      opacity-80
      text-0.7em
    >
      浏览器：{{ data.browser }}
    </small>
    <small
      opacity-80
      text-0.7em
    >
      运营商：{{ data.operator }}
    </small>
    <div
      class="btns flex-row-bt-c mt-1 transition-300 opacity-100 md:opacity-0 group-hover:opacity-100"
    >
      <slot></slot>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
