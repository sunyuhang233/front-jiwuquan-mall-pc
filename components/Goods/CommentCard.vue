<script lang="ts" setup>
import type { GoodsCommentsVO } from "~/composables/api/goods/comments";
import type { GoodsSkuVO } from "~/composables/api/goods/sku";

const { comment, skuItem } = defineProps<{
  comment: GoodsCommentsVO
  skuItem?: GoodsSkuVO
}>();

defineEmits<{
  (e: "showVideo", url: string): void
}>();

const getPreImages = computed(() => {
  // @ts-expect-error
  return comment.images?.map(
    (p: string) => (p = `${BaseUrlImg + p}?imageView2/0/format/webp/interlace/1/q/50`),
  );
});

function getRateComm(rate: number): string {
  const msg = ["很差", "差", "一般", "比较满意", "强烈推荐"];
  return msg[Math.floor(rate - 1)];
}

function getProps(p?: GoodsSkuVO): string {
  return [p?.size, p?.color, p?.combo].join(" | ");
}
</script>

<template>
  <div
    class="card w-full"
    border-2px rounded-6px p-4 transition-300 border-default-dashed hover:shadow-md
  >
    <!-- 头像名称 -->
    <div class="top flex justify-between">
      <ElImage
        loading="lazy"

        transition-300 hover:transform-scale-110
        :src="BaseUrlImg + comment.avatar"
        style="width: 3em; height: 3em"
        class="avatar mr-2 border-1px rounded-10em border-default-dashed"
        fit="cover"
      />
      <div
        flex flex-1 flex-col justify-around
      >
        <p text-0.9em>
          {{ comment.isAnonymous ? "匿名用户" : comment.nickName }}
        </p>
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
            v-model="comment.rate"
            class="float-left"
            disabled
            allow-half
          />
          <el-text class="hidden md:inline">
            {{ getRateComm(comment.rate) }}
          </el-text>
        </div>
      </div>
      <div
        class="right"
        float-right
      >
        <el-tag v-if="comment.isRecommend">
          <i


            i-solar:like-bold-duotone mr-1 p-2
          />
          买家推荐
        </el-tag>
      </div>
    </div>
    <!-- 评论内容 -->
    <p
      class="text text-overflow-5 max-h-8.6em border-1px rounded-6px bg-[#6b6b6b0c] leading-1.5em border-default-dashed"


      mt-4 p-2 text-0.9em md:p-4
    >
      {{ comment.content }}
    </p>
    <!-- 商品图片 -->
    <el-scrollbar class="scroll my-4">
      <div class="flex">
        <div


          class="group mr-2 flex-row-c-c flex-shrink-0 cursor-pointer border-1px rounded-4px border-default-dashed"
          h-5rem
          w-5rem backdrop-blur-12px md:h-6rem md:w-6rem style="background-color: rgba(73, 73, 73, 0.4)"
          @click="$emit('showVideo', comment.video)"
        >
          <i


            class="transition-200 group-hover:bg-dark"

            i-solar:play-circle-bold z-1 bg-light p-3
          />
        </div>
        <ElImage
          v-for="p in comment.images"
          :key="p"
          loading="lazy"

          :preview-src-list="getPreImages"

          preview-teleported transition-300 hover:transform-scale-110
          :src="BaseUrlImg + p"
          class="mr-2 h-5rem w-5rem flex-shrink-0 border-1px rounded-4px md:h-6rem md:w-6rem border-default-dashed"
          fit="cover"
        />
      </div>
    </el-scrollbar>
    <!-- 评价商品规格 词条 -->
    <div
      class="comment-sku"


      inline-flex items-center border-2px rounded-6px bg-gray-100 pr-4 backdrop-blur-3px border-default-dashed dark:bg-dark-300
    >
      <ElImage
        v-show="skuItem?.image"
        loading="lazy"

        transition-300 hover:transform-scale-110
        :src="`${BaseUrlImg + skuItem?.image}?imageView2/0/w/100/h/100/format/q/50`"
        style="width: 3rem; height: 3rem"
        class="mr-2 border-1px rounded-4px border-default-dashed"
        fit="cover"
      />
      <small>{{ getProps(skuItem) }}</small>
    </div>
    <!-- 底部 -->
    <div class="mt-2 w-full flex cursor-pointer justify-end">
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
