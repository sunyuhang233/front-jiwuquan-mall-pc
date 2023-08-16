<script lang="ts" setup>
import { OrderComment, OrdersItemVO, OrderGoodsSkuVO } from "@/composables/api/orders";
// props
const { orderItem } = defineProps<{
  orderItem: OrdersItemVO;
}>();
//
const dto = reactive<OrderComment>({
  orderItemId: orderItem.id,
  content: "",
  rate: 0,
  images: "",
  video: "",
  isRecommend: 0,
  isAnonymous: 0,
});

const saveLocal = () => {
  ElMessage.info("保存成功！");
};

// 是否完成
const isDisable = ref<boolean>(false);

// 商品规格
const getProps = (p: OrderGoodsSkuVO): string => {
  const arr = [];
  arr.push(p.size, p.color, p.combo);
  return arr.join(" | ");
};
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
    <el-input
      :disabled="isDisable"
      v-model.lazy="dto.content"
      type="textarea"
      :rows="6"
      :show-word-limit="true"
      :maxLength="250"
      size="large"
      placeholder="写下你对商品的真实评价！"
    />
    <div class="goods mt-4 flex">
      <el-image
        loading="lazy"
        class="w-14 h-14 rounded-6px overflow-hidden border-default"
        :src="
          BaseUrlImg +
          orderItem.goodsSku.image +
          '?imageView2/0/w/100/h/100/format/webp/interlace/1/q/50'
        "
      />
      <div class="flex flex-col justify-around px-4">
        <small>{{ orderItem.goods.name }}</small>
        <small
          opacity-60
          text-0.6em
        >
          {{ getProps(orderItem.goodsSku) }}
        </small>
      </div>
    </div>
    <!-- 评分 -->
    <div
      mt-2
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
  box-shadow: none;
  padding: 0.8rem;
  border: 1x solid #79797915;
}
:deep(.el-rate__text) {
  font-size: 0.95em;
}
</style>
