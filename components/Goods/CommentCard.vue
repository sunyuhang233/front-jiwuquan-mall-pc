<script lang="ts" setup>
import { GoodsCommentsVO } from "~/composables/api/goods/comments";
import { GoodsSkuVO } from "~/composables/api/goods/sku";

const { comment, skuItem } = defineProps<{
  comment: GoodsCommentsVO;
  skuItem?: GoodsSkuVO;
}>();

const getPreImages = computed(() => {
  // @ts-ignore
  return comment.images?.map(
    (p: string) => (p = BaseUrlImg + p + "?imageView2/0/w/100/h/100/format/webp/interlace/1/q/50")
  );
});

const getRateComm = (rate: number): string => {
  let msg = ["很差", "差", "一般", "比较满意", "强烈推荐"];
  return msg[Math.floor(rate - 1)];
};

const getProps = (p?: GoodsSkuVO): string => {
  return [p?.size, p?.color, p?.combo].join(" | ");
};
</script>
<template>
  <div
    class="card w-full"
    border-default-dashed
    border-2px
    transition-300
    hover:shadow-md
    rounded-6px
    p-4
  >
    <!-- 头像名称 -->
    <div class="top flex justify-between">
      <ElImage
        loading="lazy"
        hover:transform-scale-110
        transition-300
        :src="BaseUrlImg + comment.avatar"
        style="width: 3em; height: 3em"
        class="rounded-10em mr-2 border-default-dashed border-1px avatar"
        fit="cover"
      />
      <div
        flex
        flex-col
        justify-around
        flex-1
      >
        <p text-0.9em>{{ comment.isAnonymous ? "匿名用户" : comment.nickName }}</p>
        <div
          flex-row-c-c
          justify-start
        >
          <small
            mr-4
            opacity-80
          >
            {{ comment.createTime }}
          </small>
          <el-rate
            class="float-left"
            v-model="comment.rate"
            disabled
            allow-half
          />
          <el-text class="hidden md:inline">{{ getRateComm(comment.rate) }}</el-text>
        </div>
      </div>
      <div
        class="right"
        float-right
      >
        <el-tag v-if="comment.isRecommend">
          <i
            i-solar:like-bold-duotone
            p-2
            mr-1
          ></i>
          买家推荐
        </el-tag>
      </div>
    </div>
    <!-- 评论内容 -->
    <p
      class="text text-overflow-5 max-h-8.6em leading-1.5em rounded-6px border-default-dashed border-1px bg-[#6b6b6b0c]"
      md:p-4
      p-2
      mt-4
      text-0.9em
    >
      {{ comment.content }}
    </p>
    <!-- 商品图片 -->
    <el-scrollbar class="scroll my-4">
      <div class="flex">
        <div
          w-5rem
          h-5rem
          md:w-6rem
          md:h-6rem
          class="group flex-shrink-0 cursor-pointer rounded-4px flex-row-c-c mr-2 border-default-dashed border-1px"
          @click="$emit('show-video', comment.video)"
          backdrop-blur-12px
          style="background-color: rgba(73, 73, 73, 0.4)"
        >
          <i
            z-1
            bg-light
            class="group-hover:bg-dark transition-200"
            p-3
            i-solar:play-circle-bold
          ></i>
        </div>
        <ElImage
          loading="lazy"
          v-for="p in comment.images"
          :key="p"
          preview-teleported
          :preview-src-list="getPreImages"
          hover:transform-scale-110
          transition-300
          :src="BaseUrlImg + p"
          class="w-5rem h-5rem md:w-6rem md:h-6rem flex-shrink-0 rounded-4px mr-2 border-default-dashed border-1px"
          fit="cover"
        />
      </div>
    </el-scrollbar>
    <!-- 评价商品规格 词条 -->
    <div
      class="comment-sku"
      border-default-dashed
      bg-gray-100
      dark:bg-dark-300
      border-2px
      rounded-6px
      inline-flex
      items-center
      pr-4
      backdrop-blur-3px
    >
      <ElImage
        loading="lazy"
        v-show="skuItem?.image"
        hover:transform-scale-110
        transition-300
        :src="BaseUrlImg + skuItem?.image + '?imageView2/0/w/100/h/100/format/q/50'"
        style="width: 3rem; height: 3rem"
        class="rounded-4px mr-2 border-default-dashed border-1px"
        fit="cover"
      />
      <small>{{ getProps(skuItem) }}</small>
    </div>
    <!-- 底部 -->
    <div class="mt-2 w-full flex justify-end cursor-pointer">
      <el-text
        type="primary"
        style="margin-left: 0.4rem"
        text-0.9em
      >
        评论
      </el-text>
      <el-text
        type="primary"
        style="margin-left: 0.4rem"
        text-0.9em
      >
        回复
      </el-text>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
