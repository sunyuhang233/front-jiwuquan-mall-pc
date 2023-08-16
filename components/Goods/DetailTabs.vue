<template>
  <el-tabs
    class="goods-tabs min-h-50vh"
    type="border-card"
    tab-position="top"
    v-model="activeMenu"
  >
    <!-- 详情 -->
    <el-tab-pane
      name="detail"
      class="animate__animated animate__fadeIn mt-2"
      label="详 情"
    >
      <!-- 标题 -->
      <h3
        ml-2
        mb-4
        v-show="!goodsInfo?.description"
      >
        {{ goodsInfo?.name }}
      </h3>
      <!-- markdown -->
      <v-md-preview
        class="mb-4 markdown"
        :text="goodsInfo?.description"
      />
      <!-- des -->
      <div
        class="text"
        leading-2em
        px-4
        border-default-dashed
        rounded-6px
        mb-4
      >
        <small>
          发货地：{{ (goodsInfo?.province || "") + (goodsInfo?.city || "") + goodsInfo?.district }}
        </small>
        <br />
        <small>
          保障：
          <el-text v-if="goodsInfo?.refundTime">{{ goodsInfo?.refundTime }}日无理由退换货</el-text>
        </small>
      </div>
      <!-- imgs -->
      <div
        class="imgs rounded-4px overflow-hidden"
        flex
        flex-col
      >
        <el-image
          loading="lazy"
          style="width: 100%; margin-bottom: 0.3em"
          :src="BaseUrlImg + p"
          v-for="(p, i) in goodsInfo?.images"
          :key="p"
          :alt="p"
        />
      </div>
    </el-tab-pane>
    <!-- 评价 -->
    <el-tab-pane
      lazy
      name="omments"
      class="animate__animated animate__fadeIn mt-2"
      :label="'评 价'"
    >
      <GoodsComments
        :goods-id="goodsInfo?.id || ''"
        :sku-list="skuList"
      />
    </el-tab-pane>
    <!-- 其他 -->
    <el-tab-pane
      name="other"
      lazy
      class="animate-fade-in mt-2 px-2"
      label="其 他"
    >
      <GoodsOtherTmp />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { GoodsInfoVO } from "~/composables/api/goods";
import { GoodsSkuVO } from "~/composables/api/goods/sku";
const { goodsInfo, skuList } = defineProps<{
  goodsInfo?: GoodsInfoVO;
  skuList?: GoodsSkuVO[];
}>();
const activeMenu = ref<string>("detail");
</script>
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
  padding: 1.5em;
  border-radius: 4px;
}
</style>
