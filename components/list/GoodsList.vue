<script lang="ts" setup>
import { type GoodsPageDTO } from "@/composables/api/goods";
import { getGoodsListByPage } from "@/composables/api/goods";
import { GoodsVO } from "~/types/goods";

// props
type Props = {
  dto: GoodsPageDTO;
  /**列表布局class */
  class?: string;
  limit?: number;
  load?: boolean;
  timer?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  timer: () => true,
  dto: () => {
    return {};
  },
});

const isLoading = ref<boolean>(false);
// 商品列表
const goodsList = ref<GoodsVO[]>([]);
// 分页器
const page = ref<number>(0);
const size = ref<number>(props.limit || 10);
// 查询页信息
let pageInfo = reactive({
  total: -1,
  pages: -1,
  current: -1,
});
const isNot = computed<boolean>(() => {
  return pageInfo?.total === 0 && pageInfo.pages === 0;
});
const isNoMore = computed<boolean>(() => {
  return pageInfo.pages > 0 && page.value >= pageInfo.pages;
});

const loadGoodsPage = async () => {
  // 没有更多
  if (isLoading.value || isNoMore.value || isNot.value) return;
  isLoading.value = true;
  page.value++;
  const { data } = await getGoodsListByPage(page.value, size.value, props?.dto);

  // 展示结果
  pageInfo.total = data.total;
  pageInfo.current = data.current;
  pageInfo.pages = data.pages;
  let timer: NodeJS.Timeout | null;
  if (props.timer) {
    for await (const p of data.records) {
      await new Promise((resolve) => {
        timer = setTimeout(() => {
          p.images = typeof p.images === "string" ? p.images.split(",") : [];
          // freeze
          goodsList.value.push(Object.freeze(p));
          clearTimeout(timer ?? undefined);
          timer = null;
          return resolve(true);
        }, 20);
      });
    }
  } else {
    for (const p of data.records) {
      p.images = typeof p.images === "string" ? p.images.split(",") : [];
      goodsList.value.push(p);
      timer = null;
    }
  }
  isLoading.value = false;
};
const clearResult = () => {
  goodsList.value.splice(0);
  pageInfo.total = -1;
  pageInfo.pages = -1;
  pageInfo.current = -1;
};
const toGoodsView = (id: string) => {
  navigateTo({
    path: `/goods/detail/${id}`,
  });
};
// 条件筛选
const timer = ref<any>(null);
const dto = toReactive(props.dto);
watch(
  dto,
  () => {
    if (timer.value) return;
    clearResult();
    loadGoodsPage();
    timer.value = setTimeout(() => {
      clearTimeout(timer);
      timer.value = null;
    }, 400);
  },
  { deep: true, immediate: true }
);

defineExpose({
  clearResult, // 清除
  loadGoodsPage,
  goodsList,
  pageInfo,
});
</script>
<template>
  <div
    class="goods-list relative"
    style="overflow: auto"
  >
    <ClientOnly>
      <transition-group
        tag="div"
        name="item-list"
        v-infinite-scroll="loadGoodsPage"
        :infinite-scroll-delay="400"
        :infinite-scroll-distance="80"
        :class="props.class !== null ? props.class : 'flex flex-wrap'"
        class="overflow-x-hidden"
      >
        <!-- 商品卡片 -->
        <CardGoodsBox
          @click="toGoodsView(p.id)"
          class="mt-4/100 hover:shadow-md shadow-[var(--el-color-primary)] transition-300"
          element-loading-background="transparent"
          :goods="p"
          :key="p.id"
          v-for="p in goodsList"
        >
          <small
            float-right
            mt-2px
            text-blueGray
          >
            销量：{{ p.sales }}
          </small>
        </CardGoodsBox>
      </transition-group>
    </ClientOnly>
    <p
      class="w-1/1 py-8"
      text-blueGray
      tracking-1
      text-center
      v-show="isNoMore || isNot"
    >
      {{ isNoMore ? "暂无更多商品" : "暂无商品" }}
    </p>
    <div
      class="loading w-1/1"
      v-loading="isLoading"
      p-5em
    ></div>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-loading-mask) {
  background-color: transparent;
}
</style>
