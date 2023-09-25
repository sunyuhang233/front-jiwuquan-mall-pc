<script lang="ts" setup>
import type { GoodsCommentsVO } from "~/composables/api/goods/comments";
import { getGoodsCommentPage } from "~/composables/api/goods/comments";
import type { GoodsSkuVO } from "~/composables/api/goods/sku";
import type { IPage } from "~/types";

const { goodsId, skuList } = defineProps<{
  goodsId: string
  skuList?: GoodsSkuVO[]
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
  () => pageInfo.value.current > 0 && pageInfo.value.current >= pageInfo.value.pages,
);
// 商品规格列表 构建map方便查询
const skuMap = reactive(new Map<string, GoodsSkuVO>());
skuList?.forEach((p) => {
  skuMap.set(p.id, p);
});
async function loadCommentPage() {
  if (isLoading.value || isNoMore.value)
    return;
  isLoading.value = true;
  page.value++;
  const res = await getGoodsCommentPage(page.value, size.value, goodsId);
  const data = res.data.value?.data;
  // 没有更多
  if (isNoMore.value || data?.total === -1)
    return (isLoading.value = false);

  // 展示结果
  pageInfo.value = data!;
  if (!data?.records)
    return;
  data.records?.forEach((p) => {
    p.images = typeof p.images === "string" ? p.images?.split(",") : [];
    isLoading.value = false;
  });
  commentList.value.push(...data.records);
}
loadCommentPage(); // 加载一次

// 商品评价视频预览
const isShowVideo = ref<boolean>(false);
const showVideoUrl = ref<string>("");

function toCommentDetailView(commentId: string) {
  navigateTo({
    path: `/goods/comment/${commentId}`,
  });
}
function showVideo(url: string) {
  if (url) {
    showVideoUrl.value = url;
    isShowVideo.value = true;
  }
}
</script>

<template>
  <el-scrollbar
    v-infinite-scroll="loadCommentPage"
    height="700px"
    :infinite-scroll-delay="400"
    :infinite-scroll-distance="80"
    :infinite-scroll-disable="isNoMore"
    class="comment-list"
    style="width: 100%"
  >
    <GoodsCommentCard
      v-for="p in commentList"
      :key="p.id"
      class="mb-4"
      :comment="p"
      :sku-item="skuMap.get(p.skuId)"
      @show-video="showVideo"
    />
    <div
      v-show="isNoMore"
      class="comment-list"
    >
      <small
        mb-10 inline-block w-full text-center
      >
        暂时没有更多评论
      </small>
    </div>
    <Teleport to="body">
      <el-dialog v-model="isShowVideo">
        <video
          v-if="isShowVideo"
          :src="BaseUrlVideo + showVideoUrl" controls h-full
          w-full
        />
      </el-dialog>
    </Teleport>
  </el-scrollbar>
</template>
