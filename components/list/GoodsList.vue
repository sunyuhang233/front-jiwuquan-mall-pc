<script lang="ts" setup>
import { type GoodsPageDTO } from "@/composables/api/goods";
import type { GoodsVO } from "~/types/goods";

// props
interface Props {
  dto: GoodsPageDTO
  /** 列表布局class */
  class?: string
  limit?: number
  load?: boolean
  isTimer?: boolean
  transiton?: string
}
const props = withDefaults(defineProps<Props>(), {
  isTimer: () => true,
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
const pageInfo = reactive({
  total: -1,
  pages: -1,
  current: -1,
});

const isNot = computed<boolean>(() => {
  return pageInfo?.total === 0 && pageInfo.pages === 0;
});
const isNoMore = computed<boolean>(() => {
  if (pageInfo.pages > 0 && page.value >= pageInfo.pages)
    return true;
  else
    return false;
  ;
});

async function loadGoodsPage() {
  // 没有更多
  if (isLoading.value || isNoMore.value || isNot.value)
    return;
  isLoading.value = true;
  page.value++;
  const { data } = await getGoodsListByPage(page.value, size.value, props?.dto);

  // 展示结果
  pageInfo.total = data.total;
  pageInfo.current = data.current;
  pageInfo.pages = data.pages;
  if (props.isTimer) {
    for await (const p of data.records) {
      p.images = typeof p.images === "string" ? p.images.split(",") : [];
      goodsList.value.push(Object.freeze(p));
    }
  }
  else {
    for (const p of data.records) {
      p.images = typeof p.images === "string" ? p.images.split(",") : [];
      goodsList.value.push(p);
    }
  }
  isLoading.value = false;
}
function clearResult() {
  goodsList.value.splice(0);
  pageInfo.total = -1;
  pageInfo.pages = -1;
  pageInfo.current = -1;
  page.value = 0;
}
// 条件筛选
const dto = toReactive(props.dto);
const timer = ref();
watchDebounced(
  dto,
  async () => {
    if (timer.value)
      return;
    clearResult();
    await loadGoodsPage();
    timer.value = setTimeout(() => {
      clearTimeout(timer.value);
      timer.value = null;
    }, 400);
  },
  {
    immediate: true,
  },
);

defineExpose({
  clearResult, // 清除
  loadGoodsPage,
  goodsList,
  pageInfo,
});
</script>

<template>
  <ListAutoIncre :no-more="isNoMore" @load="loadGoodsPage">
    <transition-group
      tag="div"
      class="pb-2"
      :name="transiton || 'fade-list'"
      :class="props.class !== null ? props.class : 'flex flex-wrap'"
    >
      <NuxtLink
        v-for="p in goodsList"
        :key="p.id"
        :to="`/goods/detail/${p.id}`"
      >
        <!-- 商品卡片 -->
        <CardGoodsBox
          class="v-card mt-4/100 transition-300"
          :goods="p"
        >
          <small
            float-right
            mt-2px
            text-blueGray
          >
            销量：{{ p.sales }}
          </small>
        </CardGoodsBox>
      </NuxtLink>
    </transition-group>
    <p
      v-show="isNoMore || isNot"
      class="w-1/1 py-8" text-center tracking-1
      text-bluegray
    >
      {{ isNoMore ? "暂无更多商品" : "暂无商品" }}
    </p>
  </ListAutoIncre>
</template>

<style scoped lang="scss">
:deep(.el-loading-mask) {
  background-color: transparent;
}
</style>
