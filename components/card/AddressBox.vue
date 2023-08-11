<script lang="ts" setup>
import { AddressInfoVO } from "~/composables/api/user/address";
const { address } = defineProps<{
  address: AddressInfoVO;
}>();
</script>
<template>
  <div
    cursor-pointer
    transition-300
    p-2
    md:p-4
    relative
    border-default
    border-2px
    rounded-8px
    hover:border="solid [var(--el-color-primary)]"
    hover:shadow="
		lg var(--el-color-primary)"
    dark:hover:border-gray-5
    shadow-sm
    rounded-6px
    class="group"
    :key="address.id"
    opacity-90
    flex
    flex-col
    leading-1.2em
  >
    <div
      flex-row-c-c
      justify-start
      font-600
      border-0
      border-default-dashed
      border-b-2px
      pb-2
      w-full
    >
      <p>{{ address.name }}</p>
      <el-tag
        class="absolute right-3"
        v-if="address.isDefault && address.isDefault === 1"
        plain
      >
        <span flex>
          默认
          <span
            hidden
            md:block
          >
            地址
          </span>
        </span>
      </el-tag>
    </div>
    <small pt-2>{{ address.phone }}</small>
    <div
      opacity-80
      mt-1
    >
      <small pr-1>{{ address.province }}</small>
      <small pr-1>{{ address.city }}</small>
      <small pr-1>{{ address.county }}</small>
    </div>
    <small class="truncate">{{ address.address }}</small>
    <small>邮编:{{ address.postalCode }}</small>
    <div class="btns flex-row-bt-c w-1/1 mt-a">
      <slot name="btns"></slot>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
