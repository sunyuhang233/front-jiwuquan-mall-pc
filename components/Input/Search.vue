<template>
	<!-- 搜索框 -->
	<div>
		<ElInput
			type="text"
			@keyup.enter="onSearch"
			text-center
			clearable
			v-model="word"
			placeholder="开启搜索之旅✨"
			class="v-input mx-1"
			:required="true"
		/>
	</div>
</template>

<script lang="ts" setup>
const router = useRouter();
// 搜索
let props = defineProps<{
	modelValue: string;
	isChange?: boolean | false;
}>();
// 实例
const instance = getCurrentInstance();
const word = computed({
	get(): string {
		return props.modelValue;
	},
	set(v: string) {
		instance?.emit("update:modelValue", v);
	},
});

const onSearch = () => {
	router.push({
		path: `/search`,
		query: {
			name: word.value.trim(),
		},
	});
};
</script>
<style lang="scss" scoped>
$input-width: min(22vw, 260px);

.v-input {
	:deep(.el-input__wrapper) {
		width: $input-width;
		transition: 0.4s;
		transition-timing-function: $animate-cubic-bount;
		letter-spacing: 0.2em;
		border-radius: 20px;
		font-weight: 600;
		height: 36px;
		padding: 0 20px;
		font-size: 14px;
		input::placeholder {
			transition: $transition-delay;
			font-weight: 600;
			color: var(--el-color-primary-light-5);
		}
		input:focus::placeholder {
			color: transparent;
		}
		input:focus,
		input:valid,
		&.is-focus {
			width: min(30vw, 360px);
		}
	}

	:deep(.el-input__inner):focus {
		width: min(30vw, 360px);
	}
}
.dark :deep(.el-input__wrapper) {
	input::placeholder {
		color: #fff;
	}
}
</style>
