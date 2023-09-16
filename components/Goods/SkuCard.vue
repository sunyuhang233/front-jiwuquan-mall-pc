<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import currency from "currency.js";
import { gsap } from "gsap";
import type { GoodsInfoVO } from "~/composables/api/goods";
import type { GoodsSkuVO } from "~/composables/api/goods/sku";
import type { PushOrdersItemDTO } from "~/composables/api/orders";

// props
const { goodsInfo, goodsSku } = defineProps<{
  goodsInfo?: GoodsInfoVO
  goodsSku?: GoodsSkuVO[]
}>();
// emits
const emit = defineEmits(["setActiveItem"]);
const user = useUserStore();
const shop = useShopStore();

// 表单
const form = reactive<formDTO>({
  skuId: "",
  quantity: 1,
  size: "",
  color: "",
  combo: "",
});
// 功能
// loading全屏
const fullscreenLoading = ref<boolean>(false);
// 是否全选规格
const isAllCheckSku = ref<boolean>(false);
// 表单实例
const FormRef = ref<FormInstance>();
/**
 * 添加到购物车
 * @param formRef
 */
function onSubmitShopCart(formRef: FormInstance | undefined, event: MouseEvent) {
  formRef
    ?.validate(async (valid) => {
      if (valid && user.getToken) {
        if (await shop.addShopcartAction(form.skuId, form.quantity, user.getToken)) {
          ElMessage.success("添加成功！");
          startDotAnimate(event);
        }
        else {
          ElMessage.error("添加失败，请稍后再试！");
        }
      }
      else {
        ElMessage.closeAll();
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}
// 小球动画
const isAimate = ref<boolean>(false);
function startDotAnimate(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (isAimate.value || target.getBoundingClientRect === undefined)
    return;
  isAimate.value = true;
  const { bottom, right } = target.getBoundingClientRect();
  gsap.to(target, {
    bottom: 0,
  });
  isAimate.value = false;
};
const order = useOrderStore();
/**
 * 立即购买
 */
function onSubmitBuy(formRef: FormInstance | undefined) {
  formRef
    ?.validate(async (valid) => {
      if (valid && user.getToken !== "") {
        const dto: PushOrdersItemDTO[] = [
          {
            skuId: form.skuId,
            quantity: form.quantity,
          },
        ];
        fullscreenLoading.value = true;
        // 提交订单
        setTimeout(() => {
          order.clearOrderItems();
          order.$patch({
            pushOrderItems: [...dto],
          });
          fullscreenLoading.value = false;
          navigateTo({
            path: "/order/detail",
          });
        }, 1000);
      }
      else {
        ElMessage.closeAll();
        fullscreenLoading.value = false;
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}


interface formDTO {
  skuId: string
  quantity: number
  size?: string
  color?: string
  combo?: string
}
// 尺寸
const sizeList = ref<SizeType[]
>([]);
interface SizeType {
  id: string
  name: string
}
// 颜色
const colorList = ref<ColorType[]
>([]);

interface ColorType {
  id: string
  name: string
  image: string
}

interface SizeType {
  id: string
  name: string
}
// 版本
const comboList = ref<SizeType[]>([]);


/**
 * 初始化获取规格
 */
function initSku() {
  goodsSku?.forEach((p) => {
    if (p.size && !sizeList.value.find(k => k.name === p.size)) {
      sizeList.value?.push({
        id: p.id,
        name: p.size,
      });
    }
    if (p.color && !colorList.value.find(k => k.name === p.color)) {
      colorList.value?.push({
        id: p.id,
        name: p.color,
        image: p.image,
      });
    }
    if (p.combo && !comboList.value.find(k => k.name === p.combo)) {
      comboList.value?.push({
        id: p.id,
        name: p.combo,
      });
    }
  });
}
initSku();

// 表单监听
watch(
  form,
  (dto: formDTO) => {
    const item = goodsSku?.find(p => dto.color === (p.color || "") && dto.combo === (p.combo || "") && dto.size === (p.size || ""));
    if (item && item?.id) {
      isAllCheckSku.value = true;
      form.skuId = item?.id;
    }
  },
  { immediate: true, deep: true },
);

// 计算全部规格总库存
const getMaxStock = computed(() => {
  let count = 0;
  goodsSku?.forEach((p) => {
    count += p.stock;
  });
  return count;
});
const allPostate = ref<number>(0);
// 计算当前的最终价格
const allPrice = computed((): number => {
  if (goodsSku) {
    for (const p of goodsSku) {
      if (p.id === form.skuId) {
        if (goodsInfo?.postage)
          allPostate.value = goodsInfo?.postage;

        return currency(p.price).multiply(form.quantity).add(allPostate.value).value;
      }
    }
  }
  return 0;
});

// 计算当前规格的库存
const getStock = computed(() => {
  return goodsSku?.find(p => p.id === form.skuId)?.stock || 0;
});

// 设置预览图片
function setActiveItem(image: string) {
  emit("setActiveItem", image);
}
</script>

<template>
  <ClientOnly>
    <div class="v-card relative rounded-6px shadow -z-1" p-8 pb-2>
      <el-form ref="FormRef" :model="form" label-position="top" class="group">
        <!-- 顶部 -->
        <div class="top opacity-90" mt-2 flex-row-bt-c>
          <!-- 商品标签 -->
          <div class="left">
            <el-tag v-if="goodsInfo?.isNew" class="mr-2" effect="dark" type="danger">
              新品
            </el-tag>
            <el-tag class="mr-2" effect="light" type="info">
              {{
                goodsInfo?.postage ? `${goodsInfo?.postage}元运费` : '免运费'
              }}
            </el-tag>
            <el-tag class="mr-2" effect="light" type="info">
              {{
                goodsInfo?.refundTime ? `${goodsInfo?.refundTime}日无理由退货` : ''
              }}
            </el-tag>
          </div>
          <!-- 收藏 -->
          <ClientOnly>
            <BtnCollectGoods :gid="goodsInfo?.id || ''" />
          </ClientOnly>
        </div>
        <!-- 规格选择 -->
        <div class="sku-list" flex flex-col pt-6 leading-1.4em tracking-0.1em>
          <!-- 顶部 -->
          <h3 mb-4 leading-1.2em>
            {{ goodsInfo?.name }}
          </h3>
          <div mb-4 flex-row-bt-c>
            <small float-left opacity-90>销售价（元）：</small>
            <div class="righjt">
              <span text-1.4em font-700 text-red-5>￥
                <span v-incre-up="goodsInfo?.price" />
              </span>
              <small style="text-decoration: line-through; opacity: 0.9" text-0.6em text-bluegray-3>￥
                <span v-incre-up="goodsInfo?.costPrice" />
              </small>
            </div>
          </div>
          <!-- 规格 -->
          <div v-if="sizeList.length" class="card">
            <small>规 格</small>
            <el-form-item prop="size" required mt-1>
              <template #error>
                <small pl-2 text-red-5>请选择规格</small>
              </template>
              <el-radio-group v-model="form.size">
                <el-radio-button v-for="p in sizeList" :key="p.name" :label="p.name" />
              </el-radio-group>
            </el-form-item>
          </div>
          <!-- 颜色 -->
          <div v-if="colorList.length" class="card">
            <small>颜 色</small>
            <el-form-item prop="color" required mt-1>
              <template #error>
                <small pl-2 text-red-5>请选择颜色</small>
              </template>
              <el-radio-group v-model="form.color" size="large">
                <!-- cts -->
                <el-radio
                  v-for="p in colorList" :key="p.name" :border="true" :label="p.name"
                  style="height: 4em; border-radius: 4px;margin: 0 0.4rem 0.4rem 0;" class="color-group flex flex-col"
                  @click="setActiveItem(p.image)"
                >
                  <img
                    loading="lazy"
                    class="sku-img" :src="BaseUrlImg + p.image" :alt="p.name || 'Design By Kiwi23333'"
                    z-0 overflow-hidden rounded-4px
                  >
                  <div z-5 px-4 py-2 text-center class="tip">
                    {{ p.name }}
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <!-- 套餐 -->
          <div v-if="comboList.length" class="card">
            <small>套 餐</small>
            <el-form-item prop="combo" required mt-1>
              <template #error>
                <small pl-2 text-red-5>请选择套餐</small>
              </template>
              <el-radio-group v-model="form.combo">
                <el-radio-button v-for="p in comboList" :key="p.name" :label="p.name" />
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div v-if="!goodsSku || !goodsSku.length" class="h-12rem w-full text-center leading-12rem">
          暂未开售
        </div>
        <!-- 数量 -->
        <div class="card">
          <small>数 量</small>
          <el-form-item prop="quantity" required mt-2>
            <el-input-number v-model="form.quantity" :disabled="getStock === 0" :min="1" :max="getStock !== 0 ? 99 : 1" />
            <small v-show="isAllCheckSku">（库存剩余：<span text-red-5>{{ getStock }} </span>件）</small>
            <small v-show="!isAllCheckSku">（总库存剩余：{{ getMaxStock }} 件）</small>
          </el-form-item>
        </div>
        <!-- 购物车|立即购买 -->
        <el-form-item>
          <div class="relative mt-2 w-1/1 flex justify-between py-3">
            <!-- 加入 -->
            <el-button
              :disabled="!goodsSku || !goodsSku?.length"
              size="large" style="flex: 1;transition: 300ms;font-size: 1.2em;padding: 0.8em 1em;letter-spacing: 0.1em;margin-right: 0.6em;font-weight: 700;" plain shadow @click="onSubmitShopCart(FormRef, $event)"
            >
              加入购物车
            </el-button>
            <!-- 立即购买 -->
            <el-button
              v-loading.fullscreen.lock="fullscreenLoading"
              :disabled="!goodsSku || !goodsSku?.length"
              size="large"
              class="relative"
              style="flex: 1;margin-right: 0.6em;transition: 300ms;font-size: 1.2em;font-weight: 600;padding: 0.8em 1em;letter-spacing: 0.1em;" shadow-md type="info" @click="onSubmitBuy(FormRef)"
            >
              立即购买
              <div
                rounded="t-6px"
                border-border-dark-300 flex-row-c-c border-2px bg-white p-2 text-0.9rem text-red-5 shadow-md border-default-dashed dark:bg-dark-6 class="all-price -translate-1/1" :class="{ active: isAllCheckSku }"
              >
                <small block>￥</small>
                <h3 v-incre-up="allPrice" />
              </div>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.card {
	h3 {
		padding-left: 0.1em;
	}
}

.color-group {
	:deep(.el-radio__input) {
		opacity: 0;

	}

	.sku-img {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 4px;
		opacity: 0.8;
	}

	.tip {
		transition: $transition-delay;
		transform: translateY(0%);
		font-weight: 800;
		font-size: 1.1em;
		color: #fff;
		text-shadow: 1px 1px #464646;
	}

	.is-checked .tip,
	&:hover .tip {
		color: var(--el-color-primary);
		text-shadow: 1px 1px #96969696;
	}
}

:deep(.el-input-number) {
	width: 7.5em;
}

.all-price {
	position: absolute;
	right: 4%;
	width: 9rem;
	height: 3em;
	z-index: -1;
	opacity: 0;
	transform: translateY(0%);
	transition: $transition-delay;

	&.active {
		opacity: 1;
		transform: translateY(-80%);
	}
}
</style>
