<template>
	<ElButton @click="toggle" class="btn" mx-3 round>
		<span>{{ isDark ? "切换日间" : "切换夜间" }}</span>
		<!-- <OtherMoonSun /> -->
		<img
			src="@/assets/images/icon/sun.svg"
			class="w-1.3em h-1.3em"
			alt="sun 日间模式"
			v-if="!isDark"
		/>
		<img
			src="@/assets/images/icon/moon.svg"
			class="fill-light-5 w-1.3em h-1.3em"
			alt="sun 日间模式"
			v-else
		/>
	</ElButton>
</template>
<script lang="ts" setup>
// 切换动画
const mode = useColorMode();
const isDark = useDark();
// 节流watch
watchDebounced(isDark, (value) => {
	mode.preference = value ? "dark" : "light";
});
/**
 * 切换主题
 * @param event
 */
let toggle = (event: MouseEvent) => {
	// @ts-ignore
	let isAppearanceTransition =
		// @ts-ignore
		document.startViewTransition &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (!isAppearanceTransition || !event) {
		isDark.value = !isDark.value;
		return null;
	}
	// 画圆圈
	const x = event.clientX;
	const y = event.clientY;
	const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
	// @ts-expect-error: Transition API
	const transition = document.startViewTransition(() => {
		isDark.value = !isDark.value;
	});

	transition.ready.then(() => {
		const clipPath = [
			`circle(0px at ${x}px ${y}px)`,
			`circle(${endRadius.toFixed(0)}px at ${x}px ${y}px)`,
		];

		document.documentElement.animate(
			{
				clipPath: isDark.value ? clipPath : [...clipPath].reverse(),
			},
			{
				duration: 400,
				easing: "ease-in",
				pseudoElement: isDark.value
					? "::view-transition-new(root)"
					: "::view-transition-old(root)",
			}
		);
	});
};
</script>
<style lang="scss" scoped>
.btn {
	padding: 0em 0.4em;
	transition: $transition-delay;

	span {
		width: 0;
		overflow: hidden;
		transition: $transition-delay;
		letter-spacing: 0.1em;
	}

	&:hover span,
	&:focus span {
		width: 4.6em;
		margin: 0 0.4em;
	}
}
</style>
