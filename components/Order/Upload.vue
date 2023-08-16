<template>
  <input
    type="file"
    @input="handelUpload"
  />
  <el-button @click="onResToken">获取token</el-button>
  <img
    :src="imgUrl"
    alt=""
    w-4em
    h-5em
  />
</template>

<script lang="ts" setup>
import { ResOssVO } from "~/composables/api/res/index";
const dto = ref<ResOssVO>({
  url: "",
  key: "",
  uploadToken: "",
  endDateTime: -1,
});
const user = useUserStore();
const onResToken = async () => {
  const { data, code } = await getResToken(user.getToken);
  if (code === StatusCode.SUCCESS) {
    dto.value = data;
    // console.log(data);
  } else {
  }
};
const imgUrl = ref<string>("");
const handelUpload = (e: any) => {
  if (e.target.files.length === 0) {
    return;
  }
  defUpload(e.target.files[0], dto.value.key, dto.value.uploadToken, {
    next(res) {
      // console.log(res);
    },
    error(err) {
      // console.warn(err);
    },
    complete(res) {
      // console.log(res);
      imgUrl.value = BaseUrlImg + res.key;
    },
  });
};
</script>
