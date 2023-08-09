<template>
  <swiper
    effect="cards"
    :cardsEffect="{
      slideShadows: false,
      perSlideRotate: 0,
    }"
    :width="width"
    :slidesPerView="1"
    :autoplay="{ delay: 5000 }"
    :grabCursor="true"
    :mousewheel="true"
    :loop="true"
    :modules="[SwiperEffectCards, SwiperParallax, SwiperMousewheel]"
  >
    <slot>
      <swiper-slide>
        <UserWalCard class="w-full h-full transition-300 hover:translate-x-2" />
      </swiper-slide>
      <swiper-slide>
        <UserWalWxCard class="w-full h-full transition-300 hover:translate-x-2" />
      </swiper-slide>
      <swiper-slide>
        <UserWalAliCard class="w-full h-full transition-300 hover:translate-x-2" />
      </swiper-slide>
    </slot>
  </swiper>
</template>
<script lang="ts" setup>
const { width } = defineProps({
  width: {
    required: false,
    default: 350,
    type: Number,
  },
});
</script>
