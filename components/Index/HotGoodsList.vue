<script lang="ts" setup>
import type { GoodsVO } from '~/types/goods';

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
  },
);
// 列表
const hotGoodsList = ref<GoodsVO[]>([]);
async function loadHandle() {
  isLoading.value = true;
  page.value++;
  await res.refresh();
  res.data.value?.data?.records.forEach((p: GoodsVO) => {
    p.images = p.images.toString().split(',');
    hotGoodsList.value.push(p);
  });
  isLoading.value = false;
}
await loadHandle();
</script>

<template>
  <div
    class="v-card hot-list h-420px min-h-420px overflow-visible rounded-4px p-4 shadow-sm backdrop-blur-20px md:w-470px border-default dark:bg-dark-5"
  >
    <h3
      px-1
      pb-4
    >
      热门商品
      <span
        i-solar:fire-bold mx-2 bg-red-6 p-3
      />
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
          v-for="p in res.data.value?.data.records"
          :key="p.id"
          :to="`/goods/detail/${p.id}`"
          class="mt-2 w-1/1 animate-[fade-in_0.3s]"
        >
          <!-- 商品卡片 -->
          <CardGoodsLine
            :key="p.id"
            :goods="p"
            class="card my-2 border-0 border-b-1px pb-3 border-default"
          >
            <template #btn>
              <!-- 立即购买 -->
              <div

                class="item"
                float-right opacity-0
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

          v-show="searchPage.pages !== 0 && searchPage.pages === page" my-4
          text-center
        >
          暂无更多商品
        </p>
        <p


          v-show="searchPage.pages !== 0 && page < searchPage.pages" my-4 cursor-pointer
          text-center
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
