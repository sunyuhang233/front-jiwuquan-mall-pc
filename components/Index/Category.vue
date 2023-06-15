
<template>
  <div class="category">
  <!-- <p v-for="(p) in categoryList" :key="p.id">
      {{ p.name }}
      <p v-for="(k) in p?.children" :key="k.id">
        {{ k.name }}
      </p>
      </p> -->
  </div>
</template>

<script lang="ts" setup>
import { getGoodsCategoryList, type Category } from '~/composables/api/goods/category';

const { data } = await getGoodsCategoryList();
const categoryList = ref<Category[]>(data.data || []);


</script>

<style scoped lang="scss">
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>