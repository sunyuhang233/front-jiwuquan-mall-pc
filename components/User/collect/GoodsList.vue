<script lang="ts" setup>
const isLoading = ref<boolean>(true);
const isEdit = ref<boolean>(false);
const user = useUserStore();

// 收藏列表
const list = useAsyncData(async () => {
  const { data, code } = await getGoodsCollectList(user.getToken);
  data.forEach((item) => {
    item.goods.images = typeof item.goods.images === "string" ? item.goods.images.split(",") : [];
  });
  isLoading.value = false;
  if (code === StatusCode.SUCCESS) {
    return data;
  } else {
    return [];
  }
});
/**
 * 单个取消收藏
 * @param gId 商品id
 */
const cancelCollect = (gId: string) => {
  if (isLoading.value) return;
  ElMessageBox.confirm(`是否取消收藏？`, "取消提示", {
    confirmButtonText: "确 认",
    confirmButtonClass: "el-button--warning is-plain border-default ",
    cancelButtonText: "取 消",
    center: true,
    callback: async (action: string) => {
      if (action === "confirm") {
        isLoading.value = true;
        const { code } = await toggleGoodsCollectStatus(gId, user.getToken);
        if (code === StatusCode.SUCCESS) {
          if (list.data.value) {
            for (let i = 0; i < list.data.value.length; i++) {
              if (list.data.value[i].goods.id === gId) {
                list.data.value.splice(i, 1);
                break;
              }
            }
          }
          ElMessage.success("取消成功！");
        } else {
          ElMessage.error("取消失败！");
        }
      }
      isLoading.value = false;
    },
  });
};

// 选中集合
const selectIdsList = ref<string[]>([]);
// 全选
const isSelectAll = computed({
  get() {
    return selectIdsList.value.length === list.data.value?.length;
  },
  set(val: boolean) {
    if (val) {
      selectIdsList.value = list.data.value?.map((p) => p.goods.id) || [];
    } else {
      selectIdsList.value.splice(0);
    }
  },
});
watchDebounced(isEdit, (val: boolean) => {
  if (!val) {
    selectIdsList.value.splice(0);
  }
});
/**
 * 取消收藏（批量）
 */
const batchCancelCollect = () => {
  if (isLoading.value || selectIdsList.value.length === 0) {
    return ElMessage.warning("请选中取消的商品！");
  }

  ElMessageBox.confirm(`是否取消${selectIdsList.value.length}个商品收藏？`, "取消提示", {
    confirmButtonText: "确 认",
    confirmButtonClass: "el-button--danger  border-default ",
    cancelButtonText: "取 消",
    center: true,
    callback: async (action: string) => {
      if (action === "confirm") {
        const { code } = await deleteBatchGoodsCollectByIds(selectIdsList.value, user.getToken);
        if (code === StatusCode.SUCCESS) {
          if (list.data.value) {
            list.data.value.forEach((p, i) => {
              if (selectIdsList.value.includes(p.goods.id) && list.data.value) {
                list.data.value.splice(i, 1);
              }
            });
          }
          ElMessage.success("取消成功！");
        } else {
          ElMessage.error("取消失败！");
        }
      }
    },
  });
};
</script>
<template>
  <div overflow-x-hidden>
    <div class="mb-3 flex-row-c-c justify-end">
      <div
        class="flex w-0 transition-300 transition-width overflow-hidden"
        :class="{ 'w-11em': isEdit }"
      >
        <el-checkbox
          :border="true"
          v-model="isSelectAll"
          label="全选"
          size="small"
        />
        <el-button
          plain
          type="danger"
          :icon="ElIconDelete"
          @click="batchCancelCollect"
          class="ml-3"
          size="small"
        >
          批量取消
        </el-button>
      </div>
      <el-button
        @click="isEdit = !isEdit"
        size="small"
        plain
        type="info"
      >
        {{ isEdit ? "取消" : "管理" }}
      </el-button>
    </div>
    <el-scrollbar
      height="62vh"
      overflow-x-hidden
      v-loading.fullscreen="isLoading"
    >
      <el-checkbox-group
        :disabled="!isEdit"
        v-model="selectIdsList"
        overflow-x-hidden
      >
        <transition-group
          name="group-list"
          tag="div"
          grid="~ cols-2 md:cols-5 gap-6"
        >
          <div
            v-for="p in list.data.value"
            :key="p.id"
          >
            <el-checkbox-button
              :label="p.goods.id"
              class="active:scale-96 transition-300"
            >
              <UserCollectGoodsCard
                :data="p"
                class="border-none"
                @link="!isEdit && navigateTo(`/goods/detail/${p.goods.id}`)"
                @cancel="cancelCollect"
              >
                <template #btns></template>
              </UserCollectGoodsCard>
            </el-checkbox-button>
          </div>
        </transition-group>
      </el-checkbox-group>
      <small
        block
        text-center
        mt-6
        opacity-60
      >
        {{ list.data.value?.length ? "暂无更多收藏" : "还没有收藏噢，快去逛一逛商品吧" }}
      </small>
    </el-scrollbar>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-checkbox-group) {
  font-size: inherit;
  line-height: inherit;

  .el-checkbox-button {
    display: inherit;
    border-radius: 6px;
    border: 2px solid #75757523;

    .el-checkbox-button__inner {
      border-radius: 6px;
      border: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      text-align: start;
      line-height: inherit;
      font-size: inherit;
      background: inherit;
      color: inherit;
    }
  }
  $check-color: var(--el-color-info);
  .is-checked {
    border-color: $check-color;
    position: relative;
    overflow: hidden;
    &::after {
      content: "选中";
      position: absolute;
      right: 0;
      bottom: 0;
      opacity: 100;
      z-index: 1;
      transition: 300;
      width: 2em;
      margin-left: 0.5em;
      font-size: 1em;
      background: $check-color;
      color: #fff;
      width: 8em;
      height: 4em;
      line-height: 2.4em;
      text-align: center;
      box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
      transform: rotate(-45deg) translate(20%, 60%);
    }
  }
}
</style>
