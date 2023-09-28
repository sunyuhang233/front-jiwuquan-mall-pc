<script lang="ts" setup>
import type { GoodsInfoVO } from "~/composables/api/goods";
import type { GoodsSkuVO } from "~/composables/api/goods/sku";

const { goodsInfo, skuList } = defineProps<{
  goodsInfo?: GoodsInfoVO
  skuList?: GoodsSkuVO[]
}>();
const activeMenu = ref<string>("detail");
</script>

<template>
  <el-tabs
    v-model="activeMenu"
    class="goods-tabs min-h-50vh"
    type="border-card"
    tab-position="top"
  >
    <!-- 详情 -->
    <el-tab-pane
      name="detail"
      class="mt-2 animate-[fade-in_0.4s]"
      label="详 情"
    >
      <!-- 标题 -->
      <h3
        v-show="!goodsInfo?.description" mb-4
        ml-2
      >
        {{ goodsInfo?.name }}
      </h3>
      <!-- markdown -->
      <ClientOnly>
        <v-md-preview
          v-if="goodsInfo?.description"
          class="markdown mb-4"
          :text="goodsInfo?.description"
        />
      </ClientOnly>
      <!-- des -->
      <div
        class="text"


        mb-4 rounded-6px px-4 leading-2em border-default-dashed
      >
        <small>
          发货地：{{ (goodsInfo?.province || "") + (goodsInfo?.city || "") + goodsInfo?.district }}
        </small>
        <br>
        <small>
          保障：
          <el-text v-if="goodsInfo?.refundTime">{{ goodsInfo?.refundTime }}日无理由退换货</el-text>
        </small>
      </div>
      <!-- imgs -->
      <div
        class="imgs overflow-hidden rounded-4px"
        flex
        flex-col
      >
        <el-image
          v-for="(p) in goodsInfo?.images"
          :key="p"
          loading="lazy"
          style="width: 100%; margin-bottom: 0.3em"
          :src="BaseUrlImg + p"
          :alt="p"
        />
      </div>
    </el-tab-pane>
    <!-- 评价 -->
    <el-tab-pane
      lazy
      name="comment"
      class="mt-2 animate-[fade-in_0.4s]"
      label="评 价"
    >
      <GoodsCommentList
        :goods-id="goodsInfo?.id || ''"
        :sku-list="skuList"
      />
    </el-tab-pane>
    <!-- 其他 -->
    <el-tab-pane
      name="other"
      lazy
      class="mt-2 animate-[fade-in_0.4s] px-2"
      label="其 他"
    >
      <GoodsOtherTmp />
    </el-tab-pane>
  </el-tabs>
</template>

<!-- 样式scss -->
<style scoped lang="scss">
.goods-tabs {
  :deep(.el-tabs__item) {
    font-size: 1em;
    font-family: sans-serif;
    letter-spacing: 0.1em;
    padding: 1em 1.8em;
    margin-right: 1em;
    display: flex;
    justify-content: center;
  }
}
// https://code-farmer-i.github.io/vue-markdown-editor/zh/theme/vuepress.html#%E4%BB%8B%E7%BB%8D
:deep(.vuepress-markdown-body) {
  padding: 1rem;
  border-radius: 4px;
}
</style>
