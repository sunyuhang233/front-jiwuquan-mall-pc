<script lang="ts" setup>
import {
  TimeType,
  getBillsTotalTable,
  BillsType,
  BillsTimeTotalVO,
  BillsTimeTotalDTO,
  CurrencyType,
} from "@/composables/api/user/bills";
// @ts-ignore 引入 vue-echarts 组件
import VChart, { THEME_KEY } from "vue-echarts";
provide(THEME_KEY, useColorMode());
const user = useUserStore();
// 参数
const dto = reactive<BillsTimeTotalDTO>({
  currencyType: CurrencyType.BALANCE,
  // type: null,
  timeType: TimeType.Day,
});
// 获取统计信息
const tableData = ref<BillsTimeTotalVO[]>([]);
const inData = computed(() => tableData.value.filter((p) => p.type === BillsType.IN));
const outData = computed(() => tableData.value.filter((p) => p.type === BillsType.OUT));
// 筛选
const timeTypeList = ref([
  { label: "按日", value: TimeType.Day },
  { label: "按月", value: TimeType.Month },
  { label: "按年", value: TimeType.Year },
]);
// echarts配置 图表数据
const option = ref({
  color: ["#0bdb85", "#fc3030"],
  title: {
    textStyle: {
      fontFamily: "Alimama",
    },
  },
  tooltip: { trigger: "axis" },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    boundaryGap: false,
    type: "category",
    data: computed(() => [...new Set(tableData.value.map((p) => p.time))]),
  },
  yAxis: {
    name: "金额（￥）",
    type: "value",
  },
  backgroundColor: "transparent",
  dataZoom: { type: "inside" },
  grid: {
    top: "14%",
    left: "9%",
    right: "9%",
    bottom: "9%",
    containLabel: false,
  },
  legend: {
    data: ["收入", "支出"],
  },
  series: [
    {
      name: "收入",
      data: computed(() => inData.value.map((p) => p.total)),
      type: "line",
      smooth: true,
      stack: "x",
    },
    {
      name: "支出",
      data: computed(() => outData.value.map((p) => p.total)),
      type: "line",
      smooth: true,
      stack: "x",
    },
  ],
});

// 加载
const isLoading = ref<boolean>(false);

/**
 * 重新加载
 */
const onReload = async () => {
  isLoading.value = true;
  tableData.value.splice(0);
  const { data, code } = await getBillsTotalTable({ ...dto }, user.getToken);
  // 懒加载
  let timer = setTimeout(() => {
    isLoading.value = false;
    if (code === StatusCode.SUCCESS) {
      tableData.value.push(...data);
    }
    clearTimeout(timer);
  }, 300);
};
onReload();
</script>
<template>
  <div class="relative rounded-14px transition-300 v-card shadow w-full h-full p-6 pt-5">
    <h3>
      <i
        i-solar:align-bottom-bold-duotone
        p-3
        mr-2
      />
      账单统计
    </h3>
    <!-- 排序 -->
    <div class="absolute right-4.6em mt-0.8em z-1">
      <el-select
        @change="onReload"
        v-model="dto.timeType"
        :placeholder="dto.timeType || '按日'"
        size="small"
        class="w-6em opacity-90 select"
      >
        <el-option
          v-for="p in timeTypeList"
          :key="p.value"
          :label="p.label"
          :value="p.value"
        />
      </el-select>
    </div>
    <!-- 表格 -->
    <VChart
      class="w-full h-full flex-row-c-c overflow-hidden rounded-12px"
      v-loading="isLoading"
      :option="option"
    />
  </div>
</template>
<style scoped lang="scss">
.select {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    .el-input__inner {
      color: var(--el-menu-text-color);
    }
  }
}
</style>
