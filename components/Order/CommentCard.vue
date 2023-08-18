<script lang="ts" setup>
import { OrderCommentDTO, OrdersItemVO, OrderGoodsSkuVO } from "@/composables/api/orders";
import { useStorage } from "@vueuse/core";
// props
const { orderItem, isDisable } = defineProps<{
  orderItem: OrdersItemVO;
  isDisable: boolean;
}>();
const uploadFilesRef = ref({
  images: [],
  video: "",
});
// 评论对象
const dto = useStorage(
  "jiwu_order_comment_" + orderItem.id,
  reactive<OrderCommentDTO>({
    orderItemId: orderItem.id,
    content: "",
    rate: 0,
    images: [],
    video: "",
    isRecommend: 0,
    isAnonymous: 0,
  }),
  sessionStorage
);
// 上传内容
watch(
  [() => uploadFilesRef.value.images, () => uploadFilesRef.value.video],
  (val) => {
    console.log(val);
    if (val[0]) {
      dto.value.images = val[0];
    } else if (val[1]) {
      dto.value.video = val[1];
    }
  },
  { deep: true }
);

defineExpose({ dto });
</script>
<template>
  <div class="card">
    <!-- 评价 -->
    <!-- <v-md-editor
      :disabled="isDisable" v-model="dto.content"
      :toc-nav-position-right="true"
      left-toolbar="undo redo clear | save"
      right-toolbar="preview sync-scroll toc"
      placeholder="写下你对商品的真实评价！"
      :upload-image-config="{ accept: BaseUrlImg }"
      height="200px"
      @save="saveLocal"
    /> -->
    <!-- 评价内容 -->
    <el-input
      class="mb-4"
      :disabled="isDisable"
      v-model.lazy="dto.content"
      type="textarea"
      :rows="6"
      :show-word-limit="true"
      :maxLength="250"
      size="large"
      placeholder="写下你对商品的真实评价！"
    />
    <div class="flex">
      <OrderCommUpload
        ref="uploadFilesRef"
        :isDisable="isDisable"
      />
    </div>
    <!-- 商品 -->
    <OrderCommGoods
      :orderItem="orderItem"
      class="mt-4"
    />
    <!-- 评分 -->
    <div
      mt-4
      flex-row-bt-c
    >
      <div class="flex items-center">
        <small opacity-80>评分：</small>
        <el-rate
          :disabled="isDisable"
          v-model.lazy="dto.rate"
          allow-half
          show-text
          :colors="[
            'var(--el-color-black-light-5)',
            'var(--el-color-warning-light-3)',
            'var(--el-color-warning)',
          ]"
          :icons="[ElIconStarFilled, ElIconStarFilled, ElIconStarFilled]"
          :texts="['很差', '差', '还行', '满意', '非常满意']"
        />
      </div>
      <div class="flex opacity-70">
        <el-checkbox
          :disabled="isDisable"
          v-model="dto.isRecommend"
        >
          <small>推 荐</small>
        </el-checkbox>
        <el-checkbox
          :disabled="isDisable"
          v-model="dto.isAnonymous"
        >
          <small>匿 名</small>
        </el-checkbox>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.v-md-editor) {
  box-shadow: none;
  border-radius: 10px;
  overflow: hidden;
}
:deep(.el-textarea__inner) {
  box-shadow: 0 0 4px #61616115;
  padding: 0.8rem;
}
:deep(.el-rate__text) {
  font-size: 0.95em;
}
</style>
