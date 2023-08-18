<script lang="ts" setup>
import { GoodsCommentsVO, getGoodsCommentPage } from "~/composables/api/goods/comments";
import { GoodsSkuVO } from "~/composables/api/goods/sku";
import { IPage } from "~/types";
const { goodsId, skuList } = defineProps<{
  goodsId: string;
  skuList?: GoodsSkuVO[];
}>();
const isLoading = ref<boolean>(false);
// 商品列表
const commentList = ref<GoodsCommentsVO[]>([]);
// 分页器
const page = ref<number>(0);
const size = ref<number>(10);
// 查询页信息
const pageInfo = ref<IPage<GoodsCommentsVO>>({
  records: [],
  total: -1,
  pages: -1,
  size: -1,
  current: -1,
});
const isNoMore = computed<boolean>(
  () => pageInfo.value.current > 0 && pageInfo.value.current >= pageInfo.value.pages
);
// 商品规格列表 构建map方便查询
const skuMap = reactive(new Map<string, GoodsSkuVO>());
skuList?.forEach((p) => {
  skuMap.set(p.id, p);
});
const loadCommentPage = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  page.value++;
  const res = await getGoodsCommentPage(page.value, size.value, goodsId);
  let data = res.data.value?.data;
  // 没有更多
  if (isNoMore.value || data?.total === -1) {
    return (isLoading.value = false);
  }
  // 展示结果
  pageInfo.value = data!;
  if (!data?.records) return;
  data.records?.forEach((p) => {
    p.images = typeof p.images === "string" ? p.images?.split(",") : [];
    isLoading.value = false;
  });
  commentList.value.push(...data.records);
};
loadCommentPage(); // 加载一次

const toCommentDetailView = (commentId: string) => {
  navigateTo({
    path: `/goods/comment/${commentId}`,
  });
};
const showVideo = (url: string) => {};
</script>
<template>
  <el-scrollbar
    height="700px"
    v-infinite-scroll="loadCommentPage"
    :infinite-scroll-delay="400"
    :infinite-scroll-distance="80"
    :infinite-scroll-disable="isNoMore"
    class="comment-list"
    style="width: 100%"
  >
    <GoodsCommentCard
      class="mb-4"
      v-for="p in commentList"
      :key="p.id"
      :comment="p"
      @show-video="showVideo"
      :sku-item="skuMap.get(p.skuId)"
    />
    <div
      class="comment-list"
      v-show="isNoMore"
    >
      <small
        inline-block
        text-center
        w-full
        mb-10
      >
        暂时没有更多评论
      </small>
    </div>
  </el-scrollbar>
</template>
