<script lang="ts" setup>
import { GoodsVO } from "~/types/goods";
// 分页器
const page = ref<number>(0);
const size = ref<number>(10);
// 骨架屏
const isLoading = ref<boolean>(false);
const res = await getGoodsListByPageLazy(page.value, size.value, {
  viewsSort: isTrue.TRUE,
  saleSort: isTrue.TRUE,
});

// 展示结果
const searchPage = reactive(
  res.data.value?.data || {
    records: [{}],
    total: 0,
    pages: 0,
    size: 0,
    current: 0,
  }
);
// 列表
const hotGoodsList = ref<GoodsVO[]>([]);
const loadHandle = async () => {
  isLoading.value = true;
  page.value++;
  await res.refresh();
  res.data.value?.data?.records.forEach((p: GoodsVO) => {
    p.images = p.images.toString().split(",");
    hotGoodsList.value.push(p);
  });
  isLoading.value = false;
};
await loadHandle();
</script>
<template>
  <div
    class="hot-list md:w-470px v-card dark:bg-dark-5 backdrop-blur-20px border-default shadow-sm min-h-420px h-420px p-4 rounded-4px overflow-visible"
  >
    <h3
      px-1
      pb-4
    >
      热门商品
      <span
        p-3
        bg-red-6
        mx-2
        i-solar:fire-bold
      ></span>
    </h3>
    <ClientOnly>
      <!-- 商品列表 -->
      <el-scrollbar
        v-loading="isLoading"
        :always="false"
        height="88%"
        style="width: 100%"
      >
        <NuxtLink
          :to="`/goods/detail/${p.id}`"
          class="mt-2 w-1/1 animate-[fade-in_0.3s]"
          v-for="p in res.data.value?.data.records"
          :key="p.id"
        >
          <!-- 商品卡片 -->
          <CardGoodsLine
            :goods="p"
            :key="p.id"
            class="card my-2 pb-3 border-0 border-b-1px border-default"
          >
            <template #btn>
              <!-- 立即购买 -->
              <div
                opacity-0
                class="item"
                float-right
              >
                <el-button
                  group:hover:block
                  type="danger"
                  size="small"
                  style="padding: 0 1em; margin-left: 2em"
                >
                  <nuxt-link
                    to=""
                    style="font-size: 10px"
                  >
                    前往购买
                  </nuxt-link>
                </el-button>
              </div>
            </template>
          </CardGoodsLine>
        </NuxtLink>
        <p
          text-center
          my-4
          v-show="searchPage.pages !== 0 && searchPage.pages === page"
        >
          暂无更多商品
        </p>
        <p
          text-center
          my-4
          cursor-pointer
          v-show="searchPage.pages !== 0 && page < searchPage.pages"
          @click="loadHandle"
        >
          加载更多
        </p>
      </el-scrollbar>
    </ClientOnly>
  </div>
</template>
<style scoped lang="scss">
.card {
  .item {
    opacity: 0;
    margin-left: auto;
  }

  &:hover {
    .item {
      transition: $transition-delay;
      transform: translateY(0%);
      opacity: 1;
    }
  }
}
</style>
