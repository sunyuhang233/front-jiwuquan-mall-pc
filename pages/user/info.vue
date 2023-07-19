<script lang="ts" setup>
useHead({
	title: "信息 - 个人中心",
	meta: [
		{
			name: "description",
			content: "极物圈-个人中心",
		},
	],
});
// 页面
definePageMeta({
	pageTransition: false,
	layoutTransition: false,
});
const user = useUserStore();
</script>
<template>
	<div>
		<NuxtLayout name="user" :menu="['back']">
			<div v-show="user.isLogin">
				<!-- 壁纸 -->
				<UserInfoBgToggle />
				<div class="layout-default">
					<div class="avatar-card flex flex-wrap">
						<!-- 用户头像 -->
						<div class="avatars relative -top-6em flex-1">
							<UserInfoLine />
							<div class="m-2">
								<UserInfoTabs />
							</div>
						</div>
						<!-- 右侧 -->
						<div class="ml-2em mt-4">
							<!-- 签到 -->
							<UserInfoSigninCard />
						</div>
					</div>
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>
<style scoped lang="scss"></style>
