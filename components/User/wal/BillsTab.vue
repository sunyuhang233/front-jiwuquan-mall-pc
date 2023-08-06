<script lang="ts" setup>
import { BillsInfoVO, getBillsPage } from "@/composables/api/user/bills";
import type { CalendarDateType, CalendarInstance } from "element-plus";
import { IPage } from "types";
// 数据
const user = useUserStore();
const selectDay = ref<Date>(new Date());
const selectDayFormat = computed(() => {
  return useDateFormat(selectDay.value, "YYYY年M月DD日").value;
});
// 选中的月份开始和结束时间
const monthStartEndStr = computed((): string[] => {
  return getMonthStartEnd(selectDay.value).map(
    (p) => useDateFormat(p, "YYYY-MM-DD HH:mm:ss").value
  );
});
const dayStartEndStr = computed((): string[] => {
  const date = new Date(selectDay.value.getTime());
  date.setHours(0, 0, 0, 0);
  return [
    useDateFormat(date, "YYYY-MM-DD HH:mm:ss").value,
    useDateFormat(date.setDate(date.getDate() + 1), "YYYY-MM-DD HH:mm:ss").value,
  ];
});

// 实例
const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
};
// 筛选
const opt = reactive({
  isNowDay: false,
});

// 账单数据分页
const isLoading = ref<boolean>(false);
const isRefresh = ref<boolean>(false);
const page = ref<number>(0);
const size = ref<number>(6);
const billsList = ref<BillsInfoVO[]>([]);
const billsPage = ref<IPage<BillsInfoVO>>({
  records: [],
  total: -1,
  pages: -1,
  size: -1,
  current: -1,
});

const dto = computed(() => {
  return opt.isNowDay
    ? { startTime: dayStartEndStr.value[0], endTime: dayStartEndStr.value[1] }
    : { startTime: monthStartEndStr.value[0], endTime: monthStartEndStr.value[1] };
});
/**
 * 请求api
 */
const getBillsPageApi = async () => {
  if (noMore.value) {
    return;
  }
  isLoading.value = true;
  // 1、页数+1
  page.value++;
  // 2、请求
  const { data, code } = await getBillsPage(
    page.value,
    size.value,
    { ...dto.value },
    user.getToken
  );
  isLoading.value = false;
  // 3、结果
  if (code === StatusCode.SUCCESS) {
    billsPage.value = { ...data };
    billsList.value.push(...data.records);
  }
};
// 重新加载
const reloadBills = async () => {
  isRefresh.value = true;
  billsList.value.splice(0);
  billsPage.value = {
    records: [],
    total: -1,
    pages: -1,
    size: -1,
    current: -1,
  };
  size.value = 6;
  page.value = 0;
  await getBillsPageApi();
  setTimeout(() => {
    isRefresh.value = false;
  }, 400);
};
const noMore = computed(() => {
  return billsPage.value.total === 0 || billsList.value.length === billsPage.value.total;
});
watch(selectDay, (val) => {
  if (isLoading.value) {
    return;
  }
  page.value = -1;
  reloadBills();
});
watch(
  opt,
  () => {
    if (isLoading.value) {
      return;
    }
    page.value = -1;
    reloadBills();
  },
  { deep: true }
);
</script>
<template>
  <div class="bills-tabs shadow p-5 border-none grid grid-cols-1 rounded-14px v-card">
    <div class="top">
      <!-- 头部 -->
      <h3
        text-center
        mb-2
      >
        账 单
      </h3>
      <!-- 日历 -->
      <div
        class="select-none caledar shadow-sm dark:shadow dark:bg-dark-5 dark:opacity-90 rounded-12px"
      >
        <el-calendar
          v-model="selectDay"
          ref="calendar"
        >
          <template #header="{ date }">
            <div class="flex-row-bt-c w-full cursor-pointer">
              <i
                class="i-solar:alt-arrow-left-line-duotone p-3 hover:scale-110"
                @click="selectDate('prev-month')"
              />
              <h3
                text-center
                w-full
                mt-1
              >
                {{ selectDayFormat }}
              </h3>
              <i
                class="i-solar:alt-arrow-right-line-duotone p-3 hover:scale-110"
                @click="selectDate('next-month')"
              />
            </div>
          </template>
        </el-calendar>
      </div>
    </div>
    <!-- 账单列表 -->
    <div
      clas="bottom overflow-hidden rounded-12px"
      v-loading="isRefresh"
    >
      <div
        class="text-center opacity-90"
        v-show="!opt.isNowDay"
      >
        {{ selectDay.getFullYear() }}年{{ selectDay.getMonth() + 1 }}月的账单
      </div>
      <div
        class="mt-3 mb-2 text-center opacity-90"
        v-show="opt.isNowDay"
      >
        {{ selectDayFormat }}的账单
      </div>
      <div class="bills-list relative pt-2 leading-1.2em tracking-0.08em">
        <!-- 按钮 -->
        <div class="btns p-2">
          <small
            inline
            float-right
            pr-2
            v-show="billsPage.total > 0"
          >
            共{{ billsPage.total }}条
          </small>
          <small
            @click="opt.isNowDay = true"
            class="cursor-pointer select-none border-default rounded-6px py-1 mr-2 px-2"
            :class="{ 'text-[var(--el-color-primary)]': opt.isNowDay }"
          >
            按日
          </small>
          <small
            @click="opt.isNowDay = false"
            class="cursor-pointer select-none border-default rounded-6px py-1 mr-2 px-2"
            :class="{ 'text-[var(--el-color-primary)]': !opt.isNowDay }"
          >
            按月
          </small>
        </div>
        <!-- 滚动内容 -->
        <el-scrollbar
          height="20rem"
          wrap-class="overflow-x-hidden"
        >
          <div
            v-infinite-scroll="getBillsPageApi"
            :infinite-scroll-immediate="true"
            :infinite-scroll-delay="200"
            :infinite-scroll-distance="30"
          >
            <UserWalBillsCard
              v-for="p in billsList"
              :key="p.id"
              :data="p"
            />
            <small
              class="block opacity-80 text-center my-4 w-full select-none"
              :class="{ 'animate-state': isLoading }"
            >
              {{ noMore ? "没有更多数据了" : "加载中..." }}
            </small>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.caledar {
  $item-height: 2em;

  :deep(.el-calendar) {
    overflow: hidden;
    border-radius: 12px;
    border: none;

    .el-calendar__body {
      padding: 0 0.8rem 0.8rem 0.8rem;
      .el-calendar-table {
        thead {
          opacity: 0.5;
        }

        .el-calendar-day {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          border-radius: 50%;
          height: 2.8em;
          padding: 0;
          transition: $transition-delay;
          background-color: transparent;
        }
        .current {
          span {
            transition: 0.2s;
            width: $item-height;
            height: $item-height;
            line-height: $item-height;
            border-radius: 50%;
          }
          span:hover {
            background-color: var(--el-color-info);
            color: #fff;
          }

          &.is-selected {
            background-color: transparent;
            span {
              background-color: var(--el-color-info);
              color: #fff;
            }
          }
          &.is-today {
            background-color: transparent;
            span {
              background-color: var(--el-color-info-light-5);
              color: #fff;
            }
          }
        }
      }
    }
    * {
      border: none;
    }
  }
}

:deep(.el-checkbox) {
  transform: scale(1.1);
}
</style>
