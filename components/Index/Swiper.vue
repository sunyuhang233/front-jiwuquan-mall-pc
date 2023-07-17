<script lang="ts" setup>
import { getEventsLists } from "~/composables/api/event";
import { BaseUrlImg } from "~/composables/utils/useFetchUtil";

// 活动事件列表
const eventList = reactive<EventVO[]>([]);
const isLoading = ref<boolean>(true);
// 请求
const { data, refresh } = await getEventsLists();
if (data.value && data.value.code === StatusCode.SUCCESS) {
	// 结束时间排序
	const res = data.value.data.sort((a, b) => b.status - a.status);
	res.forEach((p) => {
		eventList.push(p);
	});
	if (eventList.length === data.value.data.length) {
		setTimeout(() => {
			isLoading.value = false;
		}, 30);
	}
} else {
	// 失败重新请求
	setTimeout(() => {
		refresh();
	}, 30);
}
// 跳转详情页
const toEventDetailView = (eid: string) => {
	useRouter().push({
		path: "/event/detail",
		query: {
			eid,
		},
	});
};

// 计算剩余天数
const getEndDay = computed(() => {
	return (a: string, b: string): number => {
		let newDate = new Date().getTime();
		let start = Date.parse(a);
		let end = Date.parse(b);
		if (start > newDate) {
			// 未开始
			return 0;
		}
		if (end < newDate) {
			// 结束
			return -1;
		}
		return +((end - newDate) / (1 * 24 * 60 * 60 * 1000)).toFixed(0);
	};
});
</script>
<template>
	<el-carousel
		rounded-6px
		cursor-pointer
		:interval="6000"
		arrow="hover"
		my-4
		md:my-0
		mx-auto
		md:mx-none
		w-250px
		md:w="620px"
		h-280px
		md:h="420px"
		height="100%"
		class="w-4/5 swpier"
		trigger="click"
	>
		<!-- 骨架屏 -->
		<el-skeleton animated :loading="isLoading" class="ske">
			<template #template>
				<el-skeleton-item p-4 variant="image" class="sk-imgs" p-2 />
				<div p-4 flex-col style="height: 100%" justify-around>
					<el-skeleton-item variant="p" mb-1 style="width: 70%" />
					<el-skeleton-item variant="p" mb-1 style="width: 100%" />
				</div>
			</template>
			<!-- 内容 -->
			<template #default>
				<!-- 轮播图项 -->
				<el-carousel-item
					@click="toEventDetailView(p.id)"
					v-for="p in eventList"
					:key="p.id"
					class="swiper-item"
				>
					<ClientOnly>
						<!-- 图片 -->
						<el-image
							:class="!isLoading ? ' animate__blurIn' : ''"
							:src="BaseUrlImg + p.images"
							:alt="p.details"
							class="e-img"
							style="width: 100%; height: 100%"
							fit="fill"
						>
							<template #error>
								<div class="image-slot" flex-row-c-c>
									<ElIconPicture w-sm p-30 pt-20 opacity-80 flex-row-c-c />
								</div>
							</template>
						</el-image>
					</ClientOnly>
					<!-- 文本 -->
					<section
						class="tip"
						px-5
						py-3
						tracking-0.2em
						text-xs
						line-height-none
						md:text-1em
						md:line-height-normal
						flex
						flex-col
						justify-around
					>
						<h3 class="title">{{ p.title }}</h3>
						<!-- 已经结束 -->
						<p
							opacity-80
							v-if="getEndDay(p.startTime, p.endTime) < 0"
							style="text-decoration: line-through"
						>
							活动已经结束
						</p>
						<!-- 即将开始 -->
						<p
							opacity-80
							v-if="getEndDay(p.startTime, p.endTime) === 0"
							style="color: var(--el-color-success)"
						>
							活动即将开始
						</p>
						<!-- 正在进行 -->
						<p opacity-80 v-else-if="getEndDay(p.startTime, p.endTime) > 0">
							距离结束还有：<strong text-lg style="color: var(--el-color-error)">{{
								getEndDay(p.startTime, p.endTime)
							}}</strong>
							天
							<el-button plain cursor-pointer float-right opacity-60>更多</el-button>
						</p>
					</section>
				</el-carousel-item>
			</template>
		</el-skeleton>
	</el-carousel>
</template>
<style scoped lang="scss">
.dark .swpier {
	opacity: 0.86;
	background-color: transparent;
	border: 1px solid rgba(128, 128, 128, 0.2);
}

.swpier {
	backdrop-filter: blur(10px);
	border: 1px solid rgba(128, 128, 128, 0.2);
}

.ske {
	width: 100%;
	height: 100%;
	border-radius: 6px;

	.sk-imgs {
		width: 100%;
		height: 80%;
		transition: $transition-delay;
	}
}

.swiper-item {
	width: 100%;
	height: 100%;

	:deep(img) {
		height: 80%;
	}

	.tip {
		width: 100%;
		height: 20%;
		position: absolute;
		bottom: 0;
		z-index: 10;
	}
}

//  指示器
:deep(.el-carousel__indicators) {
	left: 20px;
	bottom: 22%;
	transform: translateX(0);

	li .el-carousel__button {
		height: 5px;
		border-radius: 2px;

		&.is-active {
			background-color: var(--el-color-primary);
		}
	}
}
</style>
